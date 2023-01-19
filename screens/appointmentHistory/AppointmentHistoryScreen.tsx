import React, { useEffect } from "react"
import { ActivityIndicator, ImageBackground, Text, View } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { useIsFocused } from '@react-navigation/native';
import { getAppointmentHistoryAction } from "../../store/actions/appointmentActions";
import { styles } from './style';
import { ScrollView } from "react-native-gesture-handler";
import { AppointmentSmallCard } from "../../components/appointmentSmallCard/AppointmentSmallCard";
import { traduct } from "../../langs";

interface AppointmentHistoryProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'AppointmentHistory'>;
}

export const AppointmentHistoryScreen: React.FC<AppointmentHistoryProps> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDateName = (date: string) => {
        const toDate = new Date(date);
        return `${toDate.getDate()} ${monthNames[toDate.getMonth()]} ${toDate.getFullYear()}`
    }

    useEffect(() => {
        if(isFocused) getAppointmentHistoryAction(appState.auth?.user._id, dispatch);
    }, [isFocused]);

    return (
        <ImageBackground 
            source={
                require('../../assets/images/Topographic.png')
            }
            resizeMode='cover'
            style={styles.view}
        >
            {
                appState.appointment?.fetchingAppointmentHistory ? 
                    <View style={styles.waitingModalView}>
                        <ActivityIndicator size="small" color="#DB6551" />
                        <Text style={styles.waitingModalText}>{traduct("loading")}...</Text>
                    </View>
                : 
                    <></>
            }
            <ScrollView>
                {
                    appState.appointment?.appointmentHistory.map((history: any, index: any) => {
                        return <View key={index}>
                            <Text style={styles.header}>{getDateName(history.date)}</Text>
                            {
                                history.appointments.map((appointment: any) => {
                                    return <AppointmentSmallCard appointment={appointment} navigation={navigation} key={appointment._id} />
                                })
                            }
                        </View>
                    })
                }
            </ScrollView>
        </ImageBackground>
    )
}