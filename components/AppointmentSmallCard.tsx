import React from "react";
import { Appointment } from "../models";
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface AppointmentSmallCardProps {
    appointment: Appointment;
    navigation: NativeStackNavigationProp<any> | DrawerNavigationProp<any>;
}

export const AppointmentSmallCard: React.FC<AppointmentSmallCardProps> = (props) => {
    const dateStart = new Date(props.appointment.start);
    const dateEnd = new Date(props.appointment.end);
    
    const openChat = () => {
        props.navigation.navigate('Shell', {screen: 'Chat', params: { roomId: props.appointment._id } },);
    }

    return (
        <Pressable style={styles.container} onPress={openChat}>
            <View style={styles.time}>
                <IconButton 
                    style={styles.icon} 
                    icon="clock" 
                    color="#fff"
                />
                <Text style={styles.timeText}>{`${String(dateEnd.getHours()).padStart(2,'0')}:${String(dateStart.getMinutes()).padStart(2,'0')} -`}</Text>
                <Text style={styles.timeText}>{`${String(dateEnd.getHours()).padStart(2,'0')}:${String(dateEnd.getMinutes()).padStart(2,'0')}`}</Text>
            </View>
            <View style={styles.description}>
                <View style={styles.descriptionView}>
                    <IconButton 
                        icon="progress-clock" 
                        color="#000"
                        size={15}
                    />
                    <Text style={styles.descriptionText}>- min</Text>
                </View>
                <View style={styles.descriptionView}>
                    <IconButton 
                        icon="account" 
                        size={15}
                        color="#000"
                    />
                    <Text style={styles.descriptionText}>{props.appointment.patient.firstName}</Text>
                </View>
            </View>
            <IconButton 
                icon="chevron-right"
                color="#DB6551FC"
                size={30}
                style={{paddingRight: 25}}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: 'white'
    },
    time: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        paddingVertical: 20,
        paddingLeft: 50,
        backgroundColor: '#DB6551FC',
        width: '35%',
        height: '100%'
    },
    timeText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    descriptionView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    descriptionText: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    icon: {
        position: 'absolute',
        left: 0,
        top: 2,
        color: '#db6551'
    }
})