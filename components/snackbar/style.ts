import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    basic: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        color: 'white',
        position: 'relative',
    },
    basicOffline: {
        backgroundColor: '#E9A14D'
    },
    basicSaved: {
        backgroundColor: '#41B780'
    },
    basicError: {
        backgroundColor: '#C6594A'
    },
    basicText: {
        color: 'white',
        paddingLeft: 5,
        flexGrow: 1, 
        flexShrink: 1, 
        paddingRight: 8,
        alignItems: 'center',
        
    },
    textContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 280
    },
    closeButton: {
        
    }
});