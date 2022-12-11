import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { LoginBody, SignUpBody, User } from "../../models";
import { getEmergencyPsychologists, getPsychologists, getUser, signIn, signUp } from "../services/authService";
import { openNotificationSnackbar, requestPushTokenAction } from "./inAppActions";
import { editProfileAction } from "./profileActions";

interface RequestLogin {
    type: 'REQUEST_LOGIN';
    login: LoginBody;
}

interface ResponseLogin {
    type: 'RESPONSE_LOGIN';
    logged: any;
}

interface RequestSignUp {
    type: 'REQUEST_SIGNUP';
    user: SignUpBody;
}

interface ResponseSignUp {
    type: 'RESPONSE_SIGNUP';
    createdUser: SignUpBody;
}

interface LoginError {
    type: 'LOGIN_ERROR';
}

interface LogOut {
    type: 'LOGOUT'
}

interface RequestUser {
    type: 'REQUEST_USER';
    userId: string;
}

interface ResponseUser {
    type: 'RESPONSE_USER';
    user: User;
}

interface ErrorUser {
    type: 'ERROR_USER';
}

interface RequestPsychologists {
    type: 'REQUEST_PSYS';
    userId: string;
}

interface ResponsePsychologists {
    type: 'RESPONSE_PSYS';
    psychologists: User[];
}

interface ErrorPsychologists {
    type: 'ERROR_PSYS';
}

interface RequestEmPsychologists {
    type: 'REQUEST_EM_PSYS';
    userId: string;
}

interface ResponseEmPsychologists {
    type: 'RESPONSE_EM_PSYS';
    psychologists: User[];
}

interface ErrorEmPsychologists {
    type: 'ERROR_EM_PSYS';
}

export type KnownAction = RequestLogin 
| ResponseLogin 
| RequestSignUp 
| ResponseSignUp 
| LoginError 
| LogOut
| RequestUser
| ResponseUser
| ErrorUser
| RequestPsychologists
| ResponsePsychologists
| ErrorPsychologists
| RequestEmPsychologists
| ResponseEmPsychologists
| ErrorEmPsychologists;

export const logInAction = (login: LoginBody, dispatch: Dispatch, appState: ApplicationState, navigation: any) => {    
    if (appState) {
        signIn(login)
            .then(response => response.json() as Promise<any>)
            .then(data => {
                if(!data.statusCode){ 
                    if(data.user.hasOwnProperty('psychologist') && !(data.user.psychologist.connectionId)){
                        requestPushTokenAction().then((val: any) => {
                            const user = {
                                psychologist: {
                                    connectionId: val
                                }
                            }
                            editProfileAction(user, true, dispatch, (user) => dispatch({ type: 'RESPONSE_LOGIN', logged: {token: data.token, user: user} }), data.user._id)
                        })
                    }           
                    dispatch({ type: 'RESPONSE_LOGIN', logged: data });
                    navigation.navigate('Shell', {screen: 'Home'});
                }else{
                    dispatch({ type: 'LOGIN_ERROR' });
                }
            })

        dispatch({ type: 'REQUEST_LOGIN', login: login });
    }
}
    
export const signUpAction = (user: SignUpBody, dispatch: Dispatch, appState: ApplicationState, navigation: any, physician: boolean) => {
    if (appState) {
        signUp(user, physician ? 'psychologists' : 'patients')
            .then(response => response.json() as Promise<any>)
            .then(data => {
                if(!data.statusCode){
                    dispatch({ type: 'RESPONSE_SIGNUP', createdUser: data });
                    navigation.navigate('Login');
                    openNotificationSnackbar("basic", dispatch, "saved");
                }else {
                    openNotificationSnackbar("basic", dispatch, "error");
                }
            });

        dispatch({ type: 'REQUEST_SIGNUP', user: user });
    }
}

export const logOutAction = (dispatch: Dispatch, navigation: any) => {
    dispatch({type: 'LOGOUT'});
    navigation.navigate('Landing', { screen: 'Landing' });    
}

export const getUserAction = (userId: string, dispatch: Dispatch) => {    
    getUser(userId)
        .then(response => response.json() as Promise<any>)
        .then(data => {            
            if(!data.statusCode){                    
                dispatch({ type: 'RESPONSE_USER', user: data });
            }else{
                dispatch({ type: 'ERROR_USER' });
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error actualizando el usuario logeado");
            }
        })

    dispatch({ type: 'REQUEST_USER', userId: userId });
}

export const getPsychologistsAction = (dispatch: Dispatch) => {
    getPsychologists()
        .then(response => response.json() as Promise<any>)
        .then(data => {            
            if(!data.statusCode){                    
                dispatch({ type: 'RESPONSE_PSYS', psychologists: data });
            }else{
                dispatch({ type: 'ERROR_PSYS' });
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error buscando los psicologos");
            }
        })

    dispatch({ type: 'REQUEST_PSYS'});
}

export const getEmergencyPsychologistsAction = (dispatch: Dispatch) => {
    getEmergencyPsychologists()
        .then(response => response.json() as Promise<any>)
        .then(data => { 
            if(!data.statusCode){                    
                dispatch({ type: 'RESPONSE_EM_PSYS', psychologists: data });
            }else{
                dispatch({ type: 'ERROR_EM_PSYS' });
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error buscando los psicologos");
            }
        })

    dispatch({ type: 'REQUEST_EM_PSYS'});
}