import React, { useEffect, useState } from "react"
import { Pressable, View, Image, Text, ImageBackground } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { FAB, IconButton, Provider, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { CreateArticle } from "../../components/createArticle/CreateArticle";
import { styles } from './style';
import { ArticleSmallCard } from "../../components/articleSmallCard/ArticleSmallCard";
import { getArticlesAction } from "../../store/actions/articleActions";
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import { getEmergencyPsychologistsAction, getPsychologistsAction } from "../../store/actions/authActions";
import { User } from "../../models";
import { traduct } from "../../langs";

interface EmergencyPsychologistProps {
    navigation: any;
}

export const EmergencyPsychologistScreen: React.FC<EmergencyPsychologistProps> = ({ navigation }) => {
    const appState = useSelector((state: ApplicationState) => state);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [psychologists, setPsychologists] = useState<User[] | undefined>([]);
    const [searchPsychologists, setSearchPsychologists] = useState('');

    const goToPsy = (psychologist: User) => {
        navigation.push('Shell', { screen: 'PsychologistProfile', params: { psychologist: psychologist } })
    }

    useEffect(() => {
        if(isFocused) getEmergencyPsychologistsAction(dispatch);
    }, [isFocused]);

    useEffect(() => {
        setPsychologists(appState.auth?.emergencyPsychologists)
    }, [appState.auth?.emergencyPsychologists]);

    useEffect(() => {
        if(searchPsychologists)
            setPsychologists(
                appState.auth?.emergencyPsychologists.filter((psy) => `${psy.firstName} ${psy.lastName}`.toLocaleLowerCase().includes(searchPsychologists.toLocaleLowerCase()))
            )
        else setPsychologists(appState.auth?.emergencyPsychologists)
    }, [searchPsychologists]);

    return (
        <ImageBackground 
            source={
                require('../../assets/images/Topographic.png')
            }
            resizeMode='cover'
            style={styles.view}
        >
            <View>
                <TextInput 
                    value={ searchPsychologists }
                    onChangeText={ (text) => setSearchPsychologists(text) }
                    style={ styles.textInput } 
                    mode="outlined"
                    outlineColor="#DB6551"
                    activeOutlineColor="#DB6551"
                    theme={{roundness: 30}}
                    label={traduct("search")}
                />
                <ScrollView>
                    {
                        psychologists ? psychologists.map((psychologist) => {
                            return <Pressable 
                                        key={psychologist._id} 
                                        style={styles.psyView}
                                        onPress={() => goToPsy(psychologist)}
                                    >
                                    <View style={styles.psyInfoView}>
                                        {
                                            
                                            psychologist.profileImage ?
                                                <View style={{padding: 15}}>
                                                    <Image 
                                                        style={styles.profileImg}
                                                        source={{uri: psychologist.profileImage}}
                                                    />
                                                </View>
                                            :
                                                <IconButton
                                                    icon="account-circle-outline"
                                                    color="#F38673"
                                                    size={50}
                                                />
                                        }
                                        <View>
                                            <Text style={styles.psyName}>{`${psychologist.firstName} ${psychologist.lastName}`}</Text>
                                            <Text>{traduct("sendMessage")}...</Text>
                                        </View>
                                    </View>
                                    <IconButton 
                                        icon="chat-processing"
                                        size={30}
                                        color="#F38673"
                                    />
                                </Pressable>
                        })
                        : <></>
                    }
                </ScrollView>
            </View>
        </ImageBackground>
    )
}