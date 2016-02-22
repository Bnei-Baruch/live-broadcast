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

import { RECEIVE_HEARTBEAT, RECEIVE_STREAMS, CHANGE_LANGUAGE, CHANGE_BITRATE } from '../constants/AppConstants';
import assignToEmpty from '../utils/assign';

const initialState = {
    languages: {},
    streams: {},
    selectedLanguage: localStorage.getItem('live.selectedLanguage') || 'eng',
    selectedBitrate: localStorage.getItem('live.selectedBitrate') || 500
};

function homeReducer(state = initialState, action) {
    Object.freeze(state); // Don't mutate state directly, always use assign()!
    switch (action.type) {
        case CHANGE_LANGUAGE:
            localStorage.setItem('live.selectedLanguage', action.lang);
            return assignToEmpty(state, {selectedLanguage: action.lang});
        case CHANGE_BITRATE:
            localStorage.setItem('live.selectedBitrate', action.bitrate);
            return assignToEmpty(state, {selectedBitrate: action.bitrate});
        case RECEIVE_HEARTBEAT:
            return assignToEmpty(state, {languages: action.data.Languages});
        case RECEIVE_STREAMS:
            const streams = new Map(action.data.Streams.map((x) => {
                const hls = x.hlsUrl,
                    rtmp = x.netUrl + '/' + x.streamName;
                return [x.bitRate, {hls, rtmp}]
            }));
            return assignToEmpty(state, {streams: {[action.lang]: streams}});
        default:
            return state;
    }
}

export default homeReducer;
