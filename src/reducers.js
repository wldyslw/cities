import { combineReducers } from 'redux';
import { gameStates } from './constants';

const initialGameState = {
    status: gameStates.PENDING, 
    cities: [], 
    citiesFetching: false, 
    usedCitiesStack: []
};

const game = (state = initialGameState, action) => (({
    'CHANGE_GAME_STATE': () => Object.assign({},  state, { status: action.status }),
    'RESET_STATE': () => Object.assign({}, initialGameState, { cities: state.cities }),
    'PROPOSE_CITY': () => Object.assign({}, state, { usedCitiesStack: [{ city: action.city, member: action.member }, ...state.usedCitiesStack] }),
    'REQUEST_CITIES': () => Object.assign({}, state, { citiesFetching: true }),
    'RECIEVE_CITIES': () => Object.assign({}, state, { cities: action.payload, citiesFetching: false })
})[action.type] || (() => state))();

export default combineReducers({ game });
