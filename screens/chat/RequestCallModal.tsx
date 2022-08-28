import React from "react";
import { Button, Modal, Portal, Text } from "react-native-paper";

interface RequestCallModal {
    text: string;
    visible: boolean;
    onAccept: () => void;
    onCancel: () => void;
    closeModal: () => void;
}

export const RequestCallModal: React.FC<RequestCallModal> = (props) => {
    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.closeModal}
            >
                <Text>
                    {props.text}
                </Text>
                <Button onPress={() => props.onCancel()}>Declinar</Button>
                <Button onPress={() => props.onAccept()}>Aceptar</Button>
            </Modal>
        </Portal>
    )
}