import React, { useState } from "react";
import { TextInput, Button, IconButton } from "react-native-paper";
import { View, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { logInAction } from "../../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { LandingNavigatorParamList } from "../../navigation";
import { styles } from './style';
import { ScrollView } from "react-native-gesture-handler";

interface LoginProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'Login'>;
}

export const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const appState = useSelector((state: ApplicationState) => state);
    
    return (
        <ScrollView style={ styles.mainView }>
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
                <Text style={ styles.headText }>Iniciar sesión</Text>
                <Image
                    style={ styles.centerImg }
                    source={
                        require('../../assets/images/LoginImage.png')
                    }
                />
                {
                    appState.auth?.loginError ? 
                        <View style={ styles.loginErrorView }>
                            <IconButton
                                color="white"
                                icon="close-circle-outline"
                            />
                            <Text
                                style={ styles.loginErrorText }
                            >
                                Su correo o contraseña son incorrectos. Inténtelo nuevamente.
                            </Text>
                        </View>
                    :
                        <></>
                }
                {
                    appState.auth?.loggingIn ? 
                        <ActivityIndicator size="large" color="#DB6551" />
                    :
                        <View style={ styles.formView }>
                            <TextInput 
                                value={ email }
                                onChangeText={ (text) => setEmail(text) }
                                style={ styles.textInput } 
                                mode="outlined"
                                outlineColor="#DB6551"
                                activeOutlineColor="#DB6551"
                                theme={{roundness: 30}}
                                label="Correo electrónico"
                            />
                            <TextInput 
                                value={ password }
                                onChangeText={ (text) => setPassword(text) }
                                style={ styles.textInput } 
                                mode="outlined"
                                secureTextEntry
                                outlineColor="#DB6551"
                                activeOutlineColor="#DB6551"
                                theme={{roundness: 30}}
                                label="Contraseña"
                            />
                            <Pressable
                                style={ styles.mainButton }
                                onPress={() => logInAction({email: email, password: password}, dispatch, appState, navigation)}
                            >
                                <Text style={ styles.mainButtonText }>Inicia sesión</Text>
                            </Pressable>
                            <View style={ styles.bottomTextView }>
                                <Text style={ styles.bottomText }>
                                    ¿No tienes una cuenta?&nbsp;
                                </Text>
                                <Pressable>
                                    <Text style={ styles.bottomTextLink }>Registrate</Text>
                                </Pressable>
                            </View>
                        </View>
                }
            </View>
        </ScrollView>
    )
}

