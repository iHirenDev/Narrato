import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface Story{
    id: string;
    title: string;
    story: string;
    audio?:string;
    isFavorite: boolean;
    timestamp: string;
}

interface StoriesState{
    stories: Story[];
}

const initialState: StoriesState = {
    stories: [],
}

const storiesSlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {
        addStory: (state, action: PayloadAction<Story>) => {
            state.stories.push(action.payload);
        },
        setStories:(state, action: PayloadAction<Story[]>) => {
            state.stories = action.payload
        },
        // For future implementation
        removeStory: (state, action: PayloadAction<string>) => {
            state.stories = state.stories.filter(story => story.id !== action.payload);
        },
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const story = state.stories.find(story => story.id === action.payload);
            if (story) {
              story.isFavorite = !story.isFavorite;
            }
          },
    }
});

export const {addStory, removeStory, toggleFavorite, setStories} = storiesSlice.actions;
export default storiesSlice.reducer;