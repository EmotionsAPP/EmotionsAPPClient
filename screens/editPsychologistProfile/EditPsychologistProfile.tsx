import React, { useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image, ActivityIndicator } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { FAB, IconButton, Portal, TextInput, Modal } from "react-native-paper";
import { logOutAction } from "../../store/actions/authActions";
import { editPatientNoteAction, editProfileAction, getPatientNoteAction } from "../../store/actions/profileActions";
import RNFS from 'react-native-fs';
import ImagePicker from "react-native-image-crop-picker";
import { User } from "../../models";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import { NavigationActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';

interface EditPsychologistProfileProps {
    navigation: any;
    route: any;
}

export const EditPsychologistProfileScreen: React.FC<EditPsychologistProfileProps> = (props: any) => {
    
    const appState = useSelector((state: ApplicationState) => state);

    const now = new Date();
    const yearsExperienceDate = new Date(props.route.params.psychologist?.psychologist.firstWorkDate)
    const yearsExperience = now.getFullYear() - (yearsExperienceDate.getFullYear() ?? 0);
    
    const birthday = new Date(props.route.params.patient?.birthDate)

    const dispatch = useDispatch();

    const [showGenderDropdown, setGenderDropdown] = useState(false);
    const [showBirthDateModal, setBirthDateModal] = useState(false);
    const [showYearExperienceModal, setYearExperienceModal] = useState(false);
    const showGoalModal = useRef<boolean[]>([]);
    const [rerender, setRerender] = useState(false); 

    const [activeTab, setActiveTab] = useState('info');

    const user = props.route.params.psychologist;

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        birthDate: birthday,
        about: user.psychologist.about,
        profileImage: user.profileImage,
        firstWorkDate: yearsExperienceDate,
        goals: user.psychologist.goals ?? [],
        workPlaces: user.psychologist.workPlaces ?? [],
    });    

    const onAddImage = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
        }).then((image) => {
            add(image)
        }).catch((err) => {
            console.log(err);  
        })

        const add = (image: any) => {
            RNFS.readFile(image.path, 'base64')
            .then(base64String =>{
                const str = `data:${image.mime};base64,${base64String}`
                setFormData({
                    ...formData,
                    profileImage: str
                })
            })
            .catch((err) => {
                console.log("base64:Image:", err)
            })
        };
    }

    const editUser = () => {
        const psychologist = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            profileImage: formData.profileImage,
            gender: formData.gender,
            birthDate: formData.birthDate,
            role: user.role, 
            psychologist: {
                firstWorkDate: formData.firstWorkDate,
                about: formData.about,
                goals: formData.goals,
                workPlaces: formData.workPlaces,
            }
        }

        editProfileAction(psychologist, true, dispatch, userEdited, user._id)
    }

    const addEmptyGoal = () => {
        formData.goals.push({
            date: new Date(),
            title: '',
        });
        setFormData({
            ...formData,
            goals: formData.goals
        })        
        showGoalModal.current = formData.goals.map(() => false)
    }

    const addEmptyWorkPlace = () => {
        formData.workPlaces.push({
            name: '',
            schedule: '',
        });
        setFormData({
            ...formData,
            workPlaces: formData.workPlaces
        })        
    }

    const openGoalDate = (index: number) => {
        showGoalModal.current = showGoalModal.current.map((v, i) => i == index ? true : false)
        setRerender(!rerender);     
    }

    const closeGoalDate = (index: number) => {
        showGoalModal.current = showGoalModal.current.map((v, i) => false)
        setRerender(!rerender);     
    }

    const userEdited = (user: User) => {   
        props.navigation.pop();
        props.navigation.pop();
        props.navigation.push('Shell', { screen: 'PsychologistProfile', params: { psychologist: user} })
    }

    const getDate = (date: string | Date) => {
        return new Date(date);
    }

    useEffect(() => {
        showGoalModal.current = formData.goals.map(() => false)       
    }, formData.goals)

    return (
        <View style={{minHeight: '93%', backgroundColor: 'white'}}>
            <ImageBackground 
                source={
                    require('../../assets/images/Topographic.png')
                }
                resizeMode='cover'
                style={{backgroundColor: 'white', padding: 30}}
            >
                <ScrollView>
                    <View style={styles.header}>
                        <Pressable style={ formData.profileImage ? {} : { marginVertical: -20}} onPress={() => onAddImage()}>
                            {
                                formData.profileImage ?
                                    <Image 
                                        style={styles.profileImg}
                                        source={{uri: formData.profileImage}}
                                    />
                                :
                                    <IconButton
                                        icon="account-circle-outline"
                                        color="#F38673"
                                        size={150}
                                        style={{marginTop: -30}}
                                    />
                            }
                            <IconButton
                                icon="camera"
                                color="white"
                                size={30}
                                style={formData.profileImage ? styles.cameraIconImg : styles.cameraIcon}
                            />
                        </Pressable>
                        <View style={styles.navBar}>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'info' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('info')}
                            >
                                <Text style={styles.navItemText}>Informacion</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'ach' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('ach')}
                            >
                                <Text style={styles.navItemText}>Logros</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'workP' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('workP')}
                            >
                                <Text style={styles.navItemText}>Lugares de Trabajo</Text>
                            </Pressable>
                        </View>
                    </View>
                    {
                        activeTab == 'info' ? 
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                        <TextInput 
                            value={ formData.firstName }
                            onChangeText={ (text) => setFormData({ ...formData, firstName: text}) }
                            style={ styles.textInput } 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            label="Nombre"
                        />
                        <TextInput 
                            value={ formData.lastName }
                            onChangeText={ (text) => setFormData({ ...formData, lastName: text}) }
                            style={ styles.textInput } 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            label="Apellido"
                        />
                        <TextInput 
                            value={ formData.email }
                            onChangeText={ (text) => setFormData({ ...formData, email: text}) }
                            style={ styles.textInput } 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            label="Correo electrónico"
                        />
                        <View style={styles.dropInput}>
                            {
                                formData.gender ? <Text style={styles.customInputText}> Genero </Text>
                                : <></>
                            }
                            <DropDownPicker
                                open={showGenderDropdown}
                                value={formData.gender}
                                items={
                                    [
                                        {
                                            label: 'Masculino',
                                            value: 'M'
                                        },
                                        {
                                            label: 'Femenino',
                                            value: 'F'
                                        },
                                        {
                                            label: 'Otro',
                                            value: 'O'
                                        }
                                    ]
                                }
                                setOpen={setGenderDropdown}
                                setValue={(val: any) => setFormData({...formData, gender: val()})}
                                disableBorderRadius={true}
                                style={styles.dropdown}
                                containerStyle={styles.dropdownContainer}
                                placeholder="Genero"
                                listMode="MODAL"
                            />
                        </View>
                        <View style={styles.customInput}>
                            {
                                formData.birthDate.toString() !== 'Invalid Date' ? <Text style={styles.customInputText}> Fecha de nacimiento </Text>
                                : <></>
                            }
                            <Pressable 
                                style={styles.customInputPressable}
                                onPress={() => setBirthDateModal(true)}
                            >
                                <Text style={{paddingLeft: 10}}>
                                    {
                                        formData.birthDate.toString() !== 'Invalid Date' ? 
                                        formData.birthDate.toLocaleDateString()
                                        : 'Fecha de nacimiento'
                                    }
                                </Text>
                                <IconButton
                                    icon="calendar-blank"
                                    color="black"
                                    size={15}
                                />
                            </Pressable>
                            <DatePicker
                                modal
                                mode="date"
                                date={formData.birthDate.toString() !== 'Invalid Date' ? formData.birthDate : new Date()}
                                open={showBirthDateModal}
                                onConfirm={(date) => {
                                    setFormData({
                                        ...formData,
                                        birthDate: date
                                    })
                                    setBirthDateModal(false)
                                }}
                                onCancel={() => setBirthDateModal(false)}
                            />
                        </View>
                        <View style={styles.customInput}>
                            {
                                formData.firstWorkDate.toString() !== 'Invalid Date'  ? <Text style={styles.customInputText}> Fecha en que inicio a ejercer </Text>
                                : <></>
                            }
                            <Pressable 
                                style={styles.customInputPressable}
                                onPress={() => setYearExperienceModal(true)}
                            >
                                <Text style={{paddingLeft: 10}}>
                                    {
                                        formData.firstWorkDate.toString() !== 'Invalid Date' ? 
                                        formData.firstWorkDate.toLocaleDateString()
                                        : 'Fecha en que inicio a ejercer'
                                    }
                                </Text>
                                <IconButton
                                    icon="calendar-blank"
                                    color="black"
                                    size={15}
                                />
                            </Pressable>
                            <DatePicker
                                modal
                                mode="date"
                                date={formData.firstWorkDate.toString() !== 'Invalid Date' ? formData.firstWorkDate : new Date()}
                                open={showYearExperienceModal}
                                onConfirm={(date) => {
                                    setFormData({
                                        ...formData,
                                        firstWorkDate: date
                                    })
                                    setYearExperienceModal(false)
                                }}
                                onCancel={() => setYearExperienceModal(false)}
                            />
                        </View>
                        <TextInput 
                            value={ formData.about }
                            onChangeText={ (text) => setFormData({ ...formData, about: text}) }
                            style={ [styles.textInput, {height: undefined} ]} 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            label="Informacion adicional"
                            multiline={true}
                        />
                    </View>
                        : activeTab == 'ach' ?
                            <View style={{display: 'flex', flexDirection: 'column'}}>
                                {
                                    formData.goals.map((goal: any, index: number) => {
                                    return <View style={[styles.bodyView, {marginTop: 20, paddingBottom: 10}]} key={index}> 
                                            <View style={styles.customInput}>
                                                {
                                                    goal.date  ? <Text style={styles.customInputText}> Fecha obtenido </Text>
                                                    : <></>
                                                }                                               
                                                <Pressable 
                                                    style={styles.customInputPressable}
                                                    onPress={() => openGoalDate(index)}
                                                >
                                                    <Text style={{paddingLeft: 10}}>
                                                        {
                                                            goal.date ? 
                                                            getDate(goal.date).toLocaleDateString()
                                                            : 'Fecha obtenido'
                                                        }
                                                    </Text>
                                                    <IconButton
                                                        icon="calendar-blank"
                                                        color="black"
                                                        size={15}
                                                    />
                                                </Pressable>
                                                <DatePicker
                                                    modal
                                                    mode="date"
                                                    date={goal.date ? getDate(goal.date) : new Date()}
                                                    open={showGoalModal.current[index]}
                                                    onConfirm={(date) => {
                                                        goal.date = date;
                                                        closeGoalDate(index)
                                                    }}
                                                    onCancel={() => {
                                                        closeGoalDate(index)
                                                    }}
                                                />
                                            </View>
                                            <TextInput 
                                                value={ goal.title }
                                                onChangeText={ (text) => {
                                                    goal.title = text
                                                    setFormData({
                                                        ...formData,
                                                        goals: formData.goals
                                                    })
                                                } }
                                                style={ styles.textInput } 
                                                mode="outlined"
                                                outlineColor="#DB6551"
                                                activeOutlineColor="#DB6551"
                                                theme={{roundness: 30}}
                                                label="Titulo"
                                            />
                                            <Pressable style={ {display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%'} } 
                                                onPress={() => {
                                                    formData.goals.splice(index, 1)
                                                    setFormData({
                                                        ...formData,
                                                        goals: formData.goals
                                                    })
                                                    showGoalModal.current = formData.goals.map(() => false)
                                                }}
                                            >
                                                <IconButton 
                                                    icon="delete"
                                                    color="#DD0A35"
                                                    size={22}
                                                />
                                                <Text style={{fontWeight: 'bold', fontSize: 13}}>Borrar Logro</Text>
                                            </Pressable>
                                        </View>
                                    })
                                }
                                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Pressable
                                        style={ styles.emergencyAction }
                                        onPress={() => addEmptyGoal() }
                                    >
                                        <IconButton 
                                            icon="plus"
                                            color="white"
                                        />
                                        <Text style={ styles.emergencyActionText }>Agregar Logro</Text>
                                    </Pressable>
                                </View>
                            </View>
                        :                             
                            <View style={{display: 'flex', flexDirection: 'column'}}>
                                {
                                    formData.workPlaces.map((workPlace: any, index: number) => {
                                    return <View style={[styles.bodyView, {marginTop: 20, paddingBottom: 10}]} key={index}> 
                                            <TextInput 
                                                value={ workPlace.name }
                                                onChangeText={ (text) => {
                                                    workPlace.name = text
                                                    setFormData({
                                                        ...formData,
                                                        workPlaces: formData.workPlaces
                                                    })
                                                } }
                                                style={ styles.textInput } 
                                                mode="outlined"
                                                outlineColor="#DB6551"
                                                activeOutlineColor="#DB6551"
                                                theme={{roundness: 30}}
                                                label="Nombre del lugar"
                                            />
                                            <TextInput 
                                                value={ workPlace.schedule }
                                                onChangeText={ (text) => {
                                                    workPlace.schedule = text
                                                    setFormData({
                                                        ...formData,
                                                        workPlaces: formData.workPlaces
                                                    })
                                                } }
                                                style={ styles.textInput } 
                                                mode="outlined"
                                                outlineColor="#DB6551"
                                                activeOutlineColor="#DB6551"
                                                theme={{roundness: 30}}
                                                label="Horario de Trabajo"
                                            />
                                            <Pressable style={ {display: 'flex', flexDirection: 'row', alignItems: 'center'} } 
                                                onPress={() => {
                                                    formData.workPlaces.splice(index, 1)
                                                    setFormData({
                                                        ...formData,
                                                        workPlaces: formData.workPlaces
                                                    })
                                                }}
                                            >
                                                <IconButton 
                                                    icon="delete"
                                                    color="#DD0A35"
                                                    size={22}
                                                />
                                                <Text style={{fontWeight: 'bold', fontSize: 13}}>Borrar Lugar de Trabajo</Text>
                                            </Pressable>
                                        </View>
                                    })
                                }
                                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Pressable
                                        style={ styles.emergencyAction }
                                        onPress={() => addEmptyWorkPlace() }
                                    >
                                        <IconButton 
                                            icon="plus"
                                            color="white"
                                        />
                                        <Text style={ styles.emergencyActionText }>Agregar</Text>
                                    </Pressable>
                                </View>
                            </View>
                    }
                </ScrollView>
            </ImageBackground>
            <FAB 
                icon="check"
                style={ styles.fab }
                visible={true}
                color="white"
                onPress={() => editUser()} 
            />
            <Portal>
                <Modal 
                    visible={ (appState.profile?.savingUser) as boolean}
                    dismissable={false}
                    style={styles.waitingModal}
                    contentContainerStyle={styles.waitingModalContainer}
                >
                    <View style={styles.waitingModalView}>
                        <ActivityIndicator size="small" color="#DB6551" />
                        <Text style={styles.waitingModalText}>Guardando...</Text>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}