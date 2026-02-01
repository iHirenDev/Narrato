
import './global.css';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import StoryScreen from './src/screens/StoryScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import { RootStackParamList } from './src/NavigationParamList';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();


function DrawerNavigator() {
  return (
    
    <GluestackUIProvider mode="dark">
      <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7742b7',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 350,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Narrato',
        }}
      />
    </Drawer.Navigator>
    </GluestackUIProvider>
  
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
        <SafeAreaView className='flex-1' edges={['bottom']}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="DrawerNavigator" 
                component={DrawerNavigator} 
              />
              <Stack.Screen 
                name="Story" 
                component={StoryScreen}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: '#7742b7',
                  },
                  headerTintColor: '#fff',
                  headerBackTitle: 'Back',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          </SafeAreaView>
        {/* </GestureHandlerRootView> */}
      </PersistGate>
    </Provider>
  );
}




