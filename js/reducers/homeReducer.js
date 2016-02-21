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

import { RECEIVE_STREAMS, CHANGE_LANGUAGE, CHANGE_BITRATE } from '../constants/AppConstants';
import assignToEmpty from '../utils/assign';

const initialState = {
    languages: new Map([
        ['heb', 'Hebrew'],
        ['eng', 'English'],
        ['rus', 'Russian'],
        ['spa', 'Spanish']
    ]),
    streams: {},
    selectedLanguage: localStorage.getItem('selectedLanguage') || 'EN',
    selectedBitrate: localStorage.getItem('selectedBitrate') || 600
};

function homeReducer(state = initialState, action) {
    Object.freeze(state); // Don't mutate state directly, always use assign()!
    switch (action.type) {
        case CHANGE_LANGUAGE:
            localStorage.setItem('selectedLanguage', action.lang);
            return assignToEmpty(state, {selectedLanguage: action.lang});
        case CHANGE_BITRATE:
            localStorage.setItem('selectedBitrate', action.bitrate);
            return assignToEmpty(state, {selectedBitrate: action.bitrate});
        case RECEIVE_STREAMS:
            return assignToEmpty(state, {streams: {[action.lang]: action.data}});
        default:
            return state;
    }
}

export default homeReducer;
