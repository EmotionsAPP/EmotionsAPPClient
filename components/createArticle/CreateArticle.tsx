import React, { useState } from "react";
import { SafeAreaView, View, TextInput, ScrollView } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { newArticleAction } from "../../store/actions/articleActions";
import { styles } from './style';

interface AppointmentFormProps {
    visible: boolean;
    hide: () => void;
}

interface FormData {
    title: string;
    body: string;
    psychologist: string;
}

export const CreateArticle: React.FC<AppointmentFormProps> = (props) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const richText = React.useRef();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        body: '',
        psychologist: appState.auth?.user?._id
    })

    const dispatch = useDispatch();

    const closeModal = () => {
        setFormData({
            title: '',
            body: '',
            psychologist: ''
        });
        props.hide()
    }

    const saveArticle = () => {
        newArticleAction(formData, dispatch, closeModal);
    }

    return (
        <Portal>
            <Modal 
                visible={props.visible} 
                contentContainerStyle={styles.modal} 
                onDismiss={closeModal}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Button 
                            mode="text" 
                            color="#000" 
                            labelStyle={styles.headerButtons}
                            onPress={closeModal}
                        >
                            Cancelar
                        </Button>
                        <Text>Nuevo artículo</Text>
                        <Button 
                            mode="text" 
                            color="#000" 
                            disabled={ (formData.title && formData.body) ? false : true }
                            labelStyle={styles.headerButtons}
                            onPress={() => saveArticle()}
                        >
                            Completar
                        </Button>
                    </View>
                    <View style={styles.divider}>
                        <IconButton 
                            style={styles.icon} 
                            icon="card-text-outline" 
                            color="#db6551"
                        />
                        <View style={styles.view}>
                            <Text>Título</Text>
                            <TextInput 
                                value={ formData.title }
                                onChangeText={ (text) => setFormData({ ...formData, title: text }) }
                                placeholder=""
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <ScrollView style={styles.scroll}>
                        <View style={styles.editor}>
                            <RichToolbar
                                editor={richText}
                                actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList,actions.insertImage]}
                                style={{borderBottomColor: '#db6551', borderBottomWidth: 1, width: '100%'}}
                            />
                            <RichEditor
                                ref={richText as any}
                                onChange={ (text) => setFormData({ ...formData, body: text })}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </Portal>
    )
}

