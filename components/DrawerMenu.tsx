import React from "react";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const DrawerMenu = (props: DrawerContentComponentProps) => {

    return (
        <DrawerContentScrollView>
            <DrawerItem
                icon={({ color, size }) => (
                <MaterialCommunityIcons
                        name="home"
                        color={color}
                        size={size}
                    />
                )}
                label="Home"
                onPress={() => props.navigation.navigate('Shell', {screen: 'Home'})}
            />
            <DrawerItem
                icon={({ color, size }) => (
                <MaterialCommunityIcons
                        name="calendar"
                        color={color}
                        size={size}
                    />
                )}
                label="Calendario"
                onPress={() => props.navigation.navigate('Shell', {screen: 'Calendar'})}
            />
            <DrawerItem
                icon={({ color, size }) => (
                <MaterialCommunityIcons
                        name="clipboard"
                        color={color}
                        size={size}
                    />
                )}
                label="Historial de citas"
                onPress={() => props.navigation.navigate('Shell', {screen: 'AppointmentHistory'})}
            />
        </DrawerContentScrollView>
    )
}