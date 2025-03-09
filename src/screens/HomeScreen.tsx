import { View, Text, Keyboard } from 'react-native'
import { TextInput, Chip, Button, ActivityIndicator } from 'react-native-paper'
import React, {useState, useCallback} from 'react'
import OpenAI from 'openai'
import config from '../config'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../NavigationParamList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { log } from 'console'


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>

const HomeScreen = ({}) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [storyPrompt, setStoryPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState<Story | null>(null)

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: config.deepsee_api_key,
  })

  type Story = {
    id: string;
    title: string;
    story: string;
    audio?:string;
    timestamp: string;
  }

  useFocusEffect(
    useCallback(()=>{
      loadStories()
    },[])
  )

  const loadStories = async () => {
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      if (storiesJson) {
        setStories(JSON.parse(storiesJson));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  }

  const generateStory = async () => {
    if(!storyPrompt.trim()) return;

    setLoading(true);
    setStoryPrompt('');
    Keyboard.dismiss();
    try {
      const completion = await openai.chat.completions.create({
        messages:[
          {
            role:'system',
            content:'You are a creative story writer. Create a short,  engaging short story based on the given prompt.The story should be approximately 250-300 words long. Also provide a short title for the story. Make sure the story is complete and engaging despite its brevity.'
          },
          // You are a creative story writer. Create an engaging short story based on the given prompt. Also provide a short title for the story.


          // You are a creative story writer. Create a short,  engaging short story based on the given prompt.The story should be approximately 100-150 words long. Also provide a short title for the story. Make sure the story is complete and engaging despite its brevity.
          {
            role:'user',
            content:storyPrompt
          }
        ],
        // model:'gpt-4',
        model: "deepseek-chat",
        
        temperature: 1.5
      });

      const generatedStory = completion.choices[0]?.message?.content || '';
      const lines = generatedStory.split('\n');
      let title = '';
      
      if(generatedStory.includes('**Title:')){
        title = lines[0].replace(/\*\*/g, "").slice(6);
      } else{
        title = lines[0].replace(/\*\*/g, "");
      }
      
      const story = lines.slice(1).join('\n').trim();

      const timestamp = new Date().toISOString();

      const storyData: Story = {
        id: timestamp,
        title: title,
        story: story,
        timestamp
      };

      const exsistingStoriesData = await AsyncStorage.getItem('stories');
      const exsistingStories: Story[] = exsistingStoriesData ? JSON.parse(exsistingStoriesData) : [];
      const updatedStoriesData = [storyData, ...exsistingStories]
      await AsyncStorage.setItem('stories', JSON.stringify(updatedStoriesData));

      navigation.navigate('Story', {storyData});
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <View className=''>
      <View>
      <Text className='text-base text-center font-semibold'>Enter a few words or ideas, and let AI create a unique story for you!!!
      </Text>
      </View>
      <TextInput 
        className='m-2'
        mode='outlined' 
        label='Enter keywords for the story'
        value={storyPrompt}
        onChangeText={setStoryPrompt}
        multiline />

      <Button 
        buttonColor='#826aed'
         onPress={() => generateStory()}
        className='m-2 rounded-lg'
        mode='contained'
      >
        {loading ? <ActivityIndicator size='small' color='#ffff'/> : 'Generate Story'}
      </Button> 
    </View>
  )
}

export default HomeScreen