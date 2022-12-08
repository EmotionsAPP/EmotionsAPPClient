import React, { useEffect, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { FAB, IconButton, Provider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { CreateArticle } from "../../components/createArticle/CreateArticle";
import { styles } from './style';
import { ArticleSmallCard } from "../../components/articleSmallCard/ArticleSmallCard";
import { deleteArticleAction, getArticlesAction } from "../../store/actions/articleActions";
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import { WebView } from 'react-native-webview';
import { ConfirmDialog } from "../../components/confirmDialog/ConfirmDialog";
import { Article } from "../../models";

interface ArticleProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Article'>;
    route: any;
}

export const ArticleScreen: React.FC<ArticleProps> = (props) => {
    
    const appState = useSelector((state: ApplicationState) => state);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    
    const dateCreated = new Date(props.route.params.article.createdAt ?? 0);

    const [confirmDialog, setConfirmDialogVisible] = useState(false);
    const [confirmDialogText, setConfirmDialogText] = useState('');
    const [confirmDialogButtons, setConfirmDialogButtons] = useState(['cancel', 'accept']);
    const [confirmDialogOnAccept, setConfirmDialogOnAccept] = useState<() => void>(() => {});
    const [confirmDialogOnCancel, setConfirmDialogOnCancel] = useState<() => void>(() => {});

    const [articleModal, visibleArticleModal] = React.useState(false);

    const showArticleModal = () => visibleArticleModal(true);
    const hideArticleModal = () => visibleArticleModal(false);

    const onAcceptDelete = () => () => {
        deleteArticleAction(props.route.params.article._id, dispatch, onSuccessDelete);
    }

    const onSuccessDelete = () => {
        props.navigation.goBack();
        setConfirmDialogVisible(false);
    }

    const onCancel = () => () => setConfirmDialogVisible(false);

    const deleteArticle = () => {
        setConfirmDialogText('¿Quieres borrar este artículo?');
        setConfirmDialogOnAccept(onAcceptDelete);
        setConfirmDialogOnCancel(onCancel);
        setConfirmDialogVisible(true);
    }

    const articleEdited = (article : Article) => {
        props.route.params.article = article;
        hideArticleModal();
    }

    return (
        <View style={styles.view}>
            <CreateArticle edit={true} editArticle={props.route.params.article} visible={articleModal} hide={hideArticleModal} edited={articleEdited} />
            <View style={{backgroundColor: 'white'}}>
                <Text style={styles.title}>{props.route.params.article.title}</Text>
                <View style={styles.infoView}>
                    <View style={styles.infoText}>
                        <IconButton 
                            icon="account"
                            color="#DB6551FC"
                            size={20}
                        />
                        <Text style={ [styles.text, {marginRight: 10}] }>
                            { `${props.route.params.article.psychologist?.firstName} ${props.route.params.article.psychologist?.lastName}` }
                        </Text>
                    </View>
                    <View style={styles.infoText}>
                        <IconButton 
                            icon="calendar"
                            color="#DB6551FC"
                            size={20}
                        />
                        <Text style={styles.text}>{ dateCreated.toLocaleDateString() }</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <WebView
                    style={{minHeight: 500}}
                    source={{ html: props.route.params.article.body }}
                    scalesPageToFit={false}
                />
            </ScrollView>
            {
                appState.auth?.user._id == props.route.params.article.psychologist._id ?
                    <View style={ styles.actionsView }>
                        <Pressable style={ styles.action } onPress={() => deleteArticle()}>
                            <IconButton 
                                icon="delete-outline"
                                color="#C6594A"
                                size={20}
                            />
                            <Text style={{color: '#C6594A', fontSize: 10}}>Borrar Artículo</Text>
                        </Pressable>
                        <Pressable style={ styles.action } onPress={() => showArticleModal()}>
                            <IconButton 
                                icon="pencil-outline"
                                color="#DB6551FC"
                                size={20}
                            />
                            <Text style={{color: '#C6594A', fontSize: 10}}>Editar Artículo</Text>
                        </Pressable>
                        <ConfirmDialog 
                            text={confirmDialogText} 
                            visible={confirmDialog} 
                            buttons={confirmDialogButtons} 
                            onAccept={confirmDialogOnAccept} 
                            onCancel={confirmDialogOnCancel}
                            closeModal={onCancel}
                            canDismiss={true}
                        />
                    </View>
                : <></>
            }
        </View>
    )
}
