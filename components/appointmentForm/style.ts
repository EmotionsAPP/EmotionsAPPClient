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
        position: 'absolute',
        bottom: 0,
        left: 0, 
        right: 0,
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
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
    }
})