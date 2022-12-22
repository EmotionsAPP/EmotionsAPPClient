import * as Auth from './reducers/authReducer';
import * as Appointment from './reducers/appointmentReducer';
import * as InApp from './reducers/inAppReducer';
import * as Article from './reducers/articleReducer';
import * as Profile from './reducers/profileReducer';

export interface ApplicationState {
    auth: Auth.AuthState | undefined;
    appointment: Appointment.AppointmentState | undefined;
    article: Article.ArticleState | undefined;
    inApp: InApp.InAppState | undefined;
    profile: Profile.ProfileState | undefined;
}

export const reducers = {
    auth: Auth.reducer,
    appointment: Appointment.reducer,
    article: Article.reducer,
    inApp: InApp.reducer,
    profile: Profile.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}