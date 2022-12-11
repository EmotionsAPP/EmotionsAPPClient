import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    view: {
        minHeight: '100%', 
        width: '100%', 
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    psyView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#DB6551'
    },
    psyInfoView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImg: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    psyName: {
        fontSize: 16,
        fontWeight: '600',
        paddingBottom: 5
    },
    textInput: {
        width: '100%',
        marginBottom: 20,
        height: 50,
        backgroundColor: 'white',
    },
});