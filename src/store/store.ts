import {configureStore} from '@reduxjs/toolkit'
import {persistStore, persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import storiesReducer from './features/storySlice'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedStoriesReducer = persistReducer(persistConfig, storiesReducer)

export const store = configureStore({
    reducer: persistedStoriesReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore these Redux Persist actions
        },
      }),
  });

export const persistor = persistStore(store)


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch