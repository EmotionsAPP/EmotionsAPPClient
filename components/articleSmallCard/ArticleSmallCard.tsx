import React from "react";
import { Appointment, Article } from "../../models";
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { styles } from './style';

interface ArticleSmallCardProps {
    article: Article;
    navigation: NativeStackNavigationProp<any> | DrawerNavigationProp<any>;
}

export const ArticleSmallCard: React.FC<ArticleSmallCardProps> = (props) => {
    const dateCreated = new Date(props.article.createdAt ?? 0);
    
    const openArticle = () => {
        props.navigation.navigate('Shell', {screen: 'Article', params: { article: props.article } });
    }    

    const appState = useSelector((state: ApplicationState) => state);
    
    return (
        <Pressable style={styles.container} onPress={openArticle}>
            <View style={styles.titleView}>
                <Text style={ styles.title }>{ props.article.title }</Text>
                <IconButton 
                    icon="chevron-right"
                    color="#DB6551FC"
                    size={25}
                    style={{
                        position: 'absolute',
                        right: 0
                    }}
                />
            </View>
            <View style={styles.infoView}>
                <View style={styles.infoText}>
                    <IconButton 
                        icon="calendar"
                        color="#DB6551FC"
                        size={20}
                    />
                    <Text style={styles.text}>{ dateCreated.toLocaleDateString() }</Text>
                </View>
                <View style={styles.infoText}>
                    <IconButton 
                        icon="account"
                        color="#DB6551FC"
                        size={20}
                    />
                    <Text style={ [styles.text, {marginRight: 10}] }>{ `${props.article.psychologist?.firstName} ${props.article.psychologist?.lastName}` }</Text>
                </View>
            </View>
        </Pressable>
    )
}

