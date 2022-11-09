import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    actionBgImage: {
        minHeight: '100%',
        minWidth: '100%',
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
    header: {
        marginTop: 20,
        marginHorizontal: 20,
        borderBottomColor: '#E5A186',
        borderBottomWidth: 1
    },
    headerText: {
        fontWeight: '600',
        fontSize: 18,
        paddingBottom: 8
    },
    scroll: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    infoView: {
        paddingBottom: 30,
        display: 'flex', 
        flexDirection: 'column'
    },
    infoTitle: {
        fontSize: 18,
        paddingBottom: 10
    },
    infoText: {
        fontWeight: '600',
        fontSize: 16
    },
    participantView: {
        display: 'flex',
        flexDirection: 'row'
    },
    joinView: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 30
    }
})