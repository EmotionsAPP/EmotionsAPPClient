import React, { useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import { ShellNavigatorParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../store";
import { userAppointmentsAction } from "../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../components/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";

interface HomeProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Home'>;
}

export const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);
    const dispatch = useDispatch();
    
    useEffect(() => {
        userAppointmentsAction(appState.auth?.user ?? ' ', dispatch);
    }, [])

    return (
        <ScrollView>
            <View style={styles.screen}>
                <Text style={styles.title}>Reuniones</Text>
                <View>
                    {
                        appState.appointment?.userAppointments.map((appointment) => {
                            return <AppointmentSmallCard appointment={appointment} navigation={navigation} key={appointment._id} />
                        })
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20
    },
    title: {
        fontSize: 20,
        paddingBottom: 15
    }
})