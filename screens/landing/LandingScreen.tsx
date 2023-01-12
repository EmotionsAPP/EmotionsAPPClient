import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { LandingNavigatorParamList } from '../../navigation';
import { styles } from './style';
import { ScrollView } from 'react-native-gesture-handler';
import { traduct } from '../../langs';

interface LandingProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'Landing'>;
}

export const LandingScreen: React.FC<LandingProps> = ({ navigation }) => {
    return (
        <ScrollView style={ { backgroundColor: 'white' } }> 
            <View style={ styles.view }>
                <Text style={ styles.welcomeText } >{traduct("welcomeTo")}</Text>
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
                    {traduct("slogan")}
                </Text>
                <Text style={ styles.secondaryInfo }>
                    {traduct("description")}
                </Text>
                <Pressable 
                    style={ styles.mainButton } 
                    onPress={() => navigation.navigate<"Login">({name: 'Login', params: {}})}
                >
                    <Text style={ styles.mainButtonText }>{traduct("login")}</Text>
                </Pressable>
                <Text style={ { fontSize: 20 } }>
                    {traduct("or")}
                </Text>
                <Pressable
                    style={ styles.secondaryButton }
                    onPress={() => navigation.navigate<"TypeAccount">({name: 'TypeAccount', params: {}})}
                >
                    <Text style={ styles.secondaryButtonText }>{traduct("register")}</Text>
                </Pressable>
                <Text style={ styles.termsAndConditionsText }>
                    {traduct("conditions1")}&nbsp;
                    <Text style={ styles.termsAndConditionsLink }>{traduct("conditions2")}</Text> 
                    &nbsp;{traduct("conditions3")}
                </Text>
            </View>
        </ScrollView>
    )
}