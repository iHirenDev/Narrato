
import './global.css';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import StoryScreen from './src/screens/StoryScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import { RootStackParamList } from './src/NavigationParamList';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();


function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#09046f',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 350,
        },

      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Narrato',
        }}
      />
    </Drawer.Navigator>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
                    backgroundColor: '#09046f',
                  },
                  headerTintColor: '#fff',
                  headerBackTitle: 'Back',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
  );
}

