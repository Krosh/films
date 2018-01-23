import * as types from '../constants/ActionTypes';

const initialState = {
    currentFilm: {
        name: 'Фильм',
        desc: 'Описание',
        poster: 'images/temp/poster.jpg',
    },
    mark: 3,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_MARK:
            return {
                ...state,
                mark: action.value,
            };
        case types.LOAD_FILM:
            return {
                ...state,
                currentFilm: action.value,
            };
        default:
            return state;
    }
}