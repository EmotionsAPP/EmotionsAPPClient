import React from "react"
import { Text, View } from "react-native"
import { ShellNavigatorParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";

interface AppointmentHistoryProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'AppointmentHistory'>;
}

export const AppointmentHistoryScreen: React.FC<AppointmentHistoryProps> = ({ navigation }) => {
    return (
        <View>
            <Text>History</Text>
        </View>
    )
}