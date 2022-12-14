import { Action, Reducer } from "redux";
import { Appointment, User } from "../../models";
import { KnownAction } from "../actions/appointmentActions";

export interface AppointmentState {
    availablePhysicians: User[];
    loadingPhysicians: boolean;
    lastFetchedDatePhysicians: Date | undefined;
    savingNewAppointment: boolean;
    userAppointments: Appointment[];
    fetchingUserAppointments: boolean;
}

const unloadedState: AppointmentState = { 
    availablePhysicians: [], 
    loadingPhysicians: false, 
    lastFetchedDatePhysicians: undefined, 
    savingNewAppointment: false,
    userAppointments: [],
    fetchingUserAppointments: false, 
};

export const reducer: Reducer<AppointmentState> = (state: AppointmentState | undefined, incomingAction: Action): AppointmentState => {
    if(state === undefined) { 
        return unloadedState;
    }

    const action = incomingAction as KnownAction;  
    switch(action.type) { 
        case 'REQUEST_AVAILABLE_PHYSICIANS':
            return {
                ...state,
                loadingPhysicians: true
            };
        case 'RESPONSE_AVAILABLE_PHYSICIANS':
            return {
                ...state,
                availablePhysicians: action.physicians,
                loadingPhysicians: false,
                lastFetchedDatePhysicians: action.date
            };
        case 'REQUEST_NEW_APPOINTMENT': 
            return {
                ...state,
                savingNewAppointment: true
            }
        case 'RESPONSE_NEW_APPOINTMENT': 
            return {
                ...state,
                savingNewAppointment: false
            }
        case 'REQUEST_USER_APPOINTMENTS': 
            return {
                ...state,
                fetchingUserAppointments: true
            }
        case 'RESPONSE_USER_APPOINTMENTS': 
            return {
                ...state,
                fetchingUserAppointments: false, 
                userAppointments: action.appointments
            }
    }

    return state;
}