import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { Appointment, User } from "../../models";
import { availablePhysicians, getUserAppointments, saveNewAppointment } from "../services/appointmentService";
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

export type KnownAction = RequestAvailablePhysicians | ResponseAvailablePhysicians | RequestNewAppointment | ResponseNewAppointment | RequestUserAppointments | ResponseUserAppointments;

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
            console.log(data);
            
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_NEW_APPOINTMENT', appointment: data });
                callback();
                openNotificationSnackbar("basic", dispatch, "saved");
            }else{
                openNotificationSnackbar("basic", dispatch, "error");
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