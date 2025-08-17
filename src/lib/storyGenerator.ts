import { Keyboard } from 'react-native';
import OpenAI from 'openai';
import config from './config';
import { addStory } from '../store/features/storySlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../NavigationParamList';
import { Dispatch } from '@reduxjs/toolkit';

export type Story = {
  id: string;
  title: string;
  story: string;
  isFavorite: boolean;
  audio?: string;
  timestamp: string;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

interface GenerateStoryParams {
  storyPrompt: string;
  setLoading: (loading: boolean) => void;
  navigation: HomeScreenNavigationProp;
  dispatch: Dispatch;
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: config.deepseek_api_key,
});

export const generateStory = async ({
  storyPrompt,
  setLoading,
  navigation,
  dispatch
}: GenerateStoryParams) => {
  if (!storyPrompt.trim()) return;

  setLoading(true);
  Keyboard.dismiss();
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative story writer. Create a short, engaging short story based on the given prompt. The story should be approximately 250-300 words long. Also provide a short title for the story. Make sure the story is complete and engaging despite its brevity.'
        },
        {
          role: 'user',
          content: storyPrompt
        }
      ],
      model: "deepseek-chat",
      temperature: 1.5
    });

    const generatedStory = completion.choices[0]?.message?.content || '';
    const lines = generatedStory.split('\n');
    let title = '';
    
    if (generatedStory.includes('**Title:')) {
      title = lines[0].replace(/\*\*/g, "").slice(6);
    } else {
      title = lines[0].replace(/\*\*/g, "");
    }
    
    const story = lines.slice(1).join('\n').trim();
    const timestamp = new Date().toISOString();

    const storyData: Story = {
      id: timestamp,
      title: title,
      story: story,
      isFavorite: false,
      timestamp
    };

    dispatch(addStory({
      id: timestamp,
      title: title,
      story: story,
      isFavorite: false,
      timestamp
    }));

    navigation.navigate('Story', { storyData });
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};