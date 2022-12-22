import { Dispatch } from "redux";
import { City, Note, User } from "../../models";
import { editNote, editUser, getCities, getNote, saveNewNote } from "../services/profileService";
import { getUserAction } from "./authActions";
import { openNotificationSnackbar } from "./inAppActions";

interface RequestNote {
    type: 'REQUEST_NOTE';
    psychologistId: string;
    patientId: string;
}

interface ResponseNote {
    type: 'RESPONSE_NOTE';
    note: Note;
}

interface ErrorNote {
    type: 'ERROR_NOTE';
}

interface RequestSaveNote {
    type: 'REQUEST_SAVE_NOTE';
    note: Note;
}

interface ResponseSaveNote {
    type: 'RESPONSE_SAVE_NOTE';
    note: Note;
}

interface ErrorSaveNote {
    type: 'ERROR_SAVE_NOTE';
}

interface RequestCities {
    type: 'REQUEST_CITIES';
}

interface ResponseCities {
    type: 'RESPONSE_CITIES';
    cities: City[];
}

interface ErrorCities {
    type: 'ERROR_CITIES';
}

interface RequestSaveUser {
    type: 'REQUEST_SAVE_USER';
    user: User;
}

interface ResponseSaveUser {
    type: 'RESPONSE_SAVE_USER';
    user: User;
}

interface ErrorSaveUser {
    type: 'ERROR_SAVE_USER';
}

export type KnownAction = RequestNote
| ResponseNote
| ErrorNote
| RequestSaveNote
| ResponseSaveNote
| ErrorSaveNote
| RequestCities
| ResponseCities
| ErrorCities
| RequestSaveUser
| ResponseSaveUser
| ErrorSaveUser;

export const getPatientNoteAction = (dispatch: Dispatch, patientId: string, psychologistId: string) => {
    getNote(psychologistId, patientId)
        .then(response => response.json() as Promise<any>)
        .then(data => {
            if(!data.statusCode)
                dispatch({ type: 'RESPONSE_NOTE', note: data });
            else {
                if(data.error == 'Not Found') newPatientNoteAction(emptyNote, dispatch, saved)
                else {
                    dispatch({ type: 'ERROR_NOTE'});
                    openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error buscando las notas del paciente");
                }
            }
        })

    dispatch({ type: 'REQUEST_NOTE', psychologistId: psychologistId, patientId: patientId });

    const emptyNote = {
        note: '',
        patient: patientId,
        psychologist: psychologistId,
    }
    const saved = (note?: Note) => {
        dispatch({ type: 'RESPONSE_NOTE', note: note });
    }
}

export const newPatientNoteAction = (note: Note, dispatch: Dispatch, callback: (note?: Note) => void) => {
    saveNewNote(note)
        .then(response => response.json() as Promise<any>)
        .then(data => {   
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_SAVE_NOTE', note: data });
                callback(data);
            }else{               
                dispatch({ type: 'ERROR_SAVE_NOTE'});
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando la nota del paciente");
            }
        })

    dispatch({ type: 'REQUEST_SAVE_NOTE', note: note });
}

export const editPatientNoteAction = (note: Note, dispatch: Dispatch, callback: () => void, noteId?: string) => {
    editNote(note, noteId)
        .then(response => response.json() as Promise<any>)
        .then(data => {                 
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_SAVE_NOTE', note: data });
                callback();
                openNotificationSnackbar("basic", dispatch, "saved", "La nota del paciente se ha guardado con exito");
            }else{             
                dispatch({ type: 'ERROR_SAVE_NOTE'});  
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando la nota del paciente");
            }
        })
    
    dispatch({ type: 'REQUEST_SAVE_NOTE', note: note });
}

export const getCitiesAction = (dispatch: Dispatch) => {
    getCities()
        .then(response => response.json() as Promise<any>)
        .then(data => {
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_CITIES', cities: data });
            }else{             
                dispatch({ type: 'ERROR_CITIES'});  
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error buscando las ciudades");
            }
        })
    
    dispatch({ type: 'REQUEST_CITIES' });
}

export const editProfileAction = (user: any, psychologist: boolean, dispatch: Dispatch, callback: (user: User) => void, userId?: string) => {
    editUser(user, psychologist, userId)
        .then(response => response.json() as Promise<any>)
        .then(data => {                      
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_SAVE_USER', user: data });
                callback(data);
                getUserAction(userId ?? '', dispatch);
                openNotificationSnackbar("basic", dispatch, "saved", "Su perfil de ha guardado con exito");
            }else{             
                dispatch({ type: 'ERROR_SAVE_USER'});  
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando su perfil");
            }
        })
    
    dispatch({ type: 'REQUEST_SAVE_USER', user: user });
}


