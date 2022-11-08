import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { LandingNavigatorParamList } from '../../navigation';
import { styles } from './style';
import { ScrollView } from 'react-native-gesture-handler';

interface LandingProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'Landing'>;
}

export const LandingScreen: React.FC<LandingProps> = ({ navigation }) => {
    return (
        <ScrollView style={ { backgroundColor: 'white' } }> 
            <View style={ styles.view }>
                <Text style={ styles.welcomeText } >Bienvenido a</Text>
                <View style={ styles.mainLogo }>
                    <Image
                        style={ styles.mainLogoImg }
                        source={
                            require('../../assets/icons/EmotionsIcon.png')
                        }
                    />
                    <Text style={ styles.mainLogoText }>Emotions</Text>
                </View>
                <Text style={ styles.mainInfo }>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
                <Text style={ styles.secondaryInfo }>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mattis orci eleifend efficitur sagittis. Nunc sed orci nibh. Nulla convallis tellus sed.
                </Text>
                <Pressable 
                    style={ styles.mainButton } 
                    onPress={() => navigation.navigate<"Login">({name: 'Login', params: {}})}
                >
                    <Text style={ styles.mainButtonText }>Inicia sesión</Text>
                </Pressable>
                <Text style={ { fontSize: 20 } }>
                    o
                </Text>
                <Pressable
                    style={ styles.secondaryButton }
                    onPress={() => navigation.navigate<"TypeAccount">({name: 'TypeAccount', params: {}})}
                >
                    <Text style={ styles.secondaryButtonText }>Registrate</Text>
                </Pressable>
                <Text style={ styles.termsAndConditionsText }>
                    Al seguir, estás accediendo a los&nbsp;
                    <Text style={ styles.termsAndConditionsLink }>términos y condiciones</Text> 
                    &nbsp;de la aplicación.
                </Text>
            </View>
        </ScrollView>
    )
}