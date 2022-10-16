import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        padding: 15,
        backgroundColor: 'white',
        height: '100%',
    },
    scroll: {
        height: '50%',
    },
    title: {
        fontSize: 20,
        paddingBottom: 15
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    action: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    actionText: {
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    actionBgImage: {
        height: '100%', 
        width: '100%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    newMeetingAction: {
        backgroundColor: '#E6896B',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 28,
    }, 
    newMeetingActionText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
    },
    emergencyAction: {
        backgroundColor: '#DB6551',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 28,
    }, 
    emergencyActionText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
    },
})