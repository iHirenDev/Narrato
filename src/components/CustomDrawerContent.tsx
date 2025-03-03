import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import {  List } from 'react-native-paper'
import React,{useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CustomDrawerContent = () => {

  const [stories, setStories] = useState<Story[]>([])

  type Story = {
    id: string;
    title: string;
    story: string;
    audio?:string;
    timestamp: string;
  }

  useEffect(() => {
    loadStories()
  }, [stories]);

  const loadStories = async () => {
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      if (storiesJson) {
        setStories(JSON.parse(storiesJson));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

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
              }}
              key={index} 
              title={() => (
                <Text className='font-bold text-lg'>{story.title.replace(/^"|"$|/g, '')}</Text>
              )}/>
              
            </React.Fragment>
          ))}
          {stories.length === 0 && (
            <Text className='text-gray-500'>No stories generated yet.</Text>
          )}
        </ScrollView>
        
    </View>
    </SafeAreaView>
  )
}

export default CustomDrawerContent

