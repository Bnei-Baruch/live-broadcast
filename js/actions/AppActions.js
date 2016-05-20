/*
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 * 3) (optional) Add an async function like this:
 *    export function asyncYourAction(var) {
 *        return (dispatch) => {
 *             // Do async stuff here
 *             return dispatch(yourAction(var));
 *        };
 *    }
 *
 *    If you add an async function, remove the export from the function
 *    created in the second step
 */

// Disable the no-use-before-define eslint rule for this file
// It makes more sense to have the asnyc actions before the non-async ones
/* eslint-disable no-use-before-define */

import request from 'superagent-es6-promise';
import { CHANGE_LANGUAGE, CHANGE_BITRATE, CHANGE_VOLUME, TOGGLE_TRANSLATION ,
    REQUEST_STREAMS, RECEIVE_STREAMS, REQUEST_HEARTBEAT, RECEIVE_HEARTBEAT} from '../constants/AppConstants';

const API_URL = window.BB.config.apiUrl;
const TIMEOUT = 10000;


export function changeLanguage(lang) {
    return {
        type: CHANGE_LANGUAGE,
        lang: lang
    }
}


export function changeBitrate(bitrate) {
    return {
        type: CHANGE_BITRATE,
        bitrate: bitrate
    }
}

export function changeVolume(volume) {
    return {
        type: CHANGE_VOLUME,
        volume: volume
    }
}

function requestHeartbeat(lang, bitrate) {
    return {
        type: REQUEST_HEARTBEAT,
        lang: lang,
        bitrate: bitrate
    }
}

export function receiveHeartbeat(lang, bitrate, data) {
    return {
        type: RECEIVE_HEARTBEAT,
        lang: lang,
        bitrate: bitrate,
        data: data
    };
}

function requestStreams(lang) {
    return {
        type: REQUEST_STREAMS,
        lang: lang
    }
}

export function receiveStreams(lang, data) {
    return {
        type: RECEIVE_STREAMS,
        lang: lang,
        data: data
    };
}

export function toggleTranslation(lang, state, data) {
   return {
        type: TOGGLE_TRANSLATION,
        lang: lang,
        state: state,
        data: data
    };
}

// Backend api related stuff

function apiRequest(path, payload) {
    return request.post(API_URL + path)
        .set('Content-Type', 'application/json')
        .send(payload)
        .timeout(TIMEOUT)
}

export function asyncHeartbeat(lang, bitrate) {
    console.log('Heartbeat:', lang,bitrate);
    return (dispatch) => {
        dispatch(requestHeartbeat(lang, bitrate));

        return apiRequest('heartbeat', {lang, bitrate})
            .then((res) => {
                return dispatch(receiveHeartbeat(lang, bitrate, res.body));
            });
    };
}

export function asyncFetchStreams(lang) {
    return (dispatch) => {
        dispatch(requestStreams(lang));

        return apiRequest('streams', {lang})
            .then((res) => {
                return dispatch(receiveStreams(lang, res.body));
            });
    };
}

export function asyncToggleTranslation(lang, state) {
    return (dispatch) => {
        return apiRequest(state ? 'tron' : 'troff', {lang})
            .then((res) => {
                return dispatch(toggleTranslation(lang, state, res.body));
            });
    };
}