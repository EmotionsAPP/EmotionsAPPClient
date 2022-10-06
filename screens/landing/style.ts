import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "ProximaNova-Regular",
        backgroundColor: 'white'
    },
    welcomeText: {
        fontSize: 20,
        paddingVertical: 20
    },
    mainLogo: {
        paddingVertical: 30,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    mainLogoImg: {
        width: 60,
        height: 60,
        resizeMode: 'stretch',
    },
    mainLogoText: {
        paddingTop: 10,
        fontSize: 38,
        fontWeight: '700',
        letterSpacing: 1.5,
        paddingBottom: 10
    },
    mainInfo: {
        fontSize: 20,
        paddingBottom: 25,
        paddingHorizontal: 40,
        textAlign: 'center',
        lineHeight: 27
    },
    secondaryInfo: {
        fontSize: 14,
        paddingHorizontal: 30,
        paddingBottom: 10,
        textAlign: 'center',
        lineHeight: 20
    },
    mainButton: {
        backgroundColor: '#DB6551',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 15,
    }, 
    mainButtonText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 20,
    },
    secondaryButton: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginVertical: 15,
        backgroundColor: 'white',
        borderColor: '#DB6551',
        borderWidth: 1,
        borderRadius: 10
    },
    secondaryButtonText: {
        fontWeight: '500',
        fontSize: 20,
    },
    termsAndConditionsText: {
        fontSize: 14,
        position: 'absolute',
        bottom: 30,
        paddingHorizontal: 40,
        textAlign: 'center'
    },
    termsAndConditionsLink: {
        color: '#DB6551',
        textDecorationColor: '#DB6551',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        fontWeight: '600'
    }
  });