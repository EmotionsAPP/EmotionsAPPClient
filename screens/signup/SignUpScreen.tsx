import React, { useEffect, useState } from "react";
import { TextInput, Button, IconButton, HelperText } from "react-native-paper";
import { View, Image, Text, Pressable, ActivityIndicator } from 'react-native';
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
import { traduct } from "../../langs";

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
                <Text style={ styles.headText }>{traduct("registerOf")} { physicianFlag ? traduct("specialist") : traduct("pacient")}</Text>
                <TextInput 
                    value={ formData.firstName }
                    onChangeText={ (text) => setFormData({ ...formData, firstName: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label={traduct("name")}
                />
                <TextInput 
                    value={ formData.lastName }
                    onChangeText={ (text) => setFormData({ ...formData, lastName: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label={traduct("lastName")}
                />
                {
                    physicianFlag ? 
                        <TextInput 
                            value={ taxId }
                            onChangeText={ (text) => setTaxId(text) }
                            style={ styles.textInput } 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            maxLength={11}
                            label={traduct("idCard")}
                        />
                    : 
                        <></>
                }
                {
                    physicianFlag && taxId.length < 11 && taxId.length > 0 ?
                        <HelperText
                            type="error"
                            visible={physicianFlag && taxId.length < 11 && taxId.length > 0}
                            style={ { marginTop: -20 } } 
                        >
                            {traduct("mustContainIdCard")}
                        </HelperText>
                    :
                        <></>
                }
                <TextInput 
                    value={ formData.email }
                    onChangeText={ (text) => setFormData({ ...formData, email: text}) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label={traduct("email")}
                />
                {
                    validEmail() && formData.email.length > 0 ?
                        <HelperText
                            type="error"
                            visible={validEmail()}
                            style={ { marginTop: -20 } } 
                        >
                            {traduct("incorrectEmail")}
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
                    label={traduct("password")}
                />
                {
                    (validPassword() && formData.password.length > 0) ?
                    <HelperText
                        type="error"
                        style={ { marginTop: -20, textAlign: 'center' } } 
                        visible={validPassword() || (formData.password.length < 8)}
                    >
                        {
                            formData.password.length < 8 ? traduct("includePassword")
                            : traduct("mustContainPassword")
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
                    label={traduct("confirmPassword")}
                />
                {
                    confirmPassowrd.length > 0 && formData.password != confirmPassowrd ?
                        <HelperText
                            type="error"
                            style={ { marginTop: -20 } } 
                            visible={formData.password != confirmPassowrd}
                        >
                            {traduct("noCoincidencePassword")}
                        </HelperText>
                    :
                        <></>
                }
                {
                    appState.auth?.signingUp ?
                        <ActivityIndicator size="large" color="#DB6551" />
                    :
                    <View style={ styles.bottomView }>
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
                            <Text style={ styles.mainButtonText }>{traduct("register")}</Text>
                        </Pressable>
                        <View style={ styles.bottomTextView }>
                            <Text style={ styles.bottomText }>
                                {traduct("hasAccount")}&nbsp;
                            </Text>
                            <Pressable>
                                <Text style={ styles.bottomTextLink }>{traduct("login")}</Text>
                            </Pressable>
                        </View>
                    </View>
                }
            </View>
        </ScrollView>
    )
}
