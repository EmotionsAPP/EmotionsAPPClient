import { API } from ".";
import { Appointment } from "../../models";

export const availablePhysicians = (time: Date): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  }

  return fetch(`${API}/users`, requestInfo)
}

export const saveNewAppointment = (appointment: Appointment) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(appointment)
  }

  return fetch(`${API}/appointments`, requestInfo)
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

export const lastContactedUsers = (id: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  }

  const url = new URL(`${API}/appointments/contacted-users`);
  url.searchParams.append('userId', id);
  url.searchParams.append('limit', '5');

  return fetch(url, requestInfo);
}

export const getAppointmentHistory = (id: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  }

  const url = new URL(`${API}/appointments/history`);
  url.searchParams.append('userId', id);

  return fetch(url, requestInfo);
}