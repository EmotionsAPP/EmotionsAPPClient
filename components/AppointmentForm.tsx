import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View, TextInput } from "react-native";
import DatePicker from "react-native-date-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, IconButton, Modal, Portal, Provider, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../store";
import { availablePhysiciansAction, newAppointmentAction } from "../store/actions/appointmentActions";

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
            participants: [appState.auth?.user ?? '', physician],
            start: formData.startTime?.toUTCString() ?? '',
            end: formData.endTime?.toUTCString() ?? '',
            description: formData.description
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
                                    `${formData.startTime.toDateString()} ${formData.startTime.getHours()}:${formData.startTime.getMinutes()}`
                                ) : '-' }
                            </Text>
                            <DatePicker
                                modal
                                date={new Date()}
                                open={timePickerStart}
                                onConfirm={(date) => {
                                    setFormData({
                                        ...formData,
                                        startTime: date
                                    })
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
                                    `${formData.endTime.toDateString()} ${formData.endTime.getHours()}:${formData.endTime.getMinutes()}`
                                ) : '-' }
                            </Text>
                            <DatePicker
                                modal
                                date={new Date()}
                                open={timePickerEnd}
                                onConfirm={(date) => {
                                    setFormData({
                                        ...formData,
                                        endTime: date
                                    })
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

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 30
    },
    headerButtons: {
        marginHorizontal: 0,
        marginVertical: 0,
        textTransform: 'none',
        fontWeight: 'bold'
    },
    modal: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0, 
        right: 0,
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    dropdown: {
        borderWidth: 0,
        height: 5
    },
    dropdownContainer: {
        width: '78%'
    },
    view: {
        paddingLeft: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    pressView: {
        paddingLeft: 45,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        position: 'absolute',
        left: 0,
        top: 2,
        color: '#db6551'
    },
    divider: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#db6551',
        marginBottom: 20
    },
    input: {
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0,
        width: '72%',
        marginLeft: 10,
        height: 20
    }
})