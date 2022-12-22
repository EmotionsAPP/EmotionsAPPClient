import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { ShellNavigatorParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import {
  Avatar,
  Button,
  Card,
  FAB,
  Portal,
  Provider,
} from "react-native-paper";
import { AppointmentForm } from "../components";
import { Agenda, AgendaEntry, Calendar } from "react-native-calendars";
import { userAppointmentsAction } from "../store/actions/appointmentActions";
import { ApplicationState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

interface CalendarProps {
  navigation: DrawerNavigationProp<ShellNavigatorParamList, "Calendar">;
}

export const CalendarScreen: React.FC<CalendarProps> = ({ navigation }) => {
  const appState = useSelector((state: ApplicationState) => state);

  const [appointmentModal, visibleAppointmentModal] = useState(false);
  const showAppointmentModal = () => visibleAppointmentModal(true);
  const hideAppointmentModal = () => visibleAppointmentModal(false);

  const [items, setItems] = useState<any>(Object);
  const currentDate = new Date();
  const dispatch = useDispatch();

  const timeToString = (time: any): string => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };
  

  const titleStyle = StyleSheet.compose(styles.title, null);
  const participantTitleStyle = StyleSheet.compose(
    styles.participantTittle,
    null
  );

  const onSelectDay = async (day: any) => {
    let dateToGet = ''; 
    if(day.dateString === undefined){
      dateToGet = moment(day).format("MM-DD-YYYY"); 
    }else{
      dateToGet = moment(day.dateString).format("MM-DD-YYYY");  
    }
    console.log(dateToGet)
    userAppointmentsAction(
      appState.auth?.user?._id ?? "",
      dateToGet,
      dispatch
    );  
     
    if(day.dateString === undefined ){
      items[moment(day).format("YYYY-MM-DD")] = [];
    }else {
      items[day.dateString] = [];
    }
      
      console.log(items);
      appState.appointment?.userAppointments.map((appointmentItem, index) => {
        const newAppointment = {
          name: "Encuentro",
          with: "",
        };

        if (appState.auth?.user.role === "Patient") {
          newAppointment.with = `${appointmentItem.psychologist.firstName} ${appointmentItem.psychologist.lastName}`;
        } else {
          newAppointment.with = `${appointmentItem.patient.firstName} ${appointmentItem.patient.lastName}`;
        }
        items[day.dateString].push(newAppointment);
      }); 
 
    const newItems: any = {};
    Object?.keys(items).forEach((key) => {
      newItems[key] = items[key];
    }); 
    setItems(newItems);

  };

  useEffect(() => { 
    onSelectDay(currentDate.toISOString());
   }, []);  

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card style={{ backgroundColor: "#E5A186" }}>
          <Card.Content>
            <View>
              <Text style={titleStyle}>{item.name}</Text>
              <Text style={participantTitleStyle}>{item.with}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }; 

  return (
    <View style={{ flex: 1 }}>
      <AppointmentForm visible={appointmentModal} hide={hideAppointmentModal} /> 
      <Agenda
        items={items} 
        initialDate={currentDate.toJSON().slice(0, 10).toString()}
        selected={currentDate.toJSON().slice(0, 10).toString()}
        renderItem={renderItem}
        theme={{
          agendaDayTextColor: "rgba(219, 101, 81, 0.99)", 
          agendaDayNumColor: "rgba(219, 101, 81, 0.99)",
          agendaTodayColor: "rgba(219, 101, 81, 0.99)",
          agendaKnobColor: "#F38673",
          dotColor: "#FFF0E4",
          selectedDayBackgroundColor: "#FFF0E4",
          selectedDayTextColor: "#DB6551",
        }}
        onDayPress={(day) => {
          onSelectDay(day);
        }}
      />
      <View>
        {appState.auth?.user?.hasOwnProperty("patient") ? (
          <FAB
            icon="plus"
            style={styles.fab}
            visible={true}
            color="white"
            onPress={() => showAppointmentModal()}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "400",
    fontSize: 12,
    letterSpacing: 0.3,
    color: "#FFFF",
  },
  participantTittle: {
    fontWeight: "600",
    color: "#FFFF",
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
    backgroundColor: "#DB6551",
  },
});
