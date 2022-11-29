import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { Article } from "../../models";
import { getArticles, saveNewArticle } from "../services/articleService";
import { openNotificationSnackbar } from "./inAppActions";

interface RequestArticles {
    type: 'REQUEST_ARTICLES';
    psychologistId: string;
}

interface ResponseArticles {
    type: 'RESPONSE_ARTICLES';
    articles: Article[];
}

interface RequestNewArticle {
    type: 'REQUEST_NEW_ARTICLE';
    article: Article;
}

interface ResponseNewArticle {
    type: 'RESPONSE_NEW_ARTICLE';
    article: Article;
}

export type KnownAction = RequestArticles | ResponseArticles | RequestNewArticle | ResponseNewArticle;

export const getArticlesAction = (psychologistId: string, dispatch: Dispatch,  appState: ApplicationState) => {
    getArticles(psychologistId)
        .then(response => response.json() as Promise<boolean>)
        .then(data => {
            dispatch({ type: 'RESPONSE_ARTICLES', articles: data });
        })

    dispatch({ type: 'REQUEST_ARTICLES', psychologistId: psychologistId });

}

export const newArticleAction = (article: Article, dispatch: Dispatch, callback: () => void) => {
    saveNewArticle(article)
        .then(response => response.json() as Promise<any>)
        .then(data => {     
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_NEW_ARTICLE', article: data });
                callback();
                openNotificationSnackbar("basic", dispatch, "saved", "Su articulo fue creado con exito");
            }else{               
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando su articulo");
            }
        })

    dispatch({ type: 'REQUEST_NEW_ARTICLE', article: article });
}
