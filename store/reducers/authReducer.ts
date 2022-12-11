import { Action, Reducer } from "redux";
import { User } from "../../models";
import { KnownAction } from "../actions/AuthActions";

export interface AuthState {
    loggedIn: boolean;
    signingUp: boolean;
    loggingIn: boolean;
    signedUp: boolean;
    user?: any;
    loginError: boolean;
    updatingUser: boolean;
    searchingPsychologists: boolean;
    psychologists: User[];
    searchingEmPsychologists: boolean;
    emergencyPsychologists: User[];
}

const unloadedState: AuthState = { 
    loggedIn: false, 
    signingUp: false, 
    loggingIn: false, 
    signedUp: false, 
    loginError: false,
    updatingUser: false,
    searchingPsychologists: false,
    psychologists: [],
    searchingEmPsychologists: false, 
    emergencyPsychologists: [],
};

export const reducer: Reducer<AuthState> = (state: AuthState | undefined, incomingAction: Action): AuthState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch(action.type) {
        case 'REQUEST_LOGIN':
            return {
                ...state,
                loggingIn: true
            };
        case 'RESPONSE_LOGIN':
            return {
                ...state,
                loggedIn: action.logged ? true : false,
                user: action.logged.user,
                loginError: false,
                loggingIn: false,
            };
        case 'LOGIN_ERROR': 
            return {
                ...state,
                loginError: true,
                loggingIn: false,
            }
        case 'REQUEST_SIGNUP': 
            return {
                ...state,
                signingUp: true,
            };
        case 'RESPONSE_SIGNUP':
            return {
                ...state,
                signingUp: false,
                signedUp: true
            };
        case 'LOGOUT': 
            return {
                ...state,
                loggedIn: false, 
                user: undefined,
            }
        case 'REQUEST_USER': 
            return {
                ...state, 
                updatingUser: true
            }
        case 'RESPONSE_USER':
            return {
                ...state,
                user: action.user,
                updatingUser: false
            }
        case 'ERROR_USER': 
            return {
                ...state,
                updatingUser: false
            }
        case 'REQUEST_PSYS': 
            return {
                ...state, 
                searchingPsychologists: true
            }
        case 'RESPONSE_PSYS':
            return {
                ...state,
                psychologists: action.psychologists,
                searchingPsychologists: false
            }
        case 'ERROR_PSYS': 
            return {
                ...state,
                searchingPsychologists: false
            }
        case 'REQUEST_EM_PSYS': 
            return {
                ...state, 
                searchingEmPsychologists: true
            }
        case 'RESPONSE_EM_PSYS':
            return {
                ...state,
                emergencyPsychologists: action.psychologists,
                searchingEmPsychologists: false
            }
        case 'ERROR_EM_PSYS': 
            return {
                ...state,
                searchingEmPsychologists: false
            }
    }

    return state;
}