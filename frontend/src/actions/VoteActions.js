import * as types from '../constants/ActionTypes';
import FilmApi from '../api/FilmApi';

export function setMark(value) {
    return {
        type:types.SET_MARK,
        value: value
    }
 }

export function loadFilmSuccess(value) {
    return {
        type:types.LOAD_FILM,
        value: value
    }
}

 export function loadFilm() {
    return function(dispatch) {
        console.log(dispatch)
        const url = 'http://localhost:8000/film/';

        fetch(url, {
            mode: 'cors',
        })
        .then(res => res.json())
        .then(films => {
            dispatch(loadFilmSuccess(films));
        }).catch(error => {
            throw(error);
        });
    };
}