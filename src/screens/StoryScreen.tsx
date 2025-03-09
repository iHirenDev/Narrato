import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import { IconButton, MD3Colors } from 'react-native-paper';
import React,{useState, useEffect} from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../NavigationParamList'
import OpenAI from 'openai'
import config from '../config'
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import polly from "../aws-config";
import { Buffer } from "buffer";


type StoryScreenRouteProp = RouteProp<RootStackParamList, 'Story'>



const openai = new OpenAI({
    apiKey: config.openai_api_key,
  })



const StoryScreen = ({route}: {route: StoryScreenRouteProp}) => {
  
  let soundInstance: Audio.Sound | null = null;

  const [loading, setLoading] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBackPosition, setPlayBackPosition] = useState(0);
  const {storyData} = route.params;

  useEffect(() => {
    // if(storyData.audio){
    //   loadAudio()
    // } else {
    //   generateAudio()
    // }
    // return () => {
    //   if(sound){
    //     sound.unloadAsync()
    //   }
    // }
    generateSound(storyData.story)
  }, [])
  
  /*

  EXPO Speech demo...

  const expoTTS =  (story: string) => {
    setIsPlaying(!isPlaying)
    Speech.speak(story)
    try {
      if (isPlaying) {
        Speech.pause()
      } else {
        Speech.resume()
      }

    } catch (error) {
      console.log('Error playing/pausing audio:', error);
      
    }
    //  setIsPlaying(!isPlaying)
    //  Speech.speak(story, { 
    //   language: 'en', 
    // });
  }
*/

  const generateSound = async (text: string):Promise<void> => {
    const params:AWS.Polly.SynthesizeSpeechInput = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna'
      };

      try {
        const data: AWS.Polly.SynthesizeSpeechOutput = await polly.synthesizeSpeech(params).promise();

        if (data.AudioStream) {
            const audioBuffer = new Uint8Array(data.AudioStream as ArrayBuffer);
            const base64Audio = Buffer.from(audioBuffer).toString("base64");
            
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
              }
            
            const { sound:newSound } = await Audio.Sound.createAsync({ uri: `data:audio/mp3;base64,${base64Audio}` });
                  // soundInstance = newSound;
                  // setIsPlaying(true); // Update UI state
                  // await soundInstance.playAsync();
            
                  newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                      if (status.didJustFinish) {
                        setPlayBackPosition(0); // Reset position after completion
                        setIsPlaying(false); // Update UI state
                      } else if (status.isPlaying) {
                        setPlayBackPosition(status.positionMillis); // Track playback position     
                    }
                    }
                  });
                  soundInstance = newSound;
                  setSound(newSound);
                } else {
                  console.error("Error: AudioStream is undefined or empty");
                }
      } catch (error) {
        console.error("Error generating speech:", error);
      }
    }
  
  const playSound = async () => {
    if(!sound) return

    try {
      if (isPlaying) {
        // Pause playback and store the current position
        const status = await sound.getStatusAsync();
        setPlayBackPosition(status.positionMillis);
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // Resume from the stored position
        await sound.setPositionAsync(playBackPosition);
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      
    }
  }

  /*

  OPENAI TTS DEMO...

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

  */
  return (
    <SafeAreaView>
    
      <ScrollView className='p-2'>
      
        <Text className='font-bold text-2xl text-center'>{storyData.title}</Text>

        <View className='bg-gray-200 rounded-l p-2'>
          <Text className='text-lg text-justify'>{storyData.story}</Text>
        </View>
        <View className='flex flex-row justify-end'>
          <IconButton 
            className=''
            icon='clipboard'
            iconColor='#826aed'
            size={30}
            // onPress={playPauseAudio}
          />
          <IconButton 
            className=''
            icon={isPlaying ? 'pause' : 'volume-high'}
            size={30}
            iconColor='#826aed'
            onPress={playSound}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default StoryScreen