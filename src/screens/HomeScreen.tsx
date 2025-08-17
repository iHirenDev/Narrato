import { View, Text } from 'react-native'
import { TextInput, Chip, Button, ActivityIndicator } from 'react-native-paper'
import React, {useState, useCallback} from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../NavigationParamList'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from '../store/store'
import { generateStory } from '../lib/storyGenerator'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>

const HomeScreen = ({}) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [storyPrompt, setStoryPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const FAVORITE_KEYWORDS = [
  'space adventure',
  'magical tale',
  'underwater story',
  'time travel',
  'dragon tale',
  'mystery',
  'alien story',
  'pirate adventure',
];



  useFocusEffect(
    useCallback(()=>{
      //loadStories()
    },[])
  )

  

  const handleGenerateStory = () => {
    generateStory({
      storyPrompt,
      setLoading,
      navigation,
      dispatch
    });
  };

  return (
    <View className='screen-container'>
      <View>
        <Text className='title-medium'>Enter a few words or ideas, and let AI create a unique story for you!!!
        </Text>
      </View>
      <TextInput 
        className='story-input'
        mode='outlined' 
        label='Enter keywords for the story'
        value={storyPrompt}
        onChangeText={setStoryPrompt}
        multiline />
      <View className='spacer-small'></View>
      <Button 
        buttonColor='#826aed'
        onPress={handleGenerateStory}
        className='story-button'
        mode='contained'
      >
        {loading ? <ActivityIndicator size='small' color='#ffff'/> : 'Generate Story'}
      </Button> 
      <Text className='divider-text'>OR</Text>
      <View className='section-container'>
        <Text className='subtitle'>Choose story keywords from below themes</Text>
        <View className='keyword-container'>
          {
            FAVORITE_KEYWORDS.map((keyword,index) =>(
              <Chip
                className='keyword-chip'
                key={index}
                onPress={() => setStoryPrompt(keyword)}
                mode='outlined'>
                {keyword}
              </Chip>
            ))
          }
        </View>
      </View>
    </View>
  )
}


export default HomeScreen