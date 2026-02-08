import { View, TextInput, ScrollView, Platform } from 'react-native'
import {  Chip, Button as PaperButton } from 'react-native-paper'
import React, {useState, useCallback, useRef} from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../NavigationParamList'
import {useDispatch} from 'react-redux'
import {generateStoryGemini} from '../lib/storyGenerator'
import { Image } from 'react-native'
import * as Progress from 'react-native-progress';
import { validateStoryPrompt } from '../lib/validateKeywords';
import { CustomAlertDialog } from '../components/CustomAlertDialog'
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>

const HomeScreen = ({}) => {

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [storyPrompt, setStoryPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [height, setHeight] = useState<number>(50)
  const textInputRef = useRef<any>(null)

  const dispatch = useDispatch()

  const newLogo = require('../../assets/images/new_circle_logo.png')

  const FAVORITE_KEYWORDS = [
  'space adventure',
  'magical tale',
  'underwater story',
  'time travel',
  'dragon tale',
  'fantasy world',
  'mysterious island',
  'superhero story',
  'robot adventure',
  'fairy tale',
  'post-apocalyptic world',
  'space exploration',
  'underwater adventure',
  'time loop',
  'magic school',
  'mythical creature',
  'robot revolution',
  'adventure in space',
  'mysterious planet',
  'pirate adventure',
];



  useFocusEffect(
    useCallback(()=>{
      //loadStories()
    },[])
  )

  // ScrollView method

  const scrollViewRef = useRef<ScrollView>(null);
  const targetRef = useRef<View>(null);

  const scrollToButton = () => {
    if(targetRef.current){
      targetRef.current.measure(
        (x,y,width,height, pageX, pageY) => {
          console.log(`Y postion:${y}`);
          
          scrollViewRef.current?.scrollTo({
            y: y + height,
            animated:true
          });
        },
       
      )
    }
  }

  

  const handleGenerateStory = () => {

    const validationError = validateStoryPrompt(storyPrompt);
    console.log(`Error:${validationError}`);
    
    if(validationError){
      setAlertMessage(validationError);
      setAlertVisible(true);
      setLoading(false)
      return;
    }

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
    <ScrollView ref={scrollViewRef}>
    <View className='screen-container'>
     {/* Header */}
     

      {/* Title + Subtitle */}
      <View className="items-center mt-8">
          {/* <Ionicons name="book-outline" size={28} color="white" /> */}
          <Image source={newLogo} className="w-32 h-32 rounded-full p-2" />
        
        <Text className="text-gray-700 text-2xl font-bold mt-4 text-center">
          Create Amazing Stories
        </Text>
        <Text className="text-gray-500 subtitle-text-color font-semibold text-center mt-2">
          Transform your ideas into captivating stories with the power of AI.
          Just describe what you want and watch magic happen.
        </Text>
      </View>
      <View className="mt-8 p-2">
        <Text className="text-gray-700 font-semibold text-lg mb-2">
          What’s your story about?
        </Text>
       
      </View>
      
     <View className='p-2 items-center'>
      
      <TextInput 
        ref={textInputRef}
        onFocus={scrollToButton}
        className={`flex-1 text-gray-800 p-2 bg-slate-200 w-full border border-gray-400 rounded-2xl shadow-md`}
        style={Platform.OS === 'android' ? { minHeight: 50, height: height } : {}}
        placeholderTextColor='gray'
        placeholder='Enter keywords (comma-separated): time travel, school'
        value={storyPrompt}
        onChangeText={setStoryPrompt}
        onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
        textAlignVertical='center'
        multiline
        onEndEditing={() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true
          })
        }}
        />

     
      <View className='spacer-small'></View>
      
      <View ref={targetRef} className='w-full items-center'>
        <Button 
        className='story-button w-full rounded-2xl h-16 shadow-md'   
        variant='solid' 
        size='md' 
        action='primary'
        onPress={handleGenerateStory}
      >
        <ButtonText>
          {alertVisible && (
          <CustomAlertDialog
            alertHeading="Invalid Input"
            alertBody={alertMessage}
            onClose={() => setAlertVisible(false)}
          />
        )
        }
          {
            loading ? 
            <Progress.Circle 
              size={30} 
              color='#ffffff' 
              borderWidth={2} 
              indeterminate={true}
            />
            : 
            <Text className='text-white font-semibold text-lg'>Generate Story</Text>
          }
        </ButtonText>
      </Button>
      </View>
      </View>
      
      <Text className='text-gray-700 divider-text'>OR</Text>
      <View className='section-container'>
        <Text className='subtitle text-gray-700'>Choose story keywords from below themes</Text>
        <View className='keyword-container'>
          {
            FAVORITE_KEYWORDS.map((keyword,index) =>(
              <Chip
                className='keyword-chip shadow-md'
                key={index}
                onPress={() => {
                  setStoryPrompt(keyword)
                  // Trigger focus to animate the label
                  if (textInputRef.current) {
                    textInputRef.current.focus()
                    setTimeout(() => {
                      textInputRef.current.blur()
                    }, 100)
                  }
                }}
                mode='outlined'>
                {keyword}
              </Chip>
            ))
          }
        </View>
      </View>
    </View>
    </ScrollView>
  )
}


export default HomeScreen