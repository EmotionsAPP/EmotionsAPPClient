import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { lastContactedUsersAction, userAppointmentsAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/appointmentSmallCard/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { Avatar, IconButton } from "react-native-paper";
import { logOutAction } from "../../store/actions/authActions";

interface PatientProfileProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'PatientProfile'>;
    route: any;
}

export const PatientProfileScreen: React.FC<PatientProfileProps> = (props: any) => {
    
    const now = new Date();
    const birthday = new Date(props.route.params.patient?.user?.birthday)
    const age = now.getFullYear() - (birthday.getFullYear() ?? 0);
    const dispatch = useDispatch();


    return (
        <View style={{backgroundColor: 'white', margin: 30}}>
            <View style={styles.header}>
                <IconButton
                    icon="account-circle-outline"
                    color="#F38673"
                    size={80}
                    style={{marginLeft: -20}}
                />
                <View style={styles.headerText}>
                    <Text style={styles.headerName}>{`${props.route.params.patient.user?.firstName} ${props.route.params.patient.user?.lastName}`}</Text>
                    <Text style={styles.headerAge}>{age ? `${age} años` : '-'}</Text>
                </View>
            </View>
            <ScrollView>
                <Text style={styles.bodyHeader}>Información</Text>
                <View style={styles.bodyView}>
                    <Text style={styles.bodyInfoHeader}>General</Text>
                    <View style={styles.bodyGeneralView}>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Nombre</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{props.route.params.patient.user?.firstName}</Text>
                        </View>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Apellido</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{props.route.params.patient.user?.lastName}</Text>
                        </View>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Fecha de nacimiento</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{String(age) == 'NaN' ? '-' : age}</Text>
                        </View>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Género</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{props.route.params.patient.user?.gender ?? '-'}</Text>
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}}>
                        <Text style={styles.bodyInfoHeader}>Información</Text>
                        <Text style={styles.bodyText}>{props.route.params.patient.patient?.user?.information ?? '-'}</Text>
                    </View>
                    <View style={{paddingBottom: 20}}>
                        <Text style={styles.bodyInfoHeader}>Notas</Text>
                        <Text style={styles.bodyText}>-</Text>
                    </View>
                    <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Pressable
                            style={ styles.emergencyAction }
                            onPress={() => { logOutAction(dispatch, props.navigation) } }
                        >
                            <Text style={ styles.emergencyActionText }>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}