import React from "react";
import { Text, View } from 'react-native';
import { Avatar, IconButton, Menu, Snackbar } from "react-native-paper";
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { logOutAction } from "../../store/actions/authActions";
import { ApplicationState } from "../../store";

export const ScreenHeader = (props: any) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const [visibleMenu, setVisibleMenu] = React.useState(false);

    const back = () => {props.navigation.goBack(null)}

    return (
        <View style={ styles.header }>
            {props.goBack ? 
                    <IconButton 
                        icon='chevron-left'
                        onPress={back}
                        size={30}
                    />
                :
                    <IconButton 
                        icon='menu'
                        onPress={props.navigation.openDrawer}
                        size={30}
                    />
            }
            <Text style={ styles.title }>{props.title ?? props.route.name}</Text>
            <IconButton
                icon="account-circle" 
                size={30} 
                style={{backgroundColor: 'white'}} 
                onPress={() => props.navigation.push('Shell', { screen: 'PatientProfile', params: { patient: appState.auth, logout: true } })} 
            />
        </View>
    )
}