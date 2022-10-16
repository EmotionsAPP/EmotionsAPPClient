import React from "react"
import { Text, View } from "react-native"
import { ShellNavigatorParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { Button, FAB, Portal, Provider } from "react-native-paper";
import { AppointmentForm } from "../components";
import { StyleSheet } from 'react-native';

interface CalendarProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Calendar'>;
}

export const CalendarScreen: React.FC<CalendarProps> = ({ navigation }) => {
    const [appointmentModal, visibleAppointmentModal] = React.useState(false);

    const showAppointmentModal = () => visibleAppointmentModal(true);
    const hideAppointmentModal = () => visibleAppointmentModal(false);
    return (
        <Provider>
            <AppointmentForm visible={appointmentModal} hide={hideAppointmentModal} />
            <View style={{height: '100%', width: '100%'}}>
                <FAB 
                    icon="plus"
                    style={ styles.fab }
                    visible={true}
                    color="white"
                    onPress={() => showAppointmentModal()} 
                />
            </View>
        </Provider>
    )
}


export const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        backgroundColor: '#DB6551'
    }
})