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

interface SignUpProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'SignUp'>;
}

export const SignUpScreen: React.FC<SignUpProps> = (props: any) => {
    const [formData, setFormData] = useState<SignUpBody>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        taxId: '',
    });

    const physicianFlag: boolean = props.route.params.physician;

    const [confirmPassowrd, setConfirm] = useState('');
    
    const dispatch = useDispatch();
    const appState = useSelector((state: ApplicationState) => state);

    const validForm = () : boolean => {
        return Object.values(formData).filter((value) => value == '').length < 1;
    }

    return (
        <ScrollView style={ styles.mainView }>
            <View style={ styles.backAndLogo }>
                <IconButton 
                    icon="chevron-left" 
                    onPress={() => props.navigation.goBack()}
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
                <Text style={ styles.headText }>Registro de { physicianFlag ? 'especialista' : 'paciente'}</Text>
                <TextInput 
                    value={ formData.firstName }
                    onChangeText={ (text) => setFormData({ ...formData, firstName: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label="Nombre"
                />
                <TextInput 
                    value={ formData.lastName }
                    onChangeText={ (text) => setFormData({ ...formData, lastName: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label="Apellido"
                />
                <TextInput 
                    value={ formData.email }
                    onChangeText={ (text) => setFormData({ ...formData, email: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label="Correo electrónico"
                />
                <TextInput 
                    value={ formData.password }
                    onChangeText={ (text) => setFormData({ ...formData, password: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    secureTextEntry
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label="Contraseña"
                />
                <TextInput 
                    value={ confirmPassowrd }
                    onChangeText={ (text) => setConfirm(text) }
                    style={ styles.textInput } 
                    mode="outlined"
                    secureTextEntry
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label="Confirma la contraseña"
                />
                <Pressable
                    style={ styles.mainButton }
                >
                    <Text style={ styles.mainButtonText }>Registrate</Text>
                </Pressable>
                <View style={ styles.bottomTextView }>
                    <Text style={ styles.bottomText }>
                        ¿Ya tienes una cuenta?&nbsp;
                    </Text>
                    <Pressable>
                        <Text style={ styles.bottomTextLink }>Inicia sesión</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

