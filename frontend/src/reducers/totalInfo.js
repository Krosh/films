import * as types from '../constants/ActionTypes';

const initialState = {
    current: 0,
    total: 5,
    answered: [],
    skipped: [],
};

export default function totalInfo(state = initialState, action) {
    switch (action.type) {
        case types.MARK_AS_SKIPPED:
            return {
                    ...state,
                    skipped: state.skipped.concat([{
                        id: action.id,
                    }]),
                };
        case types.MARK_AS_ANSWERED:
            return {
                ...state,
                current: state.current + 1,
                answered: state.answered.concat([{
                    id: action.id,
                    mark: action.mark,
                }]),
            };

        default:
            return state;
    }
}