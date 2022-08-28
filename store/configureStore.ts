import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ApplicationState, reducers } from '.';

export const configureStore = (initialState?: ApplicationState) => {
    
    const rootReducer = combineReducers({
        ...reducers
    });
    
    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(thunk))
    );
}