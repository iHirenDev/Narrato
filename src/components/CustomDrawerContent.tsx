import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import {  List } from 'react-native-paper'
import React,{useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../NavigationParamList'
import { useSelector } from 'react-redux'
import {RootState} from '../store/store'
import Ionicons from '@expo/vector-icons/Ionicons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>


const CustomDrawerContent = () => {

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const stories = useSelector((state:RootState) => state.stories)

  type Story = {
    id: string;
    title: string;
    story: string;
    audio?:string;
    timestamp: string;
  }

  

  // const loadStories = async () => {
  //   try {
  //     const storiesJson = await AsyncStorage.getItem('stories');
  //     if (storiesJson) {
  //       setStories(JSON.parse(storiesJson));
  //     }
  //   } catch (error) {
  //     console.error('Error loading stories:', error);
  //   }
  // };

  return (
    <SafeAreaView>
      <View className='mt-12'>
        <Text className='font-bold text-2xl pl-2'>Previous Stories</Text>
        <View className='w-full h-[1px] bg-gray-300 mt-3'/>
        <ScrollView>
          
            {stories.map((story, index) => (
            <React.Fragment key={index}> 
              <List.Item 
                onPress={() => {
                  navigation.navigate('Story', {storyData: story});
                }}
                
                key={index} 
                title={() => (
                  <Text className='text-lg'>{story.title.replace(/^"|"$|/g, '')}</Text>
                )}
                right={() => (
                  story.isFavorite ? 
                  <Ionicons name="star" size={24} color='#515151' /> : <></>
                )}
                />  
              </React.Fragment>
            ))}
            
          {stories.length === 0 && (
            <Text className='text-gray-500 font-bold text-center text-lg'>No stories generated yet.</Text>
          )}
        </ScrollView>
        
    </View>
    </SafeAreaView>
  )
}

export default CustomDrawerContent

