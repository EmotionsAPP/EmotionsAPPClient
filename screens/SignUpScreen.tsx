import React, { useState } from "react";
import { TextInput, Button, IconButton } from "react-native-paper";
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../store";
import { signUpAction } from "../store/actions/authActions";
import { LandingNavigatorParamList } from "../navigation";
import { SignUpBody } from "../models";

interface SignUpProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'SignUp'>;
}

export const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {
    const [formData, setFormData] = useState<SignUpBody>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        taxId: '',
    });

    const [confirmPassowrd, setConfirm] = useState('');
    
    const dispatch = useDispatch();
    const appState = useSelector((state: ApplicationState) => state);

    const validForm = (): boolean => {
        return Object.values(formData).filter((value) => value == '').length < 1;
    }
    
    if(formData.physician == undefined)
        return (
            <View style={ styles.view }>
                <IconButton 
                    icon="chevron-left" 
                    style={ styles.backButton } 
                    onPress={() => navigation.goBack()}
                />
                <Button 
                    style={ styles.space }
                    onPress={() => setFormData({...formData, physician: false})}
                >Paciente</Button>
                <Button
                    onPress={() => setFormData({...formData, physician: true})}
                >Especialista</Button>
            </View>
        )
    else
        return (
            <View style={ styles.view }>
                <IconButton 
                    icon="chevron-left" 
                    style={ styles.backButton } 
                    onPress={() => setFormData({...formData, physician: undefined})}
                />
                <TextInput 
                    value={ formData.firstName }
                    onChangeText={ (text) => setFormData({ ...formData, firstName: text}) }
                    style={ styles.space } 
                    label="Nombre"
                />
                <TextInput 
                    value={ formData.lastName }
                    onChangeText={ (text) => setFormData({ ...formData, lastName: text}) }
                    style={ styles.space } 
                    label="Apellido"
                />
                <TextInput 
                    value={ formData.taxId }
                    onChangeText={ (text) => setFormData({ ...formData, taxId: text}) }
                    style={ styles.space } 
                    label="Cedula"
                />
                <TextInput 
                    value={ formData.email }
                    onChangeText={ (text) => setFormData({ ...formData, email: text}) }
                    style={ styles.space } 
                    label="Email"
                />
                <TextInput 
                    value={ formData.password }
                    onChangeText={ (text) => setFormData({ ...formData, password: text}) }
                    style={ styles.space } 
                    label="Contraseña"
                />
                <TextInput 
                    value={ confirmPassowrd }
                    onChangeText={ (text) => setConfirm(text) }
                    style={ styles.space } 
                    label="Confirmar contraseña"
                />
                <Button
                    mode="contained"
                    onPress={() => signUpAction(formData, dispatch, appState, navigation)}
                    disabled={!validForm() || formData.password != confirmPassowrd}
                >
                    Registrate
                </Button>
            </View>
        )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    space: {
        marginBottom: 30
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10
    }
});