import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { logInAction } from "../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../store";
import { LandingNavigatorParamList } from "../navigation";

interface LoginProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'Login'>;
}

export const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const appState = useSelector((state: ApplicationState) => state);
    
    return (
        <View style={ styles.view }>
            <TextInput 
                value={ email }
                onChangeText={ (text) => setEmail(text) }
                style={ styles.space } 
                label="Email"
            />
            <TextInput 
                value={ password }
                secureTextEntry={true}
                onChangeText={ (text) => setPassword(text) }
                style={ styles.space } 
                label="Contraseña"
            />
            <Button
                mode="contained"
                onPress={() => logInAction({email: email, password: password}, dispatch, appState, navigation)}
            >
                Iniciar Sesion
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    space: {
        marginBottom: 30,
        width: '50%'
    }
});