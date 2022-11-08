import React, { useState } from "react";
import { TextInput, Button, IconButton } from "react-native-paper";
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { signUpAction } from "../../store/actions/authActions";
import { LandingNavigatorParamList } from "../../navigation";
import { SignUpBody } from "../../models";
import { styles } from './style';
import { ScrollView } from "react-native-gesture-handler";

interface TypeAccountProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'TypeAccount'>;
}

export const TypeAccountScreen: React.FC<TypeAccountProps> = ({ navigation }) => {

    return (
        <ScrollView style={ { backgroundColor: 'white' } }>
            <View style={ styles.mainView }>
                <View style={ styles.backAndLogo }>
                    <IconButton 
                        icon="chevron-left" 
                        onPress={() => navigation.goBack()}
                    />
                    <View style={ styles.mainLogo }>
                        <Image
                            style={ styles.mainLogoImg }
                            source={
                                require('../../assets/icons/EmotionsIcon.png')
                            }
                        />
                        <Text style={ styles.mainLogoText }>Emotions</Text>
                    </View>
                </View>
                <View style={ styles.centerInfo }>
                    <Text style={ styles.headText }>Bienvenido</Text>
                    <Image
                        style={ styles.centerImg }
                        source={
                            require('../../assets/images/SignUpImage.png')
                        }
                    />
                    <Text style={ styles.centerText }>¿Qué tipo de cuenta vas a utilizar?</Text>
                    <Pressable 
                        style={ styles.selectAccountButton }
                        onPress={() => navigation.navigate<"SignUp">({name: 'SignUp', params: { physician: false }})}
                    >
                        <IconButton
                            icon="account"
                            color="white"
                        />
                        <Text style={ styles.selectAccountButtonText }>Paciente</Text>
                    </Pressable>
                    <Pressable
                        style={ styles.selectAccountButton }
                        onPress={() => navigation.navigate<"SignUp">({name: 'SignUp', params: { physician: true }})}
                    >
                        <IconButton
                            icon="clipboard-pulse-outline"
                            color="white"
                        />
                        <Text style={ styles.selectAccountButtonText }>Especialista</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

