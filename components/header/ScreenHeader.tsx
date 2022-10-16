import React from "react";
import { Text, View } from 'react-native';
import { Avatar, IconButton, Snackbar } from "react-native-paper";
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ScreenHeader = (props: any) => {
    
    return (
        <View style={ styles.header }>
            <IconButton 
                icon='menu'
                onPress={props.navigation.openDrawer}
                size={30}
            />
            <Text style={ styles.title }>{props.title ?? props.route.name}</Text>
            <Avatar.Icon icon="account-circle" size={55} style={{backgroundColor: 'white'}} />
        </View>
    )
}