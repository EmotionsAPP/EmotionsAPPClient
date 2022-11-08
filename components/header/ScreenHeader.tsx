import React from "react";
import { Text, View } from 'react-native';
import { Avatar, IconButton, Menu, Snackbar } from "react-native-paper";
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import { logOutAction } from "../../store/actions/authActions";

export const ScreenHeader = (props: any) => {
    const [visibleMenu, setVisibleMenu] = React.useState(false);
    const openMenu = () => setVisibleMenu(true);
    const closeMenu = () => setVisibleMenu(false);
    const dispatch = useDispatch();

    return (
        <View style={ styles.header }>
            <IconButton 
                icon='menu'
                onPress={props.navigation.openDrawer}
                size={30}
            />
            <Text style={ styles.title }>{props.title ?? props.route.name}</Text>
            <Menu
                visible={visibleMenu}
                onDismiss={closeMenu}
                anchor={
                    <IconButton
                        icon="account-circle" 
                        size={30} 
                        style={{backgroundColor: 'white'}} 
                        onPress={openMenu}
                    />
                }
            >
                <Menu.Item onPress={() => logOutAction(dispatch, props.navigation)} title="Cerrar sesion"/>
            </Menu>
        </View>
    )
}