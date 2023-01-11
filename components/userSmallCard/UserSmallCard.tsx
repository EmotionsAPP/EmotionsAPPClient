import React from "react";
import { Pressable, View } from 'react-native';
import { IconButton, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { User } from "../../models";
import { styles } from "./style";
import { traduct } from "../../langs";

interface UserSmallCardProps {
    user: User;
    navigation: NativeStackNavigationProp<any> | DrawerNavigationProp<any>;
}

export const UserSmallCard: React.FC<UserSmallCardProps> = (props) => {
    
    const openUser = () => {
        props.navigation.navigate('Shell', { screen: 'PatientProfile', params: { patient: props.user } })
    }    

    const now = new Date();
    const age = now.getFullYear() - (props.user.patient?.birthday?.getFullYear() ?? 0);

    const appState = useSelector((state: ApplicationState) => state);
    
    return (
        <Pressable style={styles.container} onPress={openUser}>
            <IconButton
                icon="account-circle-outline"
                color="#F38673"
                size={40}
            />
            <View style={styles.description}>
                <Text style={styles.descriptionName}>{ `${props.user.firstName} ${props.user.lastName}` }</Text>
                <Text style={styles.descriptionAge}>{ `${age == now.getFullYear() ? '-' : age} ${traduct("years")}` }</Text>
            </View>
            <IconButton 
                icon="chevron-right"
                color="#DB6551FC"
                size={25}
                style={{
                    position: 'absolute',
                    right: 0
                }}
            />
        </Pressable>
    )
}