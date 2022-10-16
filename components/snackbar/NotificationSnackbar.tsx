import React from "react";
import { Text, View } from 'react-native';
import { IconButton, Snackbar } from "react-native-paper";
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NotificationSnackbarProps {
    visible: boolean;
    type: "basic" | "emergency";
    basicType?: "offline" | "saved" | "error";
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
                    text: 'You’re offline. Your work will not be saved.'
                }
            case 'saved': 
                return {
                    style: styles.basicSaved,
                    icon: 'check-circle-outline',
                    text: 'You’re changes were saved!'
                }
            case 'error': 
                return {
                    style: styles.basicError,
                    icon: 'close-circle-outline',
                    text: 'Error'
                }
        }

        return {
            style: '',
            icon: '',
            text: ''
        }
    }

    if(props.type == 'basic')
        return (
            <Snackbar
                visible={props.visible}
                onDismiss={props.dismiss}
                style={basicTypesSwitch(props.basicType ?? '')?.style}
                wrapperStyle={ { alignItems: 'center' } }
                action={{
                    label: 'x',
                    color: 'white',
                    onPress: props.dismiss
                }}
            >
                <View style={styles.basic}>
                    <MaterialCommunityIcons
                        name={basicTypesSwitch(props.basicType ?? '')?.icon ?? 'key'}
                        color="white"
                        size={25}
                    />
                    <Text style={styles.basicText}>{basicTypesSwitch(props.basicType ?? '')?.text}</Text>
                </View>
            </Snackbar>
        )
    else
        return <></>
}