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

export const getUserAppointments = (id: string, date: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  }

  const url = new URL(`${API}/appointments`);
  url.searchParams.append('userId', id);
  url.searchParams.append('date', date);

  return fetch(url, requestInfo);
}