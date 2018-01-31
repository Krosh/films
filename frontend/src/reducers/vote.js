import * as types from '../constants/ActionTypes';

const initialState = {
    currentFilm: {
        _id: 0,
        name: 'Фильм',
        desc: 'Описание',
        poster: 'images/temp/poster.jpg',
    },
    mark: 3,
    totalInfo: {
        current: 0,
        total: 5,
        answered: [],
        skipped: [],
    }
};

export default function vote(state = initialState, action) {
    switch (action.type) {
        case types.SET_MARK:
            return {
                ...state,
                mark: action.value,
            };
        case types.MARK_AS_SKIPPED:
            return {
                ...state,
                totalInfo: {
                    ...state.totalInfo,
                    skipped: state.totalInfo.skipped.concat([{
                        id: state.currentFilm._id,
                    }]),
                }
            };
        case types.MARK_AS_ANSWERED:
            return {
                ...state,
                totalInfo: {
                    ...state.totalInfo,
                    current: state.totalInfo.current + 1,
                    answered: state.totalInfo.answered.concat([{
                        id: state.currentFilm._id,
                        mark: state.mark,
                    }]),
                }
            };

        case types.LOAD_FILM:
            return {
                ...state,
                mark: 0,
                currentFilm: action.value,
            };

        default:
            return state;
    }
}