import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 30
    },
    headerButtons: {
        marginHorizontal: 0,
        marginVertical: 0,
        textTransform: 'none',
        fontWeight: 'bold'
    },
    modal: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start'
    },
    dropdown: {
        borderWidth: 0,
        height: 5
    },
    dropdownContainer: {
        width: '78%'
    },
    view: {
        paddingLeft: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    pressView: {
        paddingLeft: 45,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        position: 'absolute',
        left: 0,
        top: 2,
        color: '#db6551'
    },
    divider: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#db6551',
        marginBottom: 20
    },
    input: {
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0,
        width: '72%',
        marginLeft: 10,
        height: 20
    },
    scroll: {
        minHeight: '100%'
    },
    editor: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#db6551',
        minHeight: 400
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