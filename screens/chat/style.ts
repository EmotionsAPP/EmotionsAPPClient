import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    systemMessageView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    composerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        backgroundColor: '#F5F5F5'
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 3,
        width: '66%',
        paddingVertical: 10,
        paddingLeft: 15,
    },
    sendButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        marginHorizontal: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 3,
    },
    waitingModal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    waitingModalContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '20%',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
    okButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#DB6551',
        width: '40%',
        marginTop: 15
    },
    okButtonText: {
        textAlign: 'center',
        color: 'white'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerName: {
        fontSize: 20,
        fontWeight: '600'
    }
})