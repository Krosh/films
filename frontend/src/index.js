import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'

import vote from './reducers/vote';
import {loadFilm} from "./actions/VoteActions";

const reducer = combineReducers({vote});
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer, { users: null });

store.dispatch(loadFilm());
ReactDOM.render(<Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
