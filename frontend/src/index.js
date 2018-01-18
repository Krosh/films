import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Vote from './Vote';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Vote />, document.getElementById('root'));
registerServiceWorker();
