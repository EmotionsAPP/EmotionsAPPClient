import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '99.8%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: 'white'
    },
    time: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        paddingVertical: 20,
        paddingLeft: 50,
        backgroundColor: '#DB6551FC',
        width: '40%',
        height: '100%'
    },
    timeText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600'
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    descriptionView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    descriptionText: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    icon: {
        position: 'absolute',
        left: 0,
        top: 2,
        color: '#db6551'
    }
})