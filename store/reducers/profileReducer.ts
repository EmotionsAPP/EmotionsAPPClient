import { Action, Reducer } from "redux";
import { City, Note } from "../../models";
import { KnownAction } from "../actions/profileActions";

export interface ProfileState {
    note: Note;
    loadingNote: boolean;
    savingNote: boolean;
    requestingCities: boolean;
    cities: City[];
    savingUser: boolean;
}

const unloadedState: ProfileState = { 
    note: {
        note: '',
        psychologist: '',
        patient: ''
    },
    loadingNote: false,
    savingNote: false,
    requestingCities: false,
    cities: [],
    savingUser: false,
};

export const reducer: Reducer<ProfileState> = (state: ProfileState | undefined, incomingAction: Action): ProfileState => {
    if(state === undefined) { 
        return unloadedState;
    }

    const action = incomingAction as KnownAction;  
    switch(action.type) { 
        case 'REQUEST_NOTE':
            return {
                ...state,
                loadingNote: true
            };
        case 'RESPONSE_NOTE':
            return {
                ...state,
                note: action.note,
                loadingNote: false,
            };
        case 'ERROR_NOTE':
            return {
                ...state,
                loadingNote: false
            };
        case 'REQUEST_SAVE_NOTE': 
            return {
                ...state,
                savingNote: true
            }
        case 'RESPONSE_SAVE_NOTE': 
            return {
                ...state,
                savingNote: false
            }
        case 'ERROR_SAVE_NOTE': 
            return {
                ...state,
                savingNote: false
            }
        case 'REQUEST_CITIES': 
            return {
                ...state,
                requestingCities: true
            }
        case 'RESPONSE_CITIES': 
            return {
                ...state,
                cities: action.cities,
                requestingCities: false
            }
        case 'ERROR_CITIES': 
            return {
                ...state,
                requestingCities: false
            }
        case 'REQUEST_SAVE_USER': 
            return {
                ...state,
                savingUser: true
            }
        case 'RESPONSE_SAVE_USER': 
            return {
                ...state,
                savingUser: false
            }
        case 'ERROR_SAVE_USER': 
            return {
                ...state,
                savingUser: false
            }
    }

    return state;
}