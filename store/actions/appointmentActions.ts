import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { Appointment, User } from "../../models";
import { availablePhysicians, getAppointmentHistory, getUserAppointments, lastContactedUsers, saveNewAppointment } from "../services/appointmentService";
import { openNotificationSnackbar } from "./inAppActions";

interface RequestAvailablePhysicians {
    type: 'REQUEST_AVAILABLE_PHYSICIANS';
    time: Date;
}

interface ResponseAvailablePhysicians {
    type: 'RESPONSE_AVAILABLE_PHYSICIANS';
    physicians: User[];
    date: Date;
}

interface RequestNewAppointment {
    type: 'REQUEST_NEW_APPOINTMENT';
    appointment: Appointment;
}

interface ResponseNewAppointment {
    type: 'RESPONSE_NEW_APPOINTMENT';
    appointment: Appointment;
}

interface RequestUserAppointments {
    type: 'REQUEST_USER_APPOINTMENTS';
    user_id: string;
}

interface ResponseUserAppointments {
    type: 'RESPONSE_USER_APPOINTMENTS';
    appointments: Appointment[];
}

interface RequestLastContactedUsers {
    type: 'REQUEST_LAST_CONTACTED_USERS'
}

interface ResponseLastContactedUsers {
    type: 'RESPONSE_LAST_CONTACTED_USERS',
    lastContactedUsers: User[];
}

interface RequestAppointmentHistory {
    type: 'REQUEST_HISTORY_APPOINTMENTS'
    id: string;
}

interface ResponseAppointmentHistory {
    type: 'RESPONSE_HISTORY_APPOINTMENTS'
    history: any;
}

interface ErrorAppointmentHistory {
    type: 'ERROR_HISTORY_APPOINTMENTS'
}

export type KnownAction = RequestAvailablePhysicians 
| ResponseAvailablePhysicians 
| RequestNewAppointment 
| ResponseNewAppointment 
| RequestUserAppointments 
| ResponseUserAppointments 
| RequestLastContactedUsers 
| ResponseLastContactedUsers
| RequestAppointmentHistory
| ResponseAppointmentHistory
| ErrorAppointmentHistory;

export const availablePhysiciansAction = (time: Date, dispatch: Dispatch,  appState: ApplicationState) => {
    if(appState.appointment?.lastFetchedDatePhysicians !== time){
        availablePhysicians(time)
            .then(response => response.json() as Promise<boolean>)
            .then(data => {
                dispatch({ type: 'RESPONSE_AVAILABLE_PHYSICIANS', physicians: data, date: time });
            })

        dispatch({ type: 'REQUEST_AVAILABLE_PHYSICIANS', time: time });
    }
}

export const newAppointmentAction = (appointment: Appointment, dispatch: Dispatch, callback: () => void) => {
    saveNewAppointment(appointment)
        .then(response => response.json() as Promise<any>)
        .then(data => {            
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_NEW_APPOINTMENT', appointment: data });
                callback();
                openNotificationSnackbar("basic", dispatch, "saved", "Su reunion fue creada con exito");
            }else{               
                openNotificationSnackbar("basic", dispatch, "error", "Existe un conflicto en las fechas de esta reunion");
            }
        })

    dispatch({ type: 'REQUEST_NEW_APPOINTMENT', appointment: appointment });
}

export const userAppointmentsAction = (user_id: string, date: string, dispatch: Dispatch) => {
    getUserAppointments(user_id, date)
        .then(response => response.json() as Promise<boolean>)
        .then(data => {                        
            dispatch({ type: 'RESPONSE_USER_APPOINTMENTS', appointments: data });
        })

    dispatch({ type: 'REQUEST_USER_APPOINTMENTS', user_id: user_id });
}

export const lastContactedUsersAction = (user_id: string, dispatch: Dispatch) => {
    lastContactedUsers(user_id)
        .then(response => response.json() as Promise<any>)
        .then(data => {            
            dispatch({ type: 'RESPONSE_LAST_CONTACTED_USERS', lastContactedUsers: data });
        })

    dispatch({ type: 'REQUEST_LAST_CONTACTED_USERS' });
}

export const getAppointmentHistoryAction = (id: string, dispatch: Dispatch) => {
    getAppointmentHistory(id)
        .then(response => response.json() as Promise<any>)
        .then(data => {        
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_HISTORY_APPOINTMENTS', history: data });
            }else{ 
                dispatch({ type: 'ERROR_HISTORY_APPOINTMENTS' })              
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error buscando sus citas");
            }
        })

    dispatch({ type: 'REQUEST_HISTORY_APPOINTMENTS', id: id });
}