import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { lastContactedUsersAction, userAppointmentsAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { useIsFocused } from '@react-navigation/native';
import { UserSmallCard } from "../../components/userSmallCard/UserSmallCard";

interface HomeProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Home'>;
}

export const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const today = new Date();

    useEffect(() => {
        navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
            if(e.data.action.type == 'NAVIGATE') navigation.dispatch(e.data.action)
        });
    }, [navigation])

    useEffect(() => {
        isFocused && userAppointmentsAction(appState.auth?.user?._id ?? '', today.toISOString(), dispatch);
        if(!appState.auth?.user?.hasOwnProperty('patient'))
            lastContactedUsersAction(appState.auth?.user?._id, dispatch)
        
    }, [isFocused])

    return (
        <View style={styles.screen}>
            {
                appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? 
                    <View style={styles.scroll}>
                        <Text style={styles.title}>Reuniones</Text>
                        <ScrollView>
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
            {
                appState.auth?.user?.hasOwnProperty('patient') ?
                    <View style={ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? [ styles.actions, { height: '50%' } ] : [ styles.action, { height: '100%' } ] }>
                        <ImageBackground 
                            source={
                                require('../../assets/images/Topographic.png')
                            }
                            resizeMode='cover'
                            style={ [styles.actionBgImage, { justifyContent: 'center' } ] }
                        >
                            <View style={ styles.action }>
                                <Text style={ styles.actionText }>{ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? '¿Necesitas otra reunión?' : '¡Nada que mostrar por ahora! \n Agenda tu primera cita para ver información aquí. :)'}</Text>
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
                :   
                    appState.appointment?.lastContactedUsers && appState.appointment?.lastContactedUsers.length > 0 ? 
                        <View style={ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? { height: '50%' } : { height: '100%' } }>
                            <ImageBackground 
                                source={
                                    require('../../assets/images/Topographic.png')
                                }
                                resizeMode='cover'
                                style={ styles.actionBgImage }
                            >
                                <Text style={styles.title}>Pacientes</Text>
                                <ScrollView>
                                    {
                                        appState.appointment.lastContactedUsers.map((user) => {
                                            return <UserSmallCard user={user} navigation={navigation} key={user._id} />
                                        })
                                    }
                                </ScrollView>
                            </ImageBackground>
                        </View>
                    :
                        <View>
                            <ImageBackground 
                                source={
                                    require('../../assets/images/Topographic.png')
                                }
                                resizeMode='cover'
                                style={ styles.actionBgImage }
                            >
                                <View style={styles.nothingToShowView}>
                                    <Image
                                        style={ styles.centerImg }
                                        source={
                                            require('../../assets/images/NothingToShowImage.png')
                                        }
                                    />
                                    <Text style={styles.actionText}>{`¡Nada que mostrar por ahora! \nSi no lo has hecho, completa tu perfil para que los pacientes sepan mas sobre ti y agenden citas.`}</Text>
                                </View>
                            </ImageBackground>
                        </View>
            }
        </View>
    )
}

