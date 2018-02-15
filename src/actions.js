import { Console } from './constants';

export const changeGameStatus = status => ({
    type: 'CHANGE_GAME_STATE',
    status
});

export const resetState = () => ({
    type: 'RESET_STATE'
});

export const proposeCity = (city, member) => ({
    type: 'PROPOSE_CITY',
    city,
    member
});

const requestCities = request => ({
    type: 'REQUEST_CITIES',
    request
});

const recieveCities = payload => ({
    type: 'RECIEVE_CITIES',
    payload
});

export const getCities = () => dispatch => {
    dispatch(requestCities());
    fetch('/cities.json', { method: 'GET' })
        .then(response => response.json(), error => {
            Console.log(error);
            dispatch(recieveCities([]));
        })
        .then(json => dispatch(recieveCities(json)));
};
