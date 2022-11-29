import React from "react";
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerMenu } from "../components";
import { CalendarScreen, HomeScreen, AppointmentHistoryScreen, AppointmentScreen } from "../screens"; 
import { Chat } from "../screens/chat";
import { ScreenHeader } from "../components/header/ScreenHeader";
import { PatientProfileScreen } from "../screens/patientProfile/PatientProfileScreen";
import { ArticleListScreen } from "../screens/articleList/ArticleListScreen";

export type ShellNavigatorParamList = {
    Home: {},
    Calendar: {},
    AppointmentHistory: {},
    Chat: {
        room: string
    }
    Appointment: {
        appointment: any
    },
    PatientProfile: {
        patient: any
    }
    ArticleList: {}
}

const Drawer = createDrawerNavigator<ShellNavigatorParamList>();

export const ShellNavigator = () => {
    return (
        <Drawer.Navigator
            backBehavior="history"
            drawerContent={(props) => <DrawerMenu { ...props }/>}
        >
            <Drawer.Screen name="Home" component={HomeScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Bienvenido" />
                }}
            />
            <Drawer.Screen name="Calendar" component={CalendarScreen} 
                options={{
                    header: (props) => <ScreenHeader {...props} title="Calendario" />
                }}
            />
            <Drawer.Screen name="AppointmentHistory" component={AppointmentHistoryScreen} />
            <Drawer.Screen name="Chat" component={Chat} 
                options={{
                    header: (props) => <></>
                }}
            />
            <Drawer.Screen name="Appointment" component={AppointmentScreen} 
                options={{
                    header: (props) => <ScreenHeader {...props} title="Reunión" goBack={true} />
                }}
            />
            <Drawer.Screen name="PatientProfile" component={PatientProfileScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Paciente" goBack={true} />
                }}
            />
            <Drawer.Screen name="ArticleList" component={ArticleListScreen} 
                options={{
                    header: (props) => <ScreenHeader {...props} title="Articulos" />
                }}
            />
        </Drawer.Navigator>
      );
}