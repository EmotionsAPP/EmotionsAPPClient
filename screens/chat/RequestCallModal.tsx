import React from "react";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { Pressable, StyleSheet, View } from 'react-native';

interface RequestModal {
    text: string;
    visible: boolean;
    buttons: string[];
    onAccept: () => void;
    onCancel: () => void;
    onOk: () => void;
    closeModal: () => void;
    canDismiss: boolean;
}

export const RequestModal: React.FC<RequestModal> = (props) => {
    return (
        <Portal>
            <Modal
                visible={props.visible}
                dismissable={props.canDismiss}
                onDismiss={props.closeModal}
                style={styles.modal}
                contentContainerStyle={styles.modalContainer}
            >
                <Text style={{textAlign: 'center'}}>
                    {props.text}
                </Text>
                <View style={styles.buttons}>
                    {
                        props.buttons.includes('cancel') ?
                        <Pressable 
                            onPress={() => props.onCancel()}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </Pressable>
                        : <></>
                    }
                    {
                        props.buttons.includes('accept') ?
                        <Pressable 
                            onPress={() => props.onAccept()}
                            style={styles.okButton}
                        >
                            <Text style={styles.okButtonText}>Aceptar</Text>
                        </Pressable>
                        : <></>
                    }
                    {
                        props.buttons.includes('ok') ? 
                        <Pressable 
                            onPress={() => props.onOk()}
                            style={styles.okButton}
                        >
                            <Text style={styles.okButtonText}>Aceptar</Text>
                        </Pressable>
                        : <></>
                    }
                </View>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        height: '30%',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    okButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#DB6551',
        width: '40%',
        marginTop: 25
    },
    okButtonText: {
        textAlign: 'center',
        color: 'white'
    },
    cancelButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DB6551',
        width: '40%',
        marginTop: 25
    },
    cancelButtonText: {
        textAlign: 'center',
        color: '#DB6551'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
    }
})