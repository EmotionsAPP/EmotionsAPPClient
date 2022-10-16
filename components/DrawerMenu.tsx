import React from "react";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image, ImageBackground } from "react-native";
import { StyleSheet } from 'react-native';

export const DrawerMenu = (props: DrawerContentComponentProps) => {

    return (
        <View style={{height: '100%'}}>
            <ImageBackground
                source={
                    require('../assets/images/Topographic.png')
                }
                resizeMode='cover'
                style={
                    {width: '100%', height: '100%'}
                }
            >
                <DrawerContentScrollView >
                    <View style={ styles.mainLogo }>
                        <Image
                            style={ styles.mainLogoImg }
                            source={
                                require('../assets/icons/EmotionsIcon.png')
                            }
                        />
                        <Text style={ styles.mainLogoText }>Emotions</Text>
                    </View>
                    <DrawerItem
                        icon={({ color, size }) => (
                        <MaterialCommunityIcons
                                name="home"
                                color="#DB6551"
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
                                color="#DB6551"
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
                                color="#DB6551"
                                size={size}
                            />
                        )}
                        label="Historial de citas"
                        onPress={() => props.navigation.navigate('Shell', {screen: 'AppointmentHistory'})}
                    />
                </DrawerContentScrollView>
            </ImageBackground>
        </View>
    )
}


export const styles = StyleSheet.create({
    mainLogo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25
    },
    mainLogoImg: {
        width: 33,
        height: 30,
        resizeMode: 'stretch',
    },
    mainLogoText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10
    },
})