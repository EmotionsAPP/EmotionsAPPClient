import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerButton: {
        height: 200,
        width: 200,
        borderWidth: 2,
        borderColor: '#F38673',
    },
    stream: {
        height: '50%',
        width: '100%'
    },
    footerButtons: {
        position: 'absolute',
        bottom: 40,
        left: '22%',
        display: 'flex',
        flexDirection: 'row',
        zIndex: 1000
    },
    hangupButton: {
        borderRadius: 100,
        backgroundColor: '#DB6551',
    },
    personName: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: '600',
        paddingTop: 10
    },
    middleButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%',
        height: '30%',
        marginBottom: '30%',
    },
    middleButtonView: {
        display: 'flex',
        flexDirection: 'column'
    },
    middleButton: {
        borderRadius: 100,
        backgroundColor: '#E5A186'
    },
    middleButtonText: {
        textAlign: 'center'
    },
    middleButtonActive: {
        borderRadius: 100,
        backgroundColor: '#DB6551'
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
})