import { Action, Reducer } from "redux";
import { Article } from "../../models";
import { KnownAction } from "../actions/articleActions";

export interface ArticleState {
    articles: Article[];
    loadingArticles: boolean;
    savingNewArticle: boolean;
}

const unloadedState: ArticleState = { 
    articles: [],
    loadingArticles: false,
    savingNewArticle: false,
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
    }

    return state;
}