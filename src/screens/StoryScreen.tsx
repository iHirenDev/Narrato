import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { Divider, IconButton, MD3Colors, Snackbar } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../NavigationParamList";
import OpenAI from "openai";
import config from "../lib/config";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import polly from "../lib/aws-config";
import { Buffer } from "buffer";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from "expo-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../store/features/storySlice";

type StoryScreenRouteProp = RouteProp<RootStackParamList, "Story">;

const openai = new OpenAI({
  apiKey: config.openai_api_key,
});

const StoryScreen = ({ route }: { route: StoryScreenRouteProp }) => {
  let soundInstance: Audio.Sound | null = null;

  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBackPosition, setPlayBackPosition] = useState(0);
  const [copiedStory, setCopiedStory] = useState("");
  const [visible, setVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { storyData } = route.params;

  const dispatch = useDispatch();
  const story = useSelector((state: RootState) =>
    state.stories.find((s) => s.id === storyData.id)
  );

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
    generateSound(storyData.story);
  }, []);

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

  const copyStoryToClipboard = async () => {
    await Clipboard.setStringAsync(storyData.story);
    setCopiedStory(storyData.story);
    setVisible(true);
  };

  const toggleFavorites = (id: string) => {
    dispatch(toggleFavorite(id));
  };


  const regenerateStory = () => {

  }

  const onDismissSnackBar = () => setVisible(false);

  const generateSound = async (text: string): Promise<void> => {
    const params: AWS.Polly.SynthesizeSpeechInput = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Joanna",
    };

    try {
      const data: AWS.Polly.SynthesizeSpeechOutput = await polly
        .synthesizeSpeech(params)
        .promise();

      if (data.AudioStream) {
        const audioBuffer = new Uint8Array(data.AudioStream as ArrayBuffer);
        const base64Audio = Buffer.from(audioBuffer).toString("base64");

        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: `data:audio/mp3;base64,${base64Audio}`,
        });
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
  };

  const playSound = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        // Pause playback and store the current position
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPlayBackPosition(status.positionMillis);
        }
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // Resume from the stored position
        await sound.setPositionAsync(playBackPosition);
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {}
  };

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
    <SafeAreaView className="flex-1">

      
        <View>
          <Text className="title-large mb-2 py-4">{storyData.title}</Text>
          <Divider/>
        </View>
        {/* Button's for user actions */}
        <View className="p-2 mt-4 mb-4 flex flex-row justify-center gap-10">
          <View className="flex flex-col justify-center items-center rounded-md h-24 w-20 border border-gray-500">
            <IconButton
              icon={() => <FontAwesome5 name="copy" size={35} color="#09046f" />}
              // iconColor="#09046f"
              // size={35}
              onPress={copyStoryToClipboard}
            />
            <Text className="text-center">Copy</Text>
          </View>

          <View className="flex flex-col justify-center items-center rounded-md h-24 w-20 border border-gray-500">
          <IconButton
            icon={() =>
              isPlaying ? (
                <Ionicons name="pause-sharp" size={35} color="#09046f" />
              ) : (
                <Feather name="volume-2" size={35} color="#09046f" />
              )
            }
            // size={30}
            iconColor="#09046f"
            onPress={playSound}
          />
            <Text className="text-center">Listen</Text>
          </View>

          <View className="flex flex-col justify-center items-center rounded-md h-24 w-20 border border-gray-500">
          <IconButton
            icon={() =>
              story?.isFavorite ? (
                <Ionicons name="star" size={35} color="#09046f" />
              ) : (
                <Ionicons name="star-outline" size={35} color="#09046f" />
              )
            }
            iconColor="#09046f"
            onPress={() => toggleFavorites(storyData.id)}
          />
            <Text className="text-center">Favorite</Text>
          </View>

          <View className="flex flex-col justify-center items-center rounded-md h-24 w-[82px] border border-gray-500">
          <IconButton
              icon={() => <FontAwesome name="repeat" size={35} color="#09046f" />}
              iconColor="#09046f"
              // size={35}
              onPress={regenerateStory}
            />
            <Text className="text-center">Regenerate</Text>
          </View>
        </View>
      <ScrollView 
        className="screen-container"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={true}  
      >
        <View className="story-content-box">
          <Text className="story-text">{storyData.story}</Text>
        </View>
        {/* <View className="action-buttons-row">
          <IconButton
            icon={() => <FontAwesome5 name="copy" size={30} color="#515151" />}
            iconColor="#826aed"
            size={30}
            onPress={copyStoryToClipboard}
          />
          <IconButton
            icon={() =>
              isPlaying ? (
                <Ionicons name="pause-sharp" size={30} color="#515151" />
              ) : (
                <Feather name="volume-2" size={30} color="#515151" />
              )
            }
            size={30}
            iconColor="#826aed"
            onPress={playSound}
          />
          <IconButton
            icon={() =>
              story?.isFavorite ? (
                <Ionicons name="star" size={30} color="#515151" />
              ) : (
                <Ionicons name="star-outline" size={30} color="#515151" />
              )
            }
            size={30}
            iconColor="#826aed"
            onPress={() => toggleFavorites(storyData.id)}
          />
        </View> */}
        
      </ScrollView>
      <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={2000}
          elevation={4}
          action={{
            label: "OK",
            onPress: () => {
              onDismissSnackBar;
            },
          }}
        >
          Story copied
        </Snackbar>
    </SafeAreaView>
  );
};

export default StoryScreen;
