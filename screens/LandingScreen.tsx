import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { LandingNavigatorParamList } from '../navigation';

interface LandingProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'Landing'>;
}

export const LandingScreen: React.FC<LandingProps> = ({ navigation }) => {
    return (
        <View style={ styles.view }> 
            <Button 
                style={ styles.button } 
                mode="contained" 
                onPress={() => navigation.navigate<"Login">({name: 'Login', params: {}})}
            >
                Iniciar Sesion
            </Button>
            <Button
                mode="contained" 
                onPress={() => navigation.navigate<"SignUp">({name: 'SignUp', params: {}})}
            >
                Registrarse
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginBottom: 30
    }
  });