import React, { useEffect } from "react"
import { View } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { FAB, Provider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { CreateArticle } from "../../components/createArticle/CreateArticle";
import { styles } from './style';
import { ArticleSmallCard } from "../../components/articleSmallCard/ArticleSmallCard";
import { getArticlesAction } from "../../store/actions/articleActions";
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

interface CalendarProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Calendar'>;
}

export const ArticleListScreen: React.FC<CalendarProps> = ({ navigation }) => {
    const [articleModal, visibleArticleModal] = React.useState(false);
    
    const showArticleModal = () => visibleArticleModal(true);
    const hideArticleModal = () => visibleArticleModal(false);
    
    const appState = useSelector((state: ApplicationState) => state);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused)
            if(appState.auth?.user?.hasOwnProperty('psychologist')) 
                getArticlesAction(dispatch, appState, appState.auth?.user?._id) 
            else getArticlesAction(dispatch, appState)
    }, [isFocused]);

    return (
        <Provider>
            <CreateArticle visible={articleModal} hide={hideArticleModal} />
            <View style={ styles.view }>
                <ScrollView>
                    {
                        appState.article?.articles.map((article) => {
                            return <View key={article._id} style={{marginHorizontal: 20, marginBottom: 20}}><ArticleSmallCard article={article} navigation={navigation} /></View>
                        })
                    }
                </ScrollView>
                {
                    appState.auth?.user?.hasOwnProperty('psychologist') ? 
                        <FAB 
                            icon="plus"
                            style={ styles.fab }
                            visible={true}
                            color="white"
                            uppercase={false}
                            label="Agregar Artículo"
                            onPress={() => showArticleModal()} 
                        />
                    : 
                        <></>
                }
            </View>
        </Provider>
    )
}
