import { Action, Reducer } from "redux";
import { Article } from "../../models";
import { KnownAction } from "../actions/articleActions";

export interface ArticleState {
    articles: Article[];
    loadingArticles: boolean;
    savingNewArticle: boolean;
    deletingArticle: boolean;
    editingArticle: boolean;
}

const unloadedState: ArticleState = { 
    articles: [],
    loadingArticles: false,
    savingNewArticle: false,
    deletingArticle: false,
    editingArticle: false
};

export const reducer: Reducer<ArticleState> = (state: ArticleState | undefined, incomingAction: Action): ArticleState => {
    if(state === undefined) { 
        return unloadedState;
    }

    const action = incomingAction as KnownAction;  
    switch(action.type) { 
        case 'REQUEST_ARTICLES':
            return {
                ...state,
                loadingArticles: true
            };
        case 'RESPONSE_ARTICLES':
            return {
                ...state,
                articles: action.articles,
                loadingArticles: false,
            };
        case 'REQUEST_NEW_ARTICLE': 
            return {
                ...state,
                savingNewArticle: true
            }
        case 'RESPONSE_NEW_ARTICLE': 
            return {
                ...state,
                savingNewArticle: false
            }
        case 'REQUEST_EDIT_ARTICLE': 
            return {
                ...state,
                editingArticle: true
            }
        case 'RESPONSE_EDIT_ARTICLE': 
            return {
                ...state,
                editingArticle: false
            }
        case 'REQUEST_DELETE_ARTICLE': 
            return {
                ...state,
                deletingArticle: true
            }
        case 'RESPONSE_DELETE_ARTICLE': 
            return {
                ...state, 
                deletingArticle: false
            }
    }

    return state;
}