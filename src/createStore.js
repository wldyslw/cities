import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

export default () => {
    return createStore(reducers, applyMiddleware(thunkMiddleware));
};
