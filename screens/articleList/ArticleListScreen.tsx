import React from "react"
import { Text, View } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { Button, FAB, Portal, Provider } from "react-native-paper";
import { AppointmentForm } from "../../components";
import { StyleSheet } from 'react-native';
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { CreateArticle } from "../../components/createArticle/CreateArticle";

interface CalendarProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Calendar'>;
}

export const ArticleListScreen: React.FC<CalendarProps> = ({ navigation }) => {
    const [articleModal, visibleArticleModal] = React.useState(false);
    
    const showArticleModal = () => visibleArticleModal(true);
    const hideArticleModal = () => visibleArticleModal(false);
    
    const appState = useSelector((state: ApplicationState) => state);
    return (
        <Provider>
            <CreateArticle visible={articleModal} hide={hideArticleModal} />
            <View style={{height: '100%', width: '100%'}}>
                {
                    appState.auth?.user?.hasOwnProperty('psychologist') ? 
                        <FAB 
                            icon="plus"
                            style={ styles.fab }
                            visible={true}
                            color="white"
                            onPress={() => showArticleModal()} 
                        />
                    : 
                        <></>
                }
            </View>
        </Provider>
    )
}


export const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        backgroundColor: '#DB6551'
    }
})