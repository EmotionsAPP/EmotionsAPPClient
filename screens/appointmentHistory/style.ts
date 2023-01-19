import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    view: {
        minHeight: '100%', 
        width: '100%', 
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    header: {
        fontSize: 16,
        fontWeight: '600',
        paddingBottom: 20
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