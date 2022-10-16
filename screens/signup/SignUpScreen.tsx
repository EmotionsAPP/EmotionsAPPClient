import React, { useEffect, useState } from "react";
import { TextInput, Button, IconButton, HelperText } from "react-native-paper";
import { View, Image, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { signUpAction } from "../../store/actions/authActions";
import { LandingNavigatorParamList } from "../../navigation";
import { SignUpBody } from "../../models";
import { styles } from './style';
import { ScrollView } from "react-native-gesture-handler";
import { openNotificationSnackbar } from "../../store/actions/inAppActions";
import { NotificationSnackbar } from "../../components";

interface SignUpProps {
    navigation: NativeStackNavigationProp<LandingNavigatorParamList, 'SignUp'>;
}

export const SignUpScreen: React.FC<SignUpProps> = (props: any) => {
    const [formData, setFormData] = useState<SignUpBody>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const physicianFlag: boolean = props.route.params.physician;

    const [confirmPassowrd, setConfirm] = useState('');
    const [taxId, setTaxId] = useState('');
    
    const dispatch = useDispatch();
    const appState = useSelector((state: ApplicationState) => state);

    const validForm = () : boolean => {
        return Object.values(formData).filter((value) => value == '').length < 1;
    }

    const validEmail = () => {
        return !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email);
    }

    const validPassword = () => {
        return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g.test(formData.password);
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
                {
                    validEmail() && formData.email.length > 0 ?
                        <HelperText
                            type="error"
                            visible={validEmail()}
                            style={ { marginTop: -20 } } 
                        >
                            Correo electrónico incorrecto.
                        </HelperText>
                    :
                        <></>
                }
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
                {
                    (validPassword() && formData.password.length > 0) ?
                    <HelperText
                        type="error"
                        style={ { marginTop: -20, textAlign: 'center' } } 
                        visible={validPassword() || (formData.password.length < 8)}
                    >
                        {
                            formData.password.length < 8 ? 'Debe de incluir mas de 8 caracteres.'
                            : 'Debe incluir almenos una letra mayuscula [A-Z], una letra minuscula [a-z], un numero [0-9] y un signo especial [@$!%*?&].'
                        }
                    </HelperText> 
                    : 
                    <></>
                }
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
                {
                    confirmPassowrd.length > 0 && formData.password != confirmPassowrd ?
                        <HelperText
                            type="error"
                            style={ { marginTop: -20 } } 
                            visible={formData.password != confirmPassowrd}
                        >
                            Contraseñas no coinciden.
                        </HelperText>
                    :
                        <></>
                }
                <Pressable
                    style={ styles.mainButton }
                    disabled={ !validForm() || validEmail() || validPassword() || formData.password != confirmPassowrd }
                    onPress={ () => { 
                        signUpAction(physicianFlag ? { 
                                ...formData, psychologist: { idCardNo: taxId } 
                            }
                            :
                            {
                                ...formData, patient: {}
                            },
                            dispatch,
                            appState,
                            props.navigation,
                            physicianFlag
                        )
                    }}
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

