import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { lastContactedUsersAction, userAppointmentsAction, userAppointmentsListAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/appointmentSmallCard/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { useIsFocused } from '@react-navigation/native';
import { UserSmallCard } from "../../components/userSmallCard/UserSmallCard";
import { traduct } from "../../langs";

interface HomeProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Home'>;
}

export const HomeScreen: React.FC<any> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const today = new Date();

    const navigateToPsy = () =>{
        navigation.push('Shell', {screen: 'PsychologistList'})
    }
    
    const navigateToSched = () => {
        navigation.push('Shell', {screen: 'Calendar'})
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
            if(e.data.action.type == 'NAVIGATE') navigation.dispatch(e.data.action)
        });
    }, [navigation])

    useEffect(() => {
        isFocused && userAppointmentsAction(appState.auth?.user?._id ?? '', today.toISOString(), dispatch),     userAppointmentsListAction(appState.auth?.user?._id ?? "", dispatch);
        ; 
        if(!appState.auth?.user?.hasOwnProperty('patient'))
            lastContactedUsersAction(appState.auth?.user?._id, dispatch)
        
    }, [isFocused])

    return (
        <View style={styles.screen}>
            {
                appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? 
                    <View style={styles.scroll}>
                        <Text style={styles.title}>{traduct("reunions")}</Text>
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
                                <Text style={ styles.actionText }>{ appState.appointment?.userAppointments && appState.appointment?.userAppointments.length > 0 ? traduct("needReunion") : traduct("firstAppointment")}</Text>
                                <Pressable
                                    style={ styles.newMeetingAction }
                                    onPress={() => navigateToSched()}
                                >
                                    <Text style={ styles.newMeetingActionText }>{traduct("scheduleAppointment")}</Text>
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
                                <Text style={styles.title}>{traduct("pacient")}s</Text>
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
                                    <Text style={styles.actionText}>{traduct("nothingToSee")}</Text>
                                </View>
                            </ImageBackground>
                        </View>
            }
        </View>
    )
}
