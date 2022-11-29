import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    headerName: {
        fontSize: 22,
        fontWeight: '600'
    },
    headerAge: {
        fontSize: 14
    },
    bodyHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DB6551'
    },
    bodyView: {
        padding: 20,
    },
    bodyInfoHeader: {
        fontSize: 18,
        fontWeight: '600',
        paddingBottom: 20
    },
    bodyGeneralView: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 20
    },
    bodyGeneralInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1.5,
        borderBottomColor: '#E5A186',
        paddingVertical: 15
    },
    bodyGeneralInfoLeft: {
        fontSize: 12
    },
    bodyGeneralInfoRight: {
        fontSize: 12,
        fontWeight: '600'
    },
    bodyText: {
        fontSize: 14
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