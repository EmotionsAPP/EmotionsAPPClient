import React from "react";
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerMenu } from "../components";
import { CalendarScreen, HomeScreen, AppointmentHistoryScreen, AppointmentScreen, PatientProfileScreen, ArticleListScreen, ArticleScreen, EditPatientProfileScreen, PsychologistProfileScreen, EditPsychologistProfileScreen, PsychologistListScreen } from "../screens"; 
import { Chat } from "../screens/chat";
import { ScreenHeader } from "../components/header/ScreenHeader";

export type ShellNavigatorParamList = {
    Home: {},
    Calendar: {},
    AppointmentHistory: {},
    Chat: {
        room: string
    },
    Appointment: {
        appointment: any
    },
    PatientProfile: {
        patient: any
    },
    ArticleList: {},
    Article: {
        article: any
    },
    EditPatientProfile: {
        patient: any
    }
    PsychologistProfile: {
        patient: any
    },
    EditPsychologistProfile: {
        patient: any
    },
    PsychologistList: {},
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
                    header: (props) => <ScreenHeader {...props} title="Paciente" goBack={true} notOpenProfile={true} goBackHome={true} />
                }}
            />
            <Drawer.Screen name="ArticleList" component={ArticleListScreen} 
                options={{
                    header: (props) => <ScreenHeader {...props} title="Articulos" />
                }}
            />
            <Drawer.Screen name="Article" component={ArticleScreen} 
                options={{
                    header: (props) => <ScreenHeader {...props} title="Articulos" goBack={true} />
                }}
            />
            <Drawer.Screen name="EditPatientProfile" component={EditPatientProfileScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Editar Perfil" goBack={true} notOpenProfile={true} />
                }}
            />
            <Drawer.Screen name="PsychologistProfile" component={PsychologistProfileScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Especialista" goBack={true} notOpenProfile={true} goBackHome={true} />
                }}
            />
            <Drawer.Screen name="EditPsychologistProfile" component={EditPsychologistProfileScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Editar Perfil" goBack={true} notOpenProfile={true} />
                }}
            />
            <Drawer.Screen name="PsychologistList" component={PsychologistListScreen}
                options={{
                    header: (props) => <ScreenHeader {...props} title="Especialistas" />
                }}
            />
            
        </Drawer.Navigator>
      );
}