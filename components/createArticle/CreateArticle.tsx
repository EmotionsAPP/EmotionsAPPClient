import React, { useEffect, useState } from "react";
import { SafeAreaView, View, TextInput, ScrollView } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import { Article } from "../../models";
import { ApplicationState } from "../../store";
import { editArticleAction, getArticlesAction, newArticleAction } from "../../store/actions/articleActions";
import { ConfirmDialog } from "../confirmDialog/ConfirmDialog";
import { styles } from './style';

interface AppointmentFormProps {
    visible: boolean;
    hide: () => void;
    edit?: boolean;
    editArticle?: Article;
    edited?: (article: Article) => void;
}

interface FormData {
    title?: string;
    body?: string;
    psychologist: string;
}

export const CreateArticle: React.FC<AppointmentFormProps> = (props) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const richText = React.useRef();

    const [formData, setFormData] = useState<FormData>({
        title: props.edit ? props.editArticle?.title : '',
        body: props.edit ? props.editArticle?.body : '',
        psychologist: appState.auth?.user?._id
    })

    const [confirmDialog, setConfirmDialogVisible] = useState(false);
    const [confirmDialogText, setConfirmDialogText] = useState('');
    const [confirmDialogButtons, setConfirmDialogButtons] = useState(['cancel', 'accept']);
    const [confirmDialogOnAccept, setConfirmDialogOnAccept] = useState<() => void>(() => {});
    const [confirmDialogOnCancel, setConfirmDialogOnCancel] = useState<() => void>(() => {});

    const dispatch = useDispatch();

    const closeModal = () => {
        getArticlesAction(dispatch, appState, appState.auth?.user?._id)   
        props.hide()
    }

    const saveArticle = () => {
        newArticleAction(formData, dispatch, closeModal);
    }
    
    const confirmEditArticle = () => {
        setConfirmDialogText('¿Quieres guardar estos cambios?');
        setConfirmDialogOnAccept(onAcceptEdit);
        setConfirmDialogOnCancel(onCancel);
        setConfirmDialogVisible(true);
    }
    
    const onCancel = () => () => setConfirmDialogVisible(false);
    const onAcceptEdit = () => () => {        
        editArticleAction(formData, dispatch, closeModalEdit, props.editArticle?._id);
    }

    const closeModalEdit = (article: Article) => {
        if(props.edited) props.edited(article);
        setConfirmDialogVisible(false);
    }

    useEffect(() => {
        if(props.visible)
            setFormData({
                title: props.edit ? props.editArticle?.title : '',
                body: props.edit ? props.editArticle?.body : '',
                psychologist: appState.auth?.user?._id
            })
    }, [props.visible])

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
                        <Text>{ props.edit ? 'Editar articulo' : 'Nuevo artículo'}</Text>
                        <Button 
                            mode="text" 
                            color="#000" 
                            disabled={ (formData.title && formData.body) ? false : true }
                            labelStyle={styles.headerButtons}
                            onPress={() => props.edit ? confirmEditArticle() : saveArticle() }
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
                                maxLength={50}
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
                                initialContentHTML={formData.body}
                                onChange={ (text) => setFormData({ ...formData, body: text })}
                            />
                        </View>
                    </ScrollView>
                    <ConfirmDialog 
                            text={confirmDialogText} 
                            visible={confirmDialog} 
                            buttons={confirmDialogButtons} 
                            onAccept={confirmDialogOnAccept} 
                            onCancel={confirmDialogOnCancel}
                            closeModal={onCancel}
                            canDismiss={true}
                        />
                </SafeAreaView>
            </Modal>
        </Portal>
    )
}

