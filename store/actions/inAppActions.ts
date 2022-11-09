import { Dispatch } from "redux";
import { ApplicationState } from "..";

interface OpenNotificationSnackbar {
    type: 'OPEN_NOTIFICATION_SNACKBAR';
    notificationType: any;
    notificationType2?: string;
    customText?: string;
}

interface DismissNotificationSnackbar {
    type: 'DISMISS_NOTIFICATION_SNACKBAR';
}

export type KnownAction = OpenNotificationSnackbar | DismissNotificationSnackbar

export const openNotificationSnackbar = (notificationType: "basic" | "emergency", dispatch: Dispatch, notificationType2?: string, customText?: string) => {
    dispatch({ type: 'OPEN_NOTIFICATION_SNACKBAR', notificationType: notificationType, notificationType2: notificationType2, customText: customText});
}

export const dismissNotificationSnackbar = (dispatch: Dispatch) => {
    dispatch({ type: 'DISMISS_NOTIFICATION_SNACKBAR' });
}