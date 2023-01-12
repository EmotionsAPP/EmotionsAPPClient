import { Dispatch } from "redux";
import { ApplicationState } from "..";
import { Article } from "../../models";
import { deleteArticle, editArticle, getArticles, saveNewArticle } from "../services/articleService";
import { openNotificationSnackbar } from "./inAppActions";

interface RequestArticles {
    type: 'REQUEST_ARTICLES';
    psychologistId: string;
}

interface ResponseArticles {
    type: 'RESPONSE_ARTICLES';
    articles: Article[];
}

interface ErrorRequestArticles {
    type: 'ERROR_REQUEST_ARTICLES';
}

interface RequestNewArticle {
    type: 'REQUEST_NEW_ARTICLE';
    article: Article;
}

interface ResponseNewArticle {
    type: 'RESPONSE_NEW_ARTICLE';
    article: Article;
}

interface ErrorNewArticle {
    type: 'ERROR_NEW_ARTICLE';
}

interface RequestEditArticle {
    type: 'REQUEST_EDIT_ARTICLE';
    article: Article;
}

interface ResponseEditArticle {
    type: 'RESPONSE_EDIT_ARTICLE';
    article: Article;
}

interface ErrorEditArticle {
    type: 'ERROR_EDIT_ARTICLE';
    article: Article;
}

interface RequestDeleteArticle {
    type: 'REQUEST_DELETE_ARTICLE';
    articleId: string;
}

interface ResponseDeleteArticle {
    type: 'RESPONSE_DELETE_ARTICLE';
    articleId: string;
}

interface ErrorDeleteArticle {
    type: 'ERROR_DELETE_ARTICLE';
    articleId: string;
}

export type KnownAction = RequestArticles 
| ResponseArticles 
| RequestNewArticle 
| ResponseNewArticle
| RequestDeleteArticle
| ResponseDeleteArticle
| RequestEditArticle
| ResponseEditArticle
| ErrorRequestArticles
| ErrorNewArticle
| ErrorEditArticle
| ErrorDeleteArticle;

export const getArticlesAction = (dispatch: Dispatch,  appState: ApplicationState, psychologistId?: string) => {
    getArticles(psychologistId)
        .then(response => response.json() as Promise<any>)
        .then(data => {
            if(!data.statusCode)
                dispatch({ type: 'RESPONSE_ARTICLES', articles: data });
            else {
                dispatch({ type: 'ERROR_REQUEST_ARTICLES'});
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error");
            }
        })

    dispatch({ type: 'REQUEST_ARTICLES', psychologistId: psychologistId });

}

export const newArticleAction = (article: any, dispatch: Dispatch, callback: () => void) => {
    saveNewArticle(article)
        .then(response => response.json() as Promise<any>)
        .then(data => {                 
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_NEW_ARTICLE', article: data });
                callback();
                openNotificationSnackbar("basic", dispatch, "saved", "Su articulo fue creado con exito");
            }else{               
                dispatch({ type: 'ERROR_NEW_ARTICLE'});
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando su articulo");
            }
        })

    dispatch({ type: 'REQUEST_NEW_ARTICLE', article: article });
}

export const deleteArticleAction = (articleId: string, dispatch: Dispatch, callback: () => void) => {
    deleteArticle(articleId)
    .then(response => response.json() as Promise<any>)
    .then(data => {                 
        if(!data.statusCode) {
            dispatch({ type: 'RESPONSE_DELETE_ARTICLE', articleId: data });
            callback();
            openNotificationSnackbar("basic", dispatch, "saved", "Su articulo fue borrado con exito");
        }else{             
            dispatch({ type: 'ERROR_EDIT_ARTICLE'});  
            openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error borrando su articulo");
        }
    })
    
    dispatch({ type: 'REQUEST_DELETE_ARTICLE', articleId: articleId });
}

export const editArticleAction = (article: any, dispatch: Dispatch, callback: (article: Article) => void, articleId?: string) => {
    editArticle(article, articleId)
        .then(response => response.json() as Promise<any>)
        .then(data => {                             
            if(!data.statusCode) {
                dispatch({ type: 'RESPONSE_EDIT_ARTICLE', article: data });
                callback(data);
                openNotificationSnackbar("basic", dispatch, "saved", "Su articulo fue editado con exito");
            }else{          
                dispatch({ type: 'ERROR_DELETE_ARTICLE'});       
                openNotificationSnackbar("basic", dispatch, "error", "Ha ocurrido un error guardando su articulo");
            }
        })

    dispatch({ type: 'REQUEST_EDIT_ARTICLE', article: article });
}
