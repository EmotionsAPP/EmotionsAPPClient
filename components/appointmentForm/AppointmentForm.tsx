import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View, TextInput } from "react-native";
import DatePicker from "react-native-date-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, IconButton, Modal, Portal, Provider, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { availablePhysiciansAction, newAppointmentAction } from "../../store/actions/appointmentActions";
import { openNotificationSnackbar } from "../../store/actions/inAppActions";
import { styles } from './style';

interface AppointmentFormProps {
    visible: boolean;
    hide: () => void;
}

interface FormData {
    startTime: Date | undefined;
    endTime: Date | undefined;
    description: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = (props) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const [formData, setFormData] = useState<FormData>({
        startTime: undefined,
        endTime: undefined,
        description: ''
    })

    const [timePickerStart, visibleTimePickerStart] = useState(false); 
    const [timePickerEnd, visibleTimePickerEnd] = useState(false); 
    const [showDropdown, visibleDropdown] = useState(false); 
    const [dropdownItems, setItems] = useState<{ label: string; value: string; }[] | undefined>([]);
    const [physician, setPhysician] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if(formData.startTime && formData.endTime && !appState.appointment?.loadingPhysicians){
            availablePhysiciansAction(new Date(`${formData.startTime.toLocaleDateString('en-US')} ${formData.startTime}`), dispatch, appState);
        }
    }, [formData]);
    
    useEffect(() => {
        setItems(appState.appointment?.availablePhysicians
            .map((physician) => {
                return {
                    label: `${physician.firstName} ${physician.lastName}`,
                    value: physician._id
                }
            })
        );
    }, [appState.appointment?.availablePhysicians])

    const setStartTime = (date: Date) => {
        if(formData.endTime && 
            (
                (formData.endTime.getTime() < date.getTime()) || 
                (Math.abs(Math.round((formData.endTime.getTime() - date.getTime()) / 60000)) < 15) ||
                (Math.abs(Math.round((formData.endTime.getTime() - date.getTime()) / 60000)) > 120 )
            )
        ){
            openNotificationSnackbar("basic", dispatch, "error", "La hora de inicio debe ser menor a la de final, tener un minimo de 15 minutos de diferencia y no mayor a 2 horas.")
            return;
        }
        setFormData({
            ...formData,
            startTime: date
        })
    }

    const setEndTime = (date: Date) => {
        if(formData.startTime && 
            (
                (formData.startTime.getTime() > date.getTime()) || 
                (Math.abs(Math.round((formData.startTime.getTime() - date.getTime()) / 60000)) < 15) ||
                (Math.abs(Math.round((formData.startTime.getTime() - date.getTime()) / 60000)) > 120 )
            )
        ){
            openNotificationSnackbar("basic", dispatch, "error", "La hora de inicio debe ser menor a la de final, tener un minimo de 15 minutos de diferencia y no mayor a 2 horas.")
            return;
        }
        setFormData({
            ...formData,
            endTime: date
        })
    }

    const closeModal = () => {
        setFormData({
            startTime: undefined,
            endTime: undefined,
            description: ''
        });
        setPhysician('');
        props.hide()
    }

    const saveAppointment = () => {
        const appointment = {
            patient: appState.auth?.user._id,
            psychologist: physician,
            start: formData.startTime?.toUTCString() ?? '',
            end: formData.endTime?.toUTCString() ?? '',
            description: formData.description,
            status: 'Scheduled'
        }
        newAppointmentAction(appointment, dispatch, closeModal);
    }

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
                        <Text>Nueva reunion</Text>
                        <Button 
                            mode="text" 
                            color="#000" 
                            labelStyle={styles.headerButtons}
                            disabled={physician ? false : true}
                            onPress={saveAppointment}
                        >
                            Completar
                        </Button>
                    </View>
                    <View style={styles.divider}>
                        <IconButton 
                            style={styles.icon} 
                            icon="clock" 
                            color="#db6551"
                        />
                        <Pressable 
                            style={[styles.pressView, { paddingBottom: 20 }]} 
                            onPress={() => visibleTimePickerStart(true)}
                        >
                            <Text>Inicio</Text>
                            <Text>
                                { formData.startTime ? (
                                    `${formData.startTime.toDateString()} ${String(((formData.startTime.getHours() % 12) || 12)).padStart(2,'0')}:${String(formData.startTime.getMinutes()).padStart(2,'0')} ${formData.startTime.getHours() > 12 ? 'PM' : 'AM'}`
                                ) : '-' }
                            </Text>
                            <DatePicker
                                modal
                                date={new Date()}
                                open={timePickerStart}
                                onConfirm={(date) => {
                                    setStartTime(date);
                                    visibleTimePickerStart(false);
                                }}
                                onCancel={() => {
                                    visibleTimePickerStart(false);
                                }}
                            />
                        </Pressable>
                        <Pressable 
                            style={styles.pressView} 
                            onPress={() => visibleTimePickerEnd(true)}
                        >
                            <Text>Termina</Text>
                            <Text>
                                { formData.endTime ? (
                                    `${formData.endTime.toDateString()} ${String(((formData.endTime.getHours() % 12) || 12)).padStart(2,'0')}:${String(formData.endTime.getMinutes()).padStart(2,'0')} ${formData.endTime.getHours() > 12 ? 'PM' : 'AM'}`
                                ) : '-' }
                            </Text>
                            <DatePicker
                                modal
                                date={new Date()}
                                open={timePickerEnd}
                                onConfirm={(date) => {
                                    setEndTime(date);
                                    visibleTimePickerEnd(false);
                                }}
                                onCancel={() => {
                                    visibleTimePickerEnd(false);
                                }}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.divider}>
                        <IconButton 
                            style={styles.icon} 
                            icon="doctor" 
                            color="#db6551"
                        />
                        <View style={styles.view}>
                            <Text>Especialista</Text>
                            <DropDownPicker
                                open={showDropdown}
                                value={physician}
                                items={dropdownItems ?? []}
                                setOpen={visibleDropdown}
                                setValue={setPhysician}
                                disableBorderRadius={true}
                                style={styles.dropdown}
                                containerStyle={styles.dropdownContainer}
                                placeholder=""
                            />
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <IconButton 
                            style={styles.icon} 
                            icon="text" 
                            color="#db6551"
                        />
                        <View style={styles.view}>
                            <Text>Descripcion</Text>
                            <TextInput 
                                value={ formData.description }
                                onChangeText={ (text) => setFormData({ ...formData, description: text }) }
                                placeholder=""
                                style={styles.input}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </Portal>
    )
}

