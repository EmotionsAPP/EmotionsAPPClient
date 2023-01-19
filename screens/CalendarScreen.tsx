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
import {
  userAppointmentsAction,
  userAppointmentsListAction,
} from "../store/actions/appointmentActions";
import { ApplicationState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { traduct } from "../langs";
import { Positions } from "react-native-calendars/src/expandableCalendar";

interface CalendarProps {
  navigation: DrawerNavigationProp<ShellNavigatorParamList, "Calendar">;
}

export const CalendarScreen: React.FC<CalendarProps> = ({ navigation }) => {
  const appState = useSelector((state: ApplicationState) => state);

  const [appointmentModal, visibleAppointmentModal] = useState(false);
  const showAppointmentModal = () => visibleAppointmentModal(true);
  const hideAppointmentModal = () => visibleAppointmentModal(false);

  const [items, setItems] = useState<any>({});
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
  const loadItems = (day: any) => {
    console.log(day);
    setItems({}); //setting items to empty
    //Este es el .map de los appoinments   vc 
    if (appState?.appointment?.allUserAppointments?.length !== undefined) {
      const filtered_appointments =
        appState.appointment.allUserAppointments.reduce(
          (filtered, appointment) => {
            if (timeToString(appointment.start) == day.dateString) {
              let withName = "";
              console.log("appointment.start", appointment.start);
              if (appState.auth?.user.role === "Patient") {
                withName = `${appointment.psychologist.firstName} ${appointment.psychologist.lastName}`;
              } else {
                withName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
              }

              filtered.push({
                name: traduct("meeting"),
                height: Math.max(50, Math.floor(Math.random() * 150)),
                with: withName,
                status: appointment?.status,
              });
            }

            return filtered;
          },
          []
        );

      setItems({
        [day.dateString]: filtered_appointments
      });
    }
  };

  useEffect(() => {}, []);

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card style={{ backgroundColor: "#E5A186" }}>
          <Card.Content>
            <View>
              <Text style={titleStyle}>{item.name}</Text>
              <Text style={participantTitleStyle}>{item.with}</Text>
              <Text style={{ marginLeft: 226, color: "#FFFF", marginTop: -16 }}>
                {item.status}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppointmentForm visible={appointmentModal} hide={hideAppointmentModal} />
      {items.length}
      <Agenda
        items={items}
        loadItemsForMonth={(month) => {loadItems(month)}}
        renderItem={renderItem}
        theme={{
          agendaDayTextColor: "rgba(219, 101, 81, 0.99)",
          agendaDayNumColor: "rgba(219, 101, 81, 0.99)",
          agendaTodayColor: "rgba(219, 101, 81, 0.99)",
          agendaKnobColor: "#F38673",
          dotColor: "#FFF0E4",
          selectedDayBackgroundColor: "#FFF0E4",
          selectedDayTextColor: "#DB6551",
          todayDotColor: "#FFF0E4",
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
