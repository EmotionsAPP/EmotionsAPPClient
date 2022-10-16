import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { LoginBody, SignUpBody } from "../../models";
import { signIn, signUp } from "../services/authService";
import { openNotificationSnackbar } from "./inAppActions";

interface RequestLogin {
    type: 'REQUEST_LOGIN';
    login: LoginBody;
}

interface ResponseLogin {
    type: 'RESPONSE_LOGIN';
    logged: string;
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

export type KnownAction = RequestLogin | ResponseLogin | RequestSignUp | ResponseSignUp | LoginError;

export const logInAction = (login: LoginBody, dispatch: Dispatch, appState: ApplicationState, navigation: any) => {    
    if (appState) {
        signIn(login)
            .then(response => response.json() as Promise<any>)
            .then(data => {
                if(data.statusCode != 400){
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
                if(data.statusCode != 400){
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
