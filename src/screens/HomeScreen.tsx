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
    <View className='p-2'>
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
  <View className='h-5'></View>
      <Button 
        buttonColor='#826aed'
        onPress={handleGenerateStory}
        className='m-2'
        mode='contained'
      >
        {loading ? <ActivityIndicator size='small' color='#ffff'/> : 'Generate Story'}
      </Button> 
      <Text className='text-center font-bold p-4'>OR</Text>
      <View className='m-2'>
        <Text className='font-semibold text-base'>Choose story keywords from below themes</Text>
        <View className='flex flex-row flex-wrap mt-2'>
          {
            FAVORITE_KEYWORDS.map((keyword,index) =>(
              <Chip
                className='m-1'
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