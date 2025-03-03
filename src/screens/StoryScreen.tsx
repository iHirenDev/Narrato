import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import { Button, ActivityIndicator } from 'react-native-paper';
import React,{useState, useEffect} from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../NavigationParamList'
import OpenAI from 'openai'
import config from '../config'
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';


type StoryScreenRouteProp = RouteProp<RootStackParamList, 'Story'>



const openai = new OpenAI({
    apiKey: config.openai_api_key,
  })



const StoryScreen = ({route}: {route: StoryScreenRouteProp}) => {
  
  const [loading, setLoading] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const {storyData} = route.params;

  useEffect(() => {
    if(storyData.audio){
      loadAudio()
    } else {
      generateAudio()
    }
    return () => {
      if(sound){
        sound.unloadAsync()
      }
    }
  }, [])
  

  const generateAudio = async () => {
    setLoading(true)
    
  
    try {
      const speechResponse = await openai.audio.speech.create({
        model:'tts-1',
        voice:'alloy',
        input: storyData.story,
      });
  
      const audioData = await speechResponse.arrayBuffer();
      const uArr = new Uint8Array(audioData);
      let binary = '';
  
      uArr.forEach(byte =>{
        binary += String.fromCharCode(byte);
      });
  
      const base64Audio = btoa(binary);
      await loadAudioFromBase64(base64Audio);
    } catch (error) {
      console.log('Error generating audio:', error);  
    }
    setLoading(false)
  }
  
  const loadAudioFromBase64 = async (base64Audio: string) => {
    try {
      const audioPath = `${FileSystem.documentDirectory}story.mp3`;
      await FileSystem.writeAsStringAsync(audioPath, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: false }
      );
      
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };
  
  const loadAudio = async () => {
      if (storyData.audio) {
        await loadAudioFromBase64(storyData.audio);
      }
    };


    const playPauseAudio = async () => {
      if (!sound) return;
  
      try {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing/pausing audio:', error);
      }
    };
  return (
    <SafeAreaView>
    
      <ScrollView className='p-2'>
      
        <Text className='font-bold text-2xl text-center'>{storyData.title}</Text>
        
        <Button 
          className='bg-primary rounded-lg text-white' 
          mode='contained' 
          onPress={playPauseAudio}>
            {loading ? <ActivityIndicator size="small" color='#ffff'/>: isPlaying ? 'Pause' : 'Listen to the story'}
        </Button>

        <Text className='mt-4 text-lg text-justify'>{storyData.story}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default StoryScreen