import React from "react";
import { Appointment } from "../../models";
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { styles } from './style';

interface AppointmentSmallCardProps {
    appointment: Appointment;
    navigation: NativeStackNavigationProp<any> | DrawerNavigationProp<any>;
}

export const AppointmentSmallCard: React.FC<AppointmentSmallCardProps> = (props) => {
    const dateStart = new Date(props.appointment.start);
    const dateEnd = new Date(props.appointment.end);
    const diff = dateEnd.getTime() - dateStart.getTime();
    
    const openMeeting = () => {
        props.navigation.navigate('Shell', {screen: 'Appointment', params: { appointment: props.appointment } });
    }    

    const appState = useSelector((state: ApplicationState) => state);
    
    return (
        <Pressable style={styles.container} onPress={openMeeting}>
            <View style={styles.time}>
                <IconButton 
                    style={styles.icon} 
                    icon="clock" 
                    color="#fff"
                />
                <Text style={styles.timeText}>{`${String(((dateStart.getHours() % 12) || 12)).padStart(2,'0')}:${String(dateStart.getMinutes()).padStart(2,'0')} ${dateStart.getHours() > 12 ? 'PM' : 'AM'} -`}</Text>
                <Text style={styles.timeText}>{`${String(((dateEnd.getHours() % 12) || 12)).padStart(2,'0')}:${String(dateEnd.getMinutes()).padStart(2,'0')} ${dateEnd.getHours() >= 12 ? 'PM' : 'AM'}`}</Text>
            </View>
            <View style={styles.description}>
                <View style={styles.descriptionView}>
                    <IconButton 
                        icon="account-multiple" 
                        size={15}
                        color="#000"
                    />
                    <Text style={styles.descriptionText}>
                        {
                            appState.auth?.user?.hasOwnProperty('patient') ?
                            `${props.appointment.psychologist.firstName} ${props.appointment.psychologist.lastName}`
                            : `${props.appointment.patient.firstName} ${props.appointment.patient.lastName}`
                        }
                    </Text>
                </View>
                <View style={styles.descriptionView}>
                    <IconButton 
                        icon="progress-clock" 
                        color="#000"
                        size={15}
                    />
                    <Text style={styles.descriptionText}>{Math.round(diff / 60000)} min</Text>
                </View>
            </View>
            <IconButton 
                icon="chevron-right"
                color="#DB6551FC"
                size={25}
                style={{
                    position: 'absolute',
                    right: 0
                }}
            />
        </Pressable>
    )
}

