import { API } from ".";
import { Note, User } from "../../models";

export const getNote = (psychologistId: string, patientId: string): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  };

  const url = new URL(`${API}/notes`);
  url.searchParams.append('psychologist', psychologistId);
  url.searchParams.append('patient', patientId);

  return fetch(url, requestInfo);
}

export const saveNewNote = (note: Note): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(note)
  };

  return fetch(`${API}/notes`, requestInfo);
}

export const editNote = (note: Note, noteId?: string): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  
  const requestInfo: RequestInit = {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify(note)
  };

  return fetch(`${API}/notes/${noteId}`, requestInfo);
}

export const getCities = (): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  
  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  };

  return fetch(`${API}/cities`, requestInfo);
}

export const editUser = (user: User, psychologist: boolean, userId?: string): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  
  const requestInfo: RequestInit = {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify(user)
  };

  return fetch(`${API}/users/${psychologist ? 'psychologists' : 'patients'}/${userId}`, requestInfo);
}
