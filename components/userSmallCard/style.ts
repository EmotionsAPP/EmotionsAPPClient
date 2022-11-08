import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '99.8%',
        backgroundColor: '#F2F2F2'
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    descriptionName: {
        fontSize: 16,
        fontWeight: '200'
    },
    descriptionAge: {
        fontSize: 12
    }
});