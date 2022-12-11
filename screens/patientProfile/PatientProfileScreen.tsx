import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { FAB, IconButton, TextInput } from "react-native-paper";
import { logOutAction } from "../../store/actions/authActions";
import { editPatientNoteAction, getPatientNoteAction } from "../../store/actions/profileActions";

interface PatientProfileProps {
    navigation: any;
    route: any;
}

export const PatientProfileScreen: React.FC<PatientProfileProps> = (props: any) => {
    
    const appState = useSelector((state: ApplicationState) => state);

    const birthday = new Date(props.route.params.patient?.birthDate);

    const dispatch = useDispatch();

    const [editingNotes, setEditingNotes] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const editNote = () => {
        const note = {
            note: noteContent,
            psychologist: appState.profile?.note.psychologist,
            patient: appState.profile?.note.patient
        }
        editPatientNoteAction(note, dispatch, noteEdited, appState.profile?.note._id)
    }

    const noteEdited = () => {
        setEditingNotes(false);        
    }

    const openEdit = () => {
        props.navigation.push('Shell', { screen: 'EditPatientProfile', params: { patient: props.route.params.patient } })
    }

    useEffect(() => {
        if(appState.auth?.user?.hasOwnProperty('psychologist')) {
            getPatientNoteAction(dispatch, props.route.params.patient?._id, appState.auth?.user?._id)
        }        
    }, [])

    useEffect(() => {
        setNoteContent(appState.profile?.note.note ?? '');
    }, [appState.profile?.note])

    return (
        <View>
            <ScrollView>
                <ImageBackground 
                    source={
                        require('../../assets/images/Topographic.png')
                    }
                    resizeMode='cover'
                    style={{backgroundColor: 'white', padding: 30}}
                >
                    <View style={styles.header}>
                        {
                                props.route.params.patient.profileImage ?
                                <Image 
                                    style={styles.profileImg}
                                    source={{uri: props.route.params.patient.profileImage}}
                                />
                            :
                                <IconButton
                                    icon="account-circle-outline"
                                    color="#F38673"
                                    size={150}
                                    style={{marginTop: -50, marginBottom: -25}}
                                />
                        }
                        <View style={styles.headerText}>
                            <Text style={styles.headerName}>{`${props.route.params.patient.firstName} ${props.route.params.patient.lastName}`}</Text>
                            <Text style={styles.headerInfo}>{props.route.params.patient.city ? props.route.params.patient.city.name : '-'}</Text>
                        </View>
                    </View>
                    <View style={[styles.bodyView, {marginTop: 20}]}>
                        <Text style={styles.bodyInfoHeader}>General</Text>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Nombre</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{props.route.params.patient.firstName}</Text>
                        </View>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Apellido</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{props.route.params.patient.lastName}</Text>
                        </View>
                        <View style={styles.bodyGeneralInfo}>
                            <Text style={styles.bodyGeneralInfoLeft}>Fecha de nacimiento</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{birthday ? birthday.toLocaleDateString() : '-' }</Text>
                        </View>
                        <View style={[styles.bodyGeneralInfo, {borderBottomWidth: 0}]}>
                            <Text style={styles.bodyGeneralInfoLeft}>Género</Text>
                            <Text style={styles.bodyGeneralInfoRight}>{
                            props.route.params.patient.gender ? 
                            props.route.params.patient.gender == 'M' ? "Masculino" 
                            : props.route.params.patient.gender == 'F' ?  "Femenino" 
                            : props.route.params.patient.gender == 'O' ?  "Otro"
                            : '-' : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.bodyView}>
                        <View style={{paddingBottom: 10}}>
                            <Text style={styles.bodyInfoHeader}>Información</Text>
                            <Text style={styles.bodyText}>{props.route.params.patient.patient?.information ?? '-'}</Text>
                        </View>
                    </View>
                    {
                        appState.auth?.user?.hasOwnProperty('psychologist') ? 
                            <View style={styles.bodyView}>
                                <View style={{paddingBottom: 10}}>
                                    <View style={styles.notesHeaderView}>
                                        <Text style={styles.bodyInfoHeader}>Notas</Text>
                                        {
                                            appState.profile?.loadingNote || appState.profile?.savingNote ?
                                                <></>
                                            :
                                                <IconButton
                                                    icon={editingNotes ? 'check' : 'pencil'}
                                                    color="white"
                                                    size={15}
                                                    style={{backgroundColor: '#F38673', marginTop: -10}}
                                                    onPress={ editingNotes ? () => editNote() : () => setEditingNotes(!editingNotes) }
                                                />
                                        }
                                    </View>
                                    {
                                        editingNotes ? 
                                            <TextInput 
                                                value={ noteContent }
                                                onChangeText={ (text) => setNoteContent(text) }
                                                style={ styles.textInput } 
                                                mode="outlined"
                                                outlineColor="#DB6551"
                                                activeOutlineColor="#DB6551"
                                                theme={{roundness: 15}}
                                                multiline={true}
                                            />
                                        :
                                            <Text style={styles.bodyText}>{noteContent ?? '-'}</Text>
                                    }
                                </View>
                            </View>
                        : <></>
                    }
                    {
                        appState.auth?.user._id == props.route.params.patient?._id ?
                            <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Pressable
                                    style={ styles.emergencyAction }
                                    onPress={() => { logOutAction(dispatch, props.navigation) } }
                                >
                                    <Text style={ styles.emergencyActionText }>Cerrar sesión</Text>
                                </Pressable>
                            </View>
                        : <></>
                    }

                </ImageBackground>
            </ScrollView>
        {
            appState.auth?.user._id == props.route.params.patient?._id ?
                <FAB 
                    icon="pencil"
                    style={ styles.fab }
                    visible={true}
                    color="white"
                    onPress={() => openEdit()} 
                />
            : 
            <></>
        }
        </View>
    )
}