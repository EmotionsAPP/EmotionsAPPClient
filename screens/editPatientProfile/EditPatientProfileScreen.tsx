import React, { useEffect, useState } from "react"
import { View, ImageBackground, Text, Pressable, Image, ActivityIndicator } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './style';
import { FAB, IconButton, Portal, TextInput, Modal } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import RNFS from 'react-native-fs';
import ImagePicker from "react-native-image-crop-picker";
import { editProfileAction, getCitiesAction } from "../../store/actions/profileActions";
import { User } from "../../models";

interface EditPatientProfileProps {
    navigation: any;
    route: any;
}

export const EditPatientProfileScreen: React.FC<EditPatientProfileProps> = (props: any) => {
    
    const appState = useSelector((state: ApplicationState) => state);
    
    const now = new Date();
    const birthday = new Date(props.route.params.patient?.birthDate)
    const age = now.getFullYear() - (birthday.getFullYear() ?? 0);
    const dispatch = useDispatch();
    
    const [showGenderDropdown, setGenderDropdown] = useState(false);
    const [showCityDropdown, setCityDropdown] = useState(false);
    const [showBirthDateModal, setBirthDateModal] = useState(false);
    const [citiesValues, setCitiesValues] = useState<any>([]);

    const user = props.route.params.patient;
    
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        birthDate: birthday,
        city: user.city?._id,
        information: user.patient?.information,
        profileImage: user.profileImage
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
        const patient = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            profileImage: formData.profileImage,
            gender: formData.gender,
            birthDate: formData.birthDate,
            role: user.role, 
            city: appState.profile?.cities.find((city) => city._id == formData.city),
            patient: {
                information: formData.information
            }
        }

        editProfileAction(patient, false, dispatch, userEdited, user._id)
    }

    const userEdited = (user: User) => {
        props.navigation.pop();
        props.navigation.pop();      
        props.navigation.push('Shell', { screen: 'PatientProfile', params: { patient: user} })
    }

    useEffect(() => {
        getCitiesAction(dispatch);
    }, [])

    useEffect(() => {
        setCitiesValues(
            appState.profile?.cities.map((city) => {
                return {
                    label: city.name,
                    value: city._id
                }
            })
        )
    }, [appState.profile?.cities])


    return (
        <View>
            <ImageBackground 
                source={
                    require('../../assets/images/Topographic.png')
                }
                resizeMode='cover'
                style={{backgroundColor: 'white', padding: 30, height: '100%'}}
            >
                <ScrollView>
                    <Pressable 
                        style={styles.header}
                        onPress={() => onAddImage()}
                    >
                        <View>
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
                        </View>
                    </Pressable>
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
                                formData.birthDate.toString() != 'Invalid Date' ? <Text style={styles.customInputText}> Fecha de nacimiento </Text>
                                : <></>
                            }
                            <Pressable 
                                style={styles.customInputPressable}
                                onPress={() => setBirthDateModal(true)}
                            >
                                <Text style={{paddingLeft: 10}}>
                                    {
                                        formData.birthDate.toString() != 'Invalid Date' ? 
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
                                date={formData.birthDate.toString() == 'Invalid Date' ? new Date() : formData.birthDate}
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
                        <View style={styles.dropInput}>
                            {
                                formData.city ? <Text style={styles.customInputText}> Ciudad </Text>
                                : <></>
                            }
                            <DropDownPicker
                                open={showCityDropdown}
                                value={formData.city}
                                items={citiesValues}
                                setOpen={setCityDropdown}
                                setValue={(val: any) => setFormData({ ...formData, city: val()})}
                                disableBorderRadius={true}
                                style={styles.dropdown}
                                containerStyle={styles.dropdownContainer}
                                placeholder="Ciudad"
                                searchable={true}
                                listMode="MODAL"
                            />
                        </View>
                        <TextInput 
                            value={ formData.information }
                            onChangeText={ (text) => setFormData({ ...formData, information: text}) }
                            style={ [styles.textInput, {height: undefined} ]} 
                            mode="outlined"
                            outlineColor="#DB6551"
                            activeOutlineColor="#DB6551"
                            theme={{roundness: 30}}
                            label="Informacion"
                            multiline={true}
                        />
                    </View>
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