import { Action, Reducer } from "redux";
import { KnownAction } from "../actions/inAppActions";

export interface InAppState {
    notificationSnackbarVisible: boolean;
    snackbarNotificationType: any;
    snackbarNotificationType2?: any;
}

const unloadedState: InAppState = { 
    notificationSnackbarVisible: false,
    snackbarNotificationType: 'basic',
};

export const reducer: Reducer<InAppState> = (state: InAppState | undefined, incomingAction: Action): InAppState => {
    if(state === undefined) { 
        return unloadedState;
    }

    const action = incomingAction as KnownAction;  
    switch(action.type) { 
        case 'OPEN_NOTIFICATION_SNACKBAR':
            return {
                ...state,
                notificationSnackbarVisible: true,
                snackbarNotificationType: action.notificationType,
                snackbarNotificationType2: action.notificationType2
            };
        case 'DISMISS_NOTIFICATION_SNACKBAR':
            return unloadedState;
    }

    return state;
}