import React from "react";
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerMenu } from "../components";
import { CalendarScreen, HomeScreen, AppointmentHistoryScreen } from "../screens"; 
import { Chat } from "../screens/chat";

export type ShellNavigatorParamList = {
    Home: {},
    Calendar: {},
    AppointmentHistory: {},
    Chat: {
        room: string
    }
  }

const Drawer = createDrawerNavigator<ShellNavigatorParamList>();

export const ShellNavigator = () => {
    return (
        <Drawer.Navigator
            backBehavior="order"
            drawerContent={(props) => <DrawerMenu { ...props }/>}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Calendar" component={CalendarScreen} />
            <Drawer.Screen name="AppointmentHistory" component={AppointmentHistoryScreen} />
            <Drawer.Screen name="Chat" component={Chat} />

        </Drawer.Navigator>
      );
}