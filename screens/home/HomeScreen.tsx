import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { userAppointmentsAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';

interface HomeProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Home'>;
}

export const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);
    const dispatch = useDispatch();

    const today = new Date();
    
    useEffect(() => {
        userAppointmentsAction(appState.auth?.user?._id ?? '', today.toString(), dispatch);
    }, [])

    return (
        <View style={styles.screen}>
            {
                appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? 
                    <View style={styles.scroll}>
                        <ScrollView>
                            <Text style={styles.title}>Reuniones</Text>
                            <View>
                                {
                                    appState.appointment?.userAppointments.map((appointment) => {
                                        return <AppointmentSmallCard appointment={appointment} navigation={navigation} key={appointment._id} />
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                : 
                    <></>
            }
            <View style={ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? styles.actions : [ styles.action, { height: '100%' } ] }>
                <ImageBackground 
                    source={
                        require('../../assets/images/Topographic.png')
                    }
                    resizeMode='cover'
                    style={ styles.actionBgImage }
                >
                    <View style={ styles.action }>
                        <Text style={ styles.actionText }>{ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? '¿Necesitas una reunión?' : '¡Nada que mostrar por ahora! \n Agenda tu primera cita para ver información aquí. :)'}</Text>
                        <Pressable
                            style={ styles.newMeetingAction }
                        >
                            <Text style={ styles.newMeetingActionText }>Agenda una cita</Text>
                        </Pressable>
                    </View>
                    <View style={ [styles.action, {paddingTop: 20} ] }>
                        <Text style={ styles.actionText }>¿Tienes una emergencia? {'\n'} Contactate con uno de nuestros expertos disponibles.</Text>
                        <Pressable
                            style={ styles.emergencyAction }
                        >
                            <Text style={ styles.emergencyActionText }>Ten una cita ahora</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        </View>
    )
}

