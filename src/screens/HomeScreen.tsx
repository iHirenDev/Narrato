import { View, Text, TouchableOpacity } from 'react-native'
import { TextInput, Chip, Button, ActivityIndicator } from 'react-native-paper'
import React, {useState, useCallback, useEffect} from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../NavigationParamList'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from '../store/store'
import { generateStory } from '../lib/storyGenerator'
import {generateStoryGemini} from '../lib/storyGenerator'
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'react-native'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>

const HomeScreen = ({}) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [storyPrompt, setStoryPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const logo = require('../../assets/images/circle_logo.png')
  const newLogo = require('../../assets/images/new_circle_logo.png')

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
    generateStoryGemini({
      storyPrompt,
      setLoading,
      navigation,
      dispatch
    });
    // generateStory({
    //   storyPrompt,
    //   setLoading,
    //   navigation,
    //   dispatch
    // });
  };

  return (
    <View className='screen-container'>
     {/* Header */}
     

      {/* Title + Subtitle */}
      <View className="items-center mt-8">
          {/* <Ionicons name="book-outline" size={28} color="white" /> */}
          <Image source={newLogo} className="w-32 h-32 rounded-full p-2" />
        
        <Text className="text-2xl font-bold mt-4 text-center">
          Create Amazing Stories
        </Text>
        <Text className="text-gray-500 font-semibold text-center mt-2">
          Transform your ideas into captivating stories with the power of AI.
          Just describe what you want and watch magic happen.
        </Text>
      </View>
      <View className="mt-8">
        <Text className="font-semibold text-lg mb-2">
          What’s your story about?
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
        buttonColor='#7742b7'
        onPress={handleGenerateStory}
        className='story-button'
        mode='contained'
      >
        {loading ? 
        <ActivityIndicator size='small' color='#ffff'/> 
        : 
        'Generate Story'}
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