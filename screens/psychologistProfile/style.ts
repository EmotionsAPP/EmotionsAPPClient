import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#E5A186',
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    headerName: {
        fontSize: 22,
        fontWeight: '600',
    },
    headerInfo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DB6551',
        paddingVertical: 15
    },
    bodyHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DB6551'
    },
    bodyView: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 5,
        backgroundColor: '#FBF6F5',
        borderRadius: 20,
        marginVertical: 10
    },
    bodyInfoHeader: {
        fontSize: 18,
        fontWeight: '600',
        paddingBottom: 15
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
    fab: {
        position: "absolute",
        right: 0,
        bottom: 10,
        margin: 16,
        backgroundColor: '#DB6551'
    },
    notesHeaderView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInput: {
        width: '100%',
        marginBottom: 20,
        paddingLeft: 5
    },
    navBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
    },
    navItem: {
        borderColor: '#DB6551',
        paddingHorizontal: 10
    },
    navItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1C1B1F'
    },
    profileImg: {
        height: 170,
        width: 170,
        marginBottom: 20,
        borderRadius: 100
    },
    goal: {
        borderBottomColor: '#DB6551',
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 10
    },
    workPlace: {
        borderBottomColor: '#DB6551',
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scheduleAction: {
        backgroundColor: '#DB6551',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 28,
        position: 'absolute',
        bottom: 0,
        right: 40,
        left: 40,
    }, 
    scheduleActionText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
        textAlign: 'center'
    },
})