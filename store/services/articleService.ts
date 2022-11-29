import { API } from ".";
import { Article } from "../../models";

export const getArticles = (psychologistId: string): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  }

  const url = new URL(`${API}/articles`);
  url.searchParams.append('psychologistId', psychologistId);

  return fetch(url, requestInfo)
}

export const saveNewArticle = (article: Article) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(article)
  }

  return fetch(`${API}/articles`, requestInfo)
}
