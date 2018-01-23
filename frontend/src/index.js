import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'

import * as reducers from './reducers';
import {loadFilm} from "./actions/VoteActions";

const reducer = combineReducers(reducers);
const store = createStore(reducer, applyMiddleware(thunk));

store.dispatch(loadFilm());
ReactDOM.render(<Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
