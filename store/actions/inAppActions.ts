import { Dispatch } from "redux";
import { ApplicationState } from "..";
import * as Notifications from 'expo-notifications';

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

const registerForPushNotificationsAsync = async (): Promise<any> => {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token;
}

export const openNotificationSnackbar = (notificationType: "basic" | "emergency", dispatch: Dispatch, notificationType2?: string, customText?: string) => {
    dispatch({ type: 'OPEN_NOTIFICATION_SNACKBAR', notificationType: notificationType, notificationType2: notificationType2, customText: customText});
}

export const dismissNotificationSnackbar = (dispatch: Dispatch) => {
    dispatch({ type: 'DISMISS_NOTIFICATION_SNACKBAR' });
}

export const requestPushTokenAction = async () => {
    console.log('a');
    
    return await registerForPushNotificationsAsync();
}