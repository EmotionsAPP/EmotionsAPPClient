import React, { useEffect } from "react"
import { Text, View, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { ShellNavigatorParamList } from "../../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { lastContactedUsersAction, userAppointmentsAction } from "../../store/actions/appointmentActions";
import { AppointmentSmallCard } from "../../components/appointmentSmallCard/AppointmentSmallCard";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";

interface MessageBubbleProps {

}

export const MessageBubble: React.FC<MessageBubbleProps> = (props: any) => {
    const date = new Date(props.currentMessage.createdAt);
    const previousDate = new Date(props.previousMessage.createdAt ?? 0);

    return (
        <View style={props.currentMessage.user._id != 2 ? [styles.myView, {width: '100%'}] : [styles.otherView, {width: '100%'}]}>
            {
                ((props.previousMessage?.user?._id == props.currentMessage.user._id)
                    &&
                (Math.abs(Math.round((previousDate.getTime() - date.getTime()) / 60000)) < 1))
                ? <></>
                : <Text style={styles.hourText}>{`${String(((date.getHours() % 12) || 12)).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')} ${date.getHours() > 12 ? 'PM' : 'AM'}`}</Text>
            }
            <View style={props.currentMessage.user._id == 2 ? styles.otherUserBubble : styles.myBubble}>
                <Text style={props.currentMessage.user._id == 2 ? {fontSize: 12} : {fontSize: 12, color: 'white'}}>{props.currentMessage.text}</Text>
            </View>
        </View>
    )

 }

 const styles = StyleSheet.create({
    otherUserBubble: {
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        padding: 15,
        maxWidth: '85%'
    },
    hourText: {
        fontWeight: "400",
        fontSize: 11,
        paddingBottom: 5,
        paddingTop: 10
    },
    myBubble: {
        borderRadius: 10,
        backgroundColor: '#DB6551',
        padding: 15,
        maxWidth: '85%',
    },
    myView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    otherView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }
})