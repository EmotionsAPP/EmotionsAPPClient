import React from "react"
import { Text, View } from "react-native"
import { ShellNavigatorParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { Button, Portal, Provider } from "react-native-paper";
import { AppointmentForm } from "../components";

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
            <View>
                <Button onPress={() => showAppointmentModal()}>Nueva Cita</Button>
            </View>
        </Provider>
    )
}