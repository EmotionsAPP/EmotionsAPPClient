import { Action, Reducer } from "redux";
import { KnownAction } from "../actions/AuthActions";

export interface AuthState {
    loggedIn: boolean;
    signingUp: boolean;
    loggingIn: boolean;
    signedUp: boolean;
    user?: string;
}

const unloadedState: AuthState = { loggedIn: false, signingUp: false, loggingIn: false, signedUp: false };

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
                user: action.logged
            };
        case 'REQUEST_SIGNUP': 
            return {
                ...state,
                signingUp: true,
            };
        case 'RESPONSE_SIGNUP':
            return {
                ...state,
                signedUp: true
            };
    }

    return state;
}