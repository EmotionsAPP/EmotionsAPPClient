import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 50,
        backgroundColor: 'white',
    },
    customInput: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#DB6551',
        width: '100%',
        marginBottom: 20
    },
    customInputPressable: {
        width: '100%',
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    customInputText: {
        position: 'absolute',
        top: -8,
        left: 15,
        fontSize: 12,
        backgroundColor: 'white',
        zIndex: 9000000
    },
    dropInput: {
        height: 50,
        marginBottom: 20
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 40, 
        right: 50,
        backgroundColor: '#DB6551'
    },
    cameraIconImg: {
        position: 'absolute',
        bottom: 20, 
        right: 5,
        backgroundColor: '#DB6551'
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 30,
        height: 5,
        borderColor: '#DB6551'
    },
    dropdownContainer: {
        width: '100%',
    },
    profileImg: {
        height: 170,
        width: 170,
        marginBottom: 30,
        borderRadius: 100
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