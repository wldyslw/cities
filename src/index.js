import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './createStore';
import App from './components/App';
import './cities.json';

ReactDOM.render(
    <Provider store={createStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);
