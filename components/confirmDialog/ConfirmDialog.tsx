import React from "react";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { Pressable, StyleSheet, View } from 'react-native';
import { styles } from './style';

interface RequestModal {
    text: string;
    visible: boolean;
    buttons: string[];
    onAccept: () => void;
    onCancel: () => void;
    closeModal: () => void;
    canDismiss: boolean;
    cancelButtonText?: string;
    acceptButtonText?: string;
}

export const ConfirmDialog: React.FC<RequestModal> = (props) => {
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
                            <Text style={styles.cancelButtonText}>{props.cancelButtonText ?? 'Cancelar'}</Text>
                        </Pressable>
                        : <></>
                    }
                    {
                        props.buttons.includes('accept') ?
                        <Pressable 
                            onPress={() => props.onAccept()}
                            style={styles.okButton}
                        >
                            <Text style={styles.okButtonText}>{props.acceptButtonText ?? 'Aceptar'}</Text>
                        </Pressable>
                        : <></>
                    }
                </View>
            </Modal>
        </Portal>
    )
}

