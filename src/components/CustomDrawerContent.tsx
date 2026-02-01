import { View, Text, ScrollView, FlatList } from 'react-native'
import {  Button, Divider, List } from 'react-native-paper'
import React,{useState, useEffect, useMemo} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { RootStackParamList } from '../NavigationParamList'
import { useSelector, useDispatch } from 'react-redux'
import {RootState} from '../store/store'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { resetStories } from '../store/features/storySlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, CloseCircleIcon } from '@/components/ui/icon';
import { useDebounce }  from 'use-debounce';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>


const CustomDrawerContent = (props: DrawerContentComponentProps) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const stories = useSelector((state:RootState) => state.stories)

  const dispatch = useDispatch();

  // Story search functionality
  
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 300);

  const displayStories = useMemo(() => {
    const reversedStories = [...stories].reverse();

    if(!searchText.trim()) return reversedStories


    const query = searchText.toLowerCase();
    return reversedStories.filter((story) => {
      const searchableFields = [
        story.title,
        story.story,
        story.keywords,
      ].join(' ').toLowerCase();

      const words = query.split(' ').filter(Boolean);
      return words.every((word) => searchableFields.includes(word));
      })
    },[stories,searchText])
  
  

  type Story = {
    id: string;
    title: string;
    story: string;
    audio?:string;
    keywords: string[];
    timestamp: string;
    isFavorite: boolean;
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

  
 

  function calculateDaysAgo(storyDate: Date): string{
    const currentDate = new Date();
    const storyDateObj = new Date(storyDate);
    const timeDifference = currentDate.getTime() - storyDateObj.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if(daysAgo === 0){
      return 'Today';
    }else if(daysAgo === 1){
      return 'Yesterday';
    }
    return `${daysAgo} days ago`;
  }

  return (
    
    <SafeAreaView className='flex-1'>
      <View className='flex-1'>
        <Text className='font-bold text-2xl text-center'>
          Previous Stories
        </Text>

        <View className='w-full h-[1px] bg-gray-300 mt-3'/>

        <Input 
          className='m-2'
          variant='outline'
          size='lg'
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField 
            className='text-gray-500'
            placeholder="Search stories..."
            value={searchText}
            onChangeText={setSearchText} 
          />
          <InputSlot className="pr-3" onPress={() => setSearchText('')}>
            {searchText && (
              <InputIcon
                as={CloseCircleIcon}
              />
            )}
          </InputSlot>
        </Input>


        <View className='w-full h-[1px] bg-gray-300 mt-1'/>
        
        <FlatList 
          data={displayStories}
          keyExtractor={(item,index) => item.id?.toString() ?? index.toString()}
          contentContainerStyle = {{flexGrow:1, paddingBottom:100}}
          showsVerticalScrollIndicator
          ListEmptyComponent={() => (
            <Text className='mt-10 text-gray-500 font-bold text-center text-lg'>
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
                  <Text className="text-lg font-semibold">
                    {item.title.replace(/^"|"$|/g, "")}
                  </Text>
                )}

                description={() => (
                  <View className=''>
                    <View className='flex-row items-center'>
                      <Ionicons className='mt-2 ml-1' name="time-outline" size={24} color="#7742b7" />
                      <Text className="text-gray-500 text-lg ml-1 mt-2">
                       {`${calculateDaysAgo(new Date(item.timestamp))}`}
                      </Text>
                    </View>
                    <Text className='ml-2 mt-2'>{`Keywords: ${item.keywords}`}</Text>
                  </View>
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
      {/* <View className='flex-row p-4 justify-between'>
          <View className='flex-row'>
            <FontAwesome5 name="user-circle" size={28} color="black" />
            <Text className='font-semibold text-lg mx-4'>UserName</Text>
          </View>
          <SimpleLineIcons name="settings" size={28} color="black" />
      </View> */}
    </SafeAreaView>

  )
}

export default CustomDrawerContent

