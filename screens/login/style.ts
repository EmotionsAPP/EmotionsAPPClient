import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainView: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 10,
        backgroundColor: 'white',
        height: '100%'
    },
    backAndLogo: {
        display: 'flex',
        flexDirection: 'row',
    },
    mainLogo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    mainLogoImg: {
        width: 33,
        height: 30,
        resizeMode: 'stretch',
    },
    mainLogoText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10
    },
    centerInfo: {
        paddingTop: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30
    },
    headText: {
        fontSize: 24,
        fontWeight: '500',
        paddingBottom: 40
    },
    centerImg: {
        width: 282,
        height: 205,
        resizeMode: 'stretch',
        marginBottom: 25
    },
    centerText: {
        fontSize: 22,
        paddingVertical: 30,
        paddingHorizontal: 50,
        textAlign: 'center'
    },
    selectAccountButton: {
        width: '75%',
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'white',
        backgroundColor: '#DB6551',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 25
    },
    selectAccountButtonText: {
        color: 'white',
        fontSize: 20
    },
    textInput: {
        width: '90%',
        height: 50,
        marginBottom: 20,
        paddingLeft: 5
    },
    mainButton: {
        backgroundColor: '#DB6551',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 28,
    }, 
    mainButtonText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
    },
    bottomTextView: {
        display: 'flex',
        flexDirection: 'row',
    },
    bottomText: {
        fontSize: 16,
        textAlign: 'center',
    },
    bottomTextLink: {
        color: '#DB6551',
        fontWeight: '600',
        fontSize: 16
    }
});