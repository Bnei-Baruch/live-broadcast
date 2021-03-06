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

import { 
    RECEIVE_HEARTBEAT, 
    RECEIVE_STREAMS, 
    CHANGE_LANGUAGE, 
    CHANGE_BITRATE,
    CHANGE_VOLUME,
    TOGGLE_TRANSLATION } from '../constants/AppConstants';
import assignToEmpty from '../utils/assign';

const initialState = {
    languages: {},
    streams: {},
    selectedLanguage: localStorage.getItem('live.selectedLanguage') || 'eng',
    selectedBitrate: localStorage.getItem('live.selectedBitrate') || 500,
    selectedVolume: localStorage.getItem('live.selectedVolume') || 80
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
        case CHANGE_VOLUME:
            localStorage.setItem('live.selectedVolume', action.volume);
            return assignToEmpty(state, {selectedVolume: action.volume});
        case RECEIVE_HEARTBEAT:
            return assignToEmpty(state, {
                languages: action.data.Languages, 
                broadcast: action.data.Broadcast});
        case RECEIVE_STREAMS:
            const streams = new Map(action.data.Streams.map((x) => {
                const hls = x.hlsUrl,
                    rtmp = x.netUrl + '/' + x.streamName;
                return [x.bitRate, {hls, rtmp}]
            }));
            return assignToEmpty(state, {streams: {[action.lang]: streams}});
        case TOGGLE_TRANSLATION:
            return assignToEmpty(state, {languages: {[action.lang]: {Translation: action.state}}});
        default:
            return state;
    }
}

export default homeReducer;
