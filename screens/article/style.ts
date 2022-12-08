import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    view: {
        padding: 20,
        backgroundColor: 'white',
        height: '100%'
    },
    infoView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5
    },
    infoText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 12
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#DB6551FC',
        borderBottomColor: '#DB6551FC',
        borderBottomWidth: 0.6,
        paddingBottom: 10
    },
    actionsView: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0
    },
    action: {
        alignItems: 'center'
    }
});