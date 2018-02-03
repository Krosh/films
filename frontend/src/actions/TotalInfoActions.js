import * as types from '../constants/ActionTypes';
import FilmApi from '../api/FilmApi';

export function markAsSkipped(id) {
    return {
        type:types.MARK_AS_SKIPPED,
        id: id,
    }
}

export function markAsAnswered(id, mark) {
    return {
        type:types.MARK_AS_ANSWERED,
        id: id,
        mark: mark,
    }
}
