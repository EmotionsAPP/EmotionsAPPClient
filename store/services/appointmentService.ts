import { API } from ".";
import { Appointment } from "../../models";

export const availablePhysicians = (time: Date): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({time: time})
  }

  return fetch(`${API}/appointment/availablePhysicians`, requestInfo)
}

export const saveNewAppointment = (appointment: Appointment) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(appointment)
  }

  return fetch(`${API}/appointment/create`, requestInfo)
}

export const getUserAppointments = (id: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({id: id})
  }

  return fetch(`${API}/appointment/userAppointments`, requestInfo)
}