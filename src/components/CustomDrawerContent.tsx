import { View, Text, ScrollView } from 'react-native'
import {  Button, Divider, List } from 'react-native-paper'
import React,{useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { RootStackParamList } from '../NavigationParamList'
import { useSelector, useDispatch } from 'react-redux'
import {RootState} from '../store/store'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native'
import { resetStories } from '../store/features/storySlice'
import { SafeAreaView } from 'react-native-safe-area-context'
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>


const CustomDrawerContent = (props: DrawerContentComponentProps) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const stories = useSelector((state:RootState) => state.stories)

  const dispatch = useDispatch();

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
    <SafeAreaView className='flex-1'>
      <View className='mt-16'>
        <Text className='font-bold text-2xl text-center'>
          Previous Stories
        </Text>
       
        <View className='w-full h-[1px] bg-gray-300 mt-3'/>
        {/* <ScrollView
          className='mt-3 screen-container'
          contentContainerStyle={{ flexGrow:1, paddingBottom: 100 }}
          showsVerticalScrollIndicator
        >
          
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
                {index === stories.length -  1 ? <View></View> : <Divider/>}
              </React.Fragment>
            ))}
            
          {stories.length === 0 && (
            <Text className='text-gray-500 font-bold text-center text-lg'>No stories generated yet.</Text>
          )}
        </ScrollView> */}
        <FlatList 
          data={stories}
          keyExtractor={(item,index) => item.id?.toString() ?? index.toString()}
          contentContainerStyle = {{flexGrow:1, paddingBottom:100}}
          showsVerticalScrollIndicator
          ListEmptyComponent={() => (
            <Text className='text-gray-500 font-bold text-center text-lg'>
              No stories generated yet.
            </Text>
          )}
          renderItem={({item,index}) => (
            <>
              <List.Item
                onPress={() => {
                  navigation.navigate("Story", { storyData: item });
                }}
                title={() => (
                  <Text className="text-lg">
                    {item.title.replace(/^"|"$|/g, "")}
                  </Text>
                )}
                
                right={() =>
                  item.isFavorite ? (
                    <Ionicons name="star" size={24} color="#7742b7" />
                  ) : null
                }
              />
              {index === stories.length - 1 ? <View /> : <Divider />}
            </>
          )}
        />
        
    </View>
    </SafeAreaView>
  )
}

export default CustomDrawerContent

