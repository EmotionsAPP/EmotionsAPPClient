import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        height: '30%',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    okButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#DB6551',
        width: '40%',
        marginTop: 25
    },
    okButtonText: {
        textAlign: 'center',
        color: 'white'
    },
    cancelButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DB6551',
        width: '40%',
        marginTop: 25
    },
    cancelButtonText: {
        textAlign: 'center',
        color: '#DB6551'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
    }
})