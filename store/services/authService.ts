import { API } from ".";
import { LoginBody, SignUpBody } from "../../models/auth"

export const signUp = (body: SignUpBody): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(body)
  }

  return fetch(`${API}/register`, requestInfo)
}
  
export const signIn = (body: LoginBody): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(body)
  }

  return fetch(`${API}/auth`, requestInfo)
}