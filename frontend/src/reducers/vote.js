import * as types from '../constants/ActionTypes';

const initialState = {
    currentFilm: {
        name: 'Фильм',
        desc: 'Описание',
        poster: 'images/temp/poster.jpg',
    },
    mark: 3,
    totalInfo: {
        current: 0,
        total: 5,
    }
};

export default function vote(state = initialState, action) {
    switch (action.type) {
        case types.SET_MARK:
            return {
                ...state,
                mark: action.value,
            };
        case types.LOAD_FILM:
            return {
                ...state,
                mark: 0,
                currentFilm: action.value,
                totalInfo: {
                    current: state.totalInfo.current + 1,
                    total: state.totalInfo.total,
                }
            };

        default:
            return state;
    }
}