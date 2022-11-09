import React from "react";
import { Text, View } from 'react-native';
import { IconButton, Snackbar } from "react-native-paper";
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NotificationSnackbarProps {
    visible: boolean;
    type: "basic" | "emergency";
    basicType?: "offline" | "saved" | "error";
    customText?: string;
    dismiss: any;
}

export const NotificationSnackbar = (props: NotificationSnackbarProps) => {

    const basicTypesSwitch = (type: string): {
        style: any,
        icon: any,
        text: any
    } => {
        switch(type){
            case 'offline': 
                return {
                    style: styles.basicOffline,
                    icon: 'alert-circle-outline',
                    text: props.customText ?? 'You’re offline. Your work will not be saved.'
                }
            case 'saved': 
                return {
                    style: styles.basicSaved,
                    icon: 'check-circle-outline',
                    text: props.customText ?? 'Se han guardado tus cambios!'
                }
            case 'error': 
                return {
                    style: styles.basicError,
                    icon: 'close-circle-outline',
                    text: props.customText ?? 'Error'
                }
        }

        return {
            style: '',
            icon: '',
            text: ''
        }
    }

    switch(props.type){
        case 'basic': 
            return (
                <Snackbar
                    visible={props.visible}
                    onDismiss={props.dismiss}
                    style={basicTypesSwitch(props.basicType ?? '')?.style}
                    wrapperStyle={ { alignItems: 'center' } }
                    action={{
                        label: 'x',
                        color: 'white',
                        style: styles.closeButton,
                        onPress: props.dismiss
                    }}
                >
                    <View style={styles.basic}>
                        <MaterialCommunityIcons
                            name={basicTypesSwitch(props.basicType ?? '')?.icon ?? 'key'}
                            color="white"
                            size={25}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.basicText}>{basicTypesSwitch(props.basicType ?? '')?.text}</Text>
                        </View>
                    </View>
                </Snackbar>                
            )
        default:
            return <></>
    }
}