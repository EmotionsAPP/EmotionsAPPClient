import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    view: {
        height: '100%', 
        width: '100%', 
        backgroundColor: 'white',
        paddingTop: 20
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        backgroundColor: '#DB6551'
    },
    waitingModalText: {
        paddingLeft: 10,
    },
    waitingModalView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});