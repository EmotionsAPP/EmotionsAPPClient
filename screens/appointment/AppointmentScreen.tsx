import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { lastContactedUsersAction, userAppointmentsAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/appointmentSmallCard/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { Avatar } from "react-native-paper";
import { traduct } from "../../langs";

interface AppointmentProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Appointment'>;
    route: any;
}

export const AppointmentScreen: React.FC<AppointmentProps> = (props: any) => {
    const dateStart = new Date(props.route.params.appointment.start);
    const dateEnd = new Date(props.route.params.appointment.end);
    const diff = dateEnd.getTime() - dateStart.getTime();

    const now = new Date();
    const diffNowStart = dateStart.getTime() - now.getTime();
    const diffNowEnd = dateEnd.getTime() - now.getTime();

    const openChat = () => {
        props.navigation.push('Shell', {screen: 'Chat', params: { roomId: props.route.params.appointment._id, appointment: props.route.params.appointment } });
    }

    return (
        <View style={{backgroundColor: 'white'}}>
            <ImageBackground 
                source={
                    require('../../assets/images/Topographic.png')
                }
                resizeMode='cover'
                style={ styles.actionBgImage }
                imageStyle={{opacity: 0.8}}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>{traduct("meetingDetails")}</Text>
                </View>
                <ScrollView style={styles.scroll}>
                    <View style={styles.infoView}>
                        <Text style={styles.infoTitle}>{traduct("date")}</Text>
                        <Text style={styles.infoText}>{dateStart.toDateString()}</Text>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.infoTitle}>{traduct("sessionTime")}</Text>
                        <Text style={styles.infoText}>{`${String(((dateStart.getHours() % 12) || 12)).padStart(2,'0')}:${String(dateStart.getMinutes()).padStart(2,'0')} ${dateStart.getHours() > 12 ? 'PM' : 'AM'} - ${String(((dateEnd.getHours() % 12) || 12)).padStart(2,'0')}:${String(dateEnd.getMinutes()).padStart(2,'0')} ${dateEnd.getHours() >= 12 ? 'PM' : 'AM'}`}</Text>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.infoTitle}>{traduct("duration")}</Text>
                        <Text style={styles.infoText}>{Math.round(diff / 60000)} {traduct("minutes")}</Text>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.infoTitle}>{traduct("participants")}</Text>
                        <View style={ [styles.participantView, {paddingBottom: 10}] }>
                            <Avatar.Text size={24} label={`${props.route.params.appointment.psychologist.firstName[0]}${props.route.params.appointment.psychologist.lastName[0]}`} color="white" style={{backgroundColor: '#E5A186', marginRight: 10}}/>
                            <Text style={styles.infoText}>{`${props.route.params.appointment.psychologist.firstName} ${props.route.params.appointment.psychologist.lastName}`}</Text>
                        </View>
                        <View style={styles.participantView}>
                            <Avatar.Text size={24} label={`${props.route.params.appointment.patient.firstName[0]}${props.route.params.appointment.patient.lastName[0]}`} color="white" style={{backgroundColor: '#DB6551', marginRight: 10}}/>
                            <Text style={styles.infoText}>{`${props.route.params.appointment.patient.firstName} ${props.route.params.appointment.patient.lastName}`}</Text>
                        </View>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.infoTitle}>{traduct("appointmentDescription")}</Text>
                        <Text style={styles.infoText}>{props.route.params.appointment.description}</Text>
                    </View>
                </ScrollView>
                {
                    (((now.getTime() > dateStart.getTime()) || (Math.abs(Math.round(diffNowStart / 60000)) < 16))
                    && ((now.getTime() < dateEnd.getTime()) || (Math.abs(Math.round(diffNowEnd / 60000)) < 16))) ?
                        <View style={styles.joinView}>
                            <Pressable
                                style={ styles.emergencyAction }
                                onPress={ openChat }
                            >
                                <Text style={ styles.emergencyActionText }>{traduct("joinMeeting")}</Text>
                            </Pressable>
                        </View>
                    :
                        <></>
                }
            </ImageBackground>
        </View>
    )
}