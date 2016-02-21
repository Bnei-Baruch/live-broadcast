/*
 * The reducer takes care of our data
 * Using actions, we can change our application state
 * To add a new action, add it to the switch statement in the homeReducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return assign({}, state, {
 *       stateVariable: action.var
 *   });
 *
 * To add a new reducer, add a file like this to the reducers folder, and
 * add it in the rootReducer.js.
 */

import { GET_STREAMS } from '../constants/AppConstants';
import assignToEmpty from '../utils/assign';

const initialState = {
    languages: new Map([
        ['HE', 'Hebrew'],
        ['EN', 'English'],
        ['RU', 'Russian'],
        ['ES', 'Spanish']
    ]),
    streams: {}
};

function homeReducer(state = initialState, action) {
    Object.freeze(state); // Don't mutate state directly, always use assign()!
    switch (action.type) {
        case GET_STREAMS:
            let s = {};
            s[action.lang] = action.data;
            return assignToEmpty(state, {
                streams: s
            });
        default:
            return state;
    }
}

export default homeReducer;
