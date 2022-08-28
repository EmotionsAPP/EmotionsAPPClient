import * as Auth from './reducers/authReducer';
import * as Appointment from './reducers/appointmentReducer';

export interface ApplicationState {
    auth: Auth.AuthState | undefined;
    appointment: Appointment.AppointmentState | undefined;
}

export const reducers = {
    auth: Auth.reducer,
    appointment: Appointment.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}