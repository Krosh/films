import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import logger from 'redux-logger';
// import rootReducer from './reducers/vote';
// import {loadFilm} from "./actions/VoteActions";

function rootReducer(state, action) {
    switch (action.type) {
        case "SUCCESS_GET":
            return {
                users: action.users
            }
        default:
            return state
    }
}

function getUsers(url) {
    return function(dispatch) {
        fetch(url)
        .then(res => res.json())
        .then(res => {
            dispatch({
                type: "SUCCESS_GET",
                users: res
            })
        })
    }
}
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);

let store = createStoreWithMiddleware(rootReducer, { users: null });

store.getState()
store.dispatch(getUsers('https://jsonplaceholder.typicode.com/users'));

ReactDOM.render(<Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
