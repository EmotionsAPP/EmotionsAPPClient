import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { LoginBody, SignUpBody } from "../../models";
import { signIn, signUp } from "../services/authService";

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

export type KnownAction = RequestLogin | ResponseLogin | RequestSignUp | ResponseSignUp

export const logInAction = (login: LoginBody, dispatch: Dispatch, appState: ApplicationState, navigation: any) => {    
    if (appState) {
        signIn(login)
            .then(response => response.json() as Promise<boolean>)
            .then(data => {
                dispatch({ type: 'RESPONSE_LOGIN', logged: data });
                navigation.navigate('Shell', {screen: 'Home'});
            });

        dispatch({ type: 'REQUEST_LOGIN', login: login });
    }
}
    
export const signUpAction = (user: SignUpBody, dispatch: Dispatch, appState: ApplicationState, navigation: any) => {
    if (appState) {
        signUp(user)
            .then(response => response.json() as Promise<SignUpBody>)
            .then(data => {
                dispatch({ type: 'RESPONSE_SIGNUP', createdUser: data });
                navigation.navigate('Landing');
            });

        dispatch({ type: 'REQUEST_SIGNUP', user: user });
    }
}
