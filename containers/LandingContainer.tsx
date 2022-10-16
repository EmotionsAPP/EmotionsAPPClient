import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { NotificationSnackbar } from "../components";
import { LandingNavigation } from "../navigation";
import { ApplicationState } from "../store";
import { dismissNotificationSnackbar } from "../store/actions/inAppActions";

export const LandingContainer = () => {
    const appState = useSelector((state: ApplicationState) => state);
    const dispatch = useDispatch();
    
    const dismissNotif = () => {
      dismissNotificationSnackbar(dispatch)
    }
    
    return (
        <PaperProvider>
            <LandingNavigation/>
            <NotificationSnackbar 
                visible={appState.inApp?.notificationSnackbarVisible ?? false}
                type={appState.inApp?.snackbarNotificationType ?? ''}
                basicType={appState.inApp?.snackbarNotificationType2}
                dismiss={dismissNotif}
            />
        </PaperProvider>
      );
}