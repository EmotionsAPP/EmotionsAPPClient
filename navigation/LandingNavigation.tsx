import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LandingScreen, SignUpScreen, LoginScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShellContainer } from '../containers';

export type LandingNavigatorParamList = {
  Landing: {},
  Login: {},
  SignUp: {},
  Shell: {}
}

const Stack = createNativeStackNavigator<LandingNavigatorParamList>();

export const LandingNavigation = () => {
    return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen
              name="Landing"
              component={ LandingScreen }
            />
            <Stack.Screen
              name="Login"
              component={ LoginScreen }
            />
            <Stack.Screen
              name="SignUp"
              component={ SignUpScreen }
            />
            <Stack.Screen
              name="Shell"
              component={ ShellContainer }
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
}