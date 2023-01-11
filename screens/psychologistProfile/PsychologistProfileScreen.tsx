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
import { AppointmentForm } from "../../components";
import { traduct } from "../../langs";

interface PsychologistProfileProps {
    navigation: any;
    route: any;
}

export const PsychologistProfileScreen: React.FC<PsychologistProfileProps> = (props: any) => {
    
    const appState = useSelector((state: ApplicationState) => state);

    const now = new Date();
    const yearsExperienceDate = new Date(props.route.params.psychologist?.psychologist.firstWorkDate)
    const yearsExperience = now.getFullYear() - (yearsExperienceDate.getFullYear() ?? 0);
    
    const dispatch = useDispatch();    

    const [activeTab, setActiveTab] = useState('info');
    const [appointment, setAppointmentModal] = useState(false);

    const hideAppointmentModal = () => setAppointmentModal(false);

    const openEdit = () => {        
        props.navigation.push('Shell', { screen: 'EditPsychologistProfile', params: { psychologist: props.route.params.psychologist } })
    }

    const getYear = (date: string) => {
        const toDate = new Date(date);
        return toDate.getFullYear()
    }

    return (
        <View style={{minHeight: '93%', backgroundColor: 'white'}}>
            <ScrollView style={{marginBottom: 50}}>
                <ImageBackground 
                    source={
                        require('../../assets/images/Topographic.png')
                    }
                    resizeMode='cover'
                    style={{backgroundColor: 'white', padding: 30}}
                >
                    <View style={styles.header}>
                    {
                                props.route.params.psychologist.profileImage ?
                                <Image 
                                    style={styles.profileImg}
                                    source={{uri: props.route.params.psychologist.profileImage}}
                                />
                            :
                                <IconButton
                                    icon="account-circle-outline"
                                    color="#F38673"
                                    size={150}
                                    style={{marginTop: -50, marginBottom: -30}}
                                />
                        }
                        <View style={styles.headerText}>
                            <Text style={styles.headerName}>{`${props.route.params.psychologist.firstName} ${props.route.params.psychologist.lastName}`}</Text>
                            <Text style={{paddingTop: 5}}>{traduct("psychologist")}</Text>
                        </View>
                        <View style={styles.navBar}>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'info' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('info')}
                            >
                                <Text style={styles.navItemText}>{traduct("information")}</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'ach' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('ach')}
                            >
                                <Text style={styles.navItemText}>{traduct("goals")}</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.navItem, { borderBottomWidth: activeTab == 'workP' ? 3 : 0 } ]}
                                onPress={() => setActiveTab('workP')}
                            >
                                <Text style={styles.navItemText}>{traduct("workPlaces")}</Text>
                            </Pressable>
                        </View>
                    </View>
                    {
                        activeTab == 'info' ? 
                            <View>
                                <View style={[styles.bodyView, {marginTop: 20}]}>
                                    <Text style={styles.bodyInfoHeader}>General</Text>
                                    <View style={styles.bodyGeneralInfo}>
                                        <Text style={styles.bodyGeneralInfoLeft}>{traduct("name")}</Text>
                                        <Text style={styles.bodyGeneralInfoRight}>{props.route.params.psychologist.firstName}</Text>
                                    </View>
                                    <View style={styles.bodyGeneralInfo}>
                                        <Text style={styles.bodyGeneralInfoLeft}>{traduct("lastName")}</Text>
                                        <Text style={styles.bodyGeneralInfoRight}>{props.route.params.psychologist.lastName}</Text>
                                    </View>
                                    <View style={styles.bodyGeneralInfo}>
                                        <Text style={styles.bodyGeneralInfoLeft}>{traduct("birthDate")}</Text>
                                    </View>
                                    <View style={styles.bodyGeneralInfo}>
                                        <Text style={styles.bodyGeneralInfoLeft}>{traduct("gender")}</Text>
                                        <Text style={styles.bodyGeneralInfoRight}>{props.route.params.psychologist.gender ?? '-'}</Text>
                                    </View>
                                    <View style={[styles.bodyGeneralInfo, {borderBottomWidth: 0}]}>
                                        <Text style={styles.bodyGeneralInfoLeft}>{traduct("experienceYears")}</Text>
                                        <Text style={styles.bodyGeneralInfoRight}>{String(yearsExperience) == 'NaN' ? '-' : yearsExperience}</Text>
                                    </View>
                                </View>
                                <View style={styles.bodyView}>
                                    <View style={{paddingBottom: 10}}>
                                        <Text style={styles.bodyInfoHeader}>{traduct("aditionalInformation")}</Text>
                                        <Text style={styles.bodyText}>{props.route.params.psychologist.psychologist?.about ?? '-'}</Text>
                                    </View>
                                </View>
                                {
                                    appState.auth?.user._id == props.route.params.psychologist?._id ?
                                        <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Pressable
                                                style={ styles.emergencyAction }
                                                onPress={() => { logOutAction(dispatch, props.navigation) } }
                                            >
                                                <Text style={ styles.emergencyActionText }>{traduct("logout")}</Text>
                                            </Pressable>
                                        </View>
                                    : <></>
                                }
                            </View>
                        : activeTab == 'ach' ?
                            <View style={{minHeight: 400}}>
                                <View style={[styles.bodyView, {marginTop: 20, paddingBottom: 10}]}>
                                    <Text style={styles.bodyInfoHeader}>{traduct("acknowledgments")}</Text>
                                    {
                                        props.route.params.psychologist.psychologist?.goals ?
                                            props.route.params.psychologist.psychologist?.goals.map((goal: any, index: number) => {
                                                return <Text 
                                                            style={[styles.goal, props.route.params.psychologist.psychologist?.goals.length-1 == index ? { borderBottomWidth: 0 } : {}]} 
                                                            key={index}
                                                        >
                                                            {`${goal.title} - ${getYear(goal.date)}`}
                                                        </Text>
                                            })
                                        :
                                            <Text style={styles.bodyText}>-</Text>
                                    }
                                </View>
                            </View>
                        :                             
                            <View style={{minHeight: 400}}>
                                <View style={[styles.bodyView, {marginTop: 20, paddingBottom: 10}]}>
                                    {
                                        props.route.params.psychologist.psychologist?.workPlaces ?
                                            props.route.params.psychologist.psychologist?.workPlaces.map((workPlace: any, index: number) => {
                                                return <View 
                                                            style={[styles.workPlace, props.route.params.psychologist.psychologist?.workPlaces.length-1 == index ? { borderBottomWidth: 0 } : {}]} 
                                                            key={index}
                                                        >
                                                            <Text>{workPlace.name}</Text>
                                                            <Text>{workPlace.schedule}</Text>
                                                        </View>
                                            })
                                        :
                                            <Text style={styles.bodyText}>-</Text>
                                    }                                
                                </View>
                            </View>
                    }

                </ImageBackground>
            </ScrollView>
            {
                appState.auth?.user._id == props.route.params.psychologist?._id ?
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
            {
                appState.auth?.user?.hasOwnProperty('patient') ?
                    <Pressable
                        style={ styles.scheduleAction }
                        onPress={() => { setAppointmentModal(true) } }
                    >
                        <Text style={ styles.scheduleActionText }>{traduct("scheduleAppointment")}</Text>
                    </Pressable>
                :
                    <></>
            }
            <AppointmentForm 
                visible={appointment} 
                hide={hideAppointmentModal} 
                psychologistId={props.route.params.psychologist?._id}
            />
        </View>
    )
}