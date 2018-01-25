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
        return FilmApi
        .loadFilm()
        .then(film => {
            dispatch(loadFilmSuccess(film));
        }).catch(error => {
            throw(error);
        });
    };
}