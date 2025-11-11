import { View, TextInput, ScrollView } from 'react-native'
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

  const textInputRef = useRef<any>(null)

  const dispatch = useDispatch()

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
    <ScrollView>
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
      <View className="mt-8 p-2">
        <Text className="font-semibold text-lg mb-2">
          What’s your story about?
        </Text>
       
      </View>
      
     <View className='p-2 items-center'>
      <TextInput 
        ref={textInputRef}
        className='h-20 p-2 w-full border rounded-lg'
        // mode='outlined' 
        placeholder='Enter keywords for the story'
        value={storyPrompt}
        onChangeText={setStoryPrompt}
        multiline />

      {/* <Input
        className='mt-4 h-20 border border-black/70 rounded-lg'
        variant='outline'
        isDisabled={false}
        isRequired={true}
        size='md'
        
      >
        <InputField 
          className='mt-4 -ml-2 text-lg h-20'
          multiline
          value={storyPrompt}
          onChangeText={setStoryPrompt} 
          placeholder='Enter keywords for the story'
        />
      </Input> */}
      <View className='spacer-small'></View>


      {/* <PaperButton 
        buttonColor='#7742b7'
        onPress={handleGenerateStory}
        className='story-button'
        mode='contained'
      >
        {alertVisible && (
          <CustomAlertDialog
            alertHeading="Invalid Input"
            alertBody={alertMessage}
            onClose={() => setAlertVisible(false)}
          />
        )

        }
        {loading ? 
        // <ActivityIndicator size='small' color='#ffff'/> 
        // <Spinner size='large' color='white'/>
        <Progress.Circle size={30} color='#ffffff' borderWidth={3} indeterminate={true}/>
        : 
        'Generate Story'}
      </PaperButton>  */}
      
      <Button 
        className='story-button w-full rounded-2xl h-16'   
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
      
      <Text className='divider-text'>OR</Text>
      <View className='section-container'>
        <Text className='subtitle'>Choose story keywords from below themes</Text>
        <View className='keyword-container'>
          {
            FAVORITE_KEYWORDS.map((keyword,index) =>(
              <Chip
                className='keyword-chip'
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