import { API } from ".";
import { Article } from "../../models";

export const getArticles = (psychologistId?: string): Promise<Response> => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
  };

  const url = new URL(`${API}/articles`);
  if(psychologistId) url.searchParams.append('psychologistId', psychologistId);

  return fetch(url, requestInfo);
}

export const saveNewArticle = (article: Article) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(article)
  };

  return fetch(`${API}/articles`, requestInfo);
}

export const deleteArticle = (articleId: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'DELETE',
    headers: requestHeaders,
  };

  return fetch(`${API}/articles/${articleId}`, requestInfo);
}

export const editArticle = (article: Article, articleId?: string) => {
  const requestHeaders: HeadersInit_ = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const requestInfo: RequestInit = {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify(article)
  };

  return fetch(`${API}/articles/${articleId}`, requestInfo);
}
