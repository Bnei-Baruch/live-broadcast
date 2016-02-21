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
import { REQUEST_STREAMS, RECEIVE_STREAMS, CHANGE_LANGUAGE } from '../constants/AppConstants';

const API_URL = window.BB.config.apiUrl;
const TIMEOUT = 10000;


export function changeLanguage(lang) {
    return {
        type: CHANGE_LANGUAGE,
        lang: lang
    }
}

function requestStreams(lang) {
    return {
        type: REQUEST_STREAMS,
        lang: lang
    }
}

export function receiveStreams(lang, json) {
    return {
        type: RECEIVE_STREAMS,
        lang: lang,
        data: json
    };
}


function apiRequest(path, payload) {
    return request.post(API_URL + path)
        .set('Content-Type', 'application/json')
        .send(payload)
        .timeout(TIMEOUT)
}


export function asyncFetchStreams(lang) {
    return (dispatch) => {
        dispatch(requestStreams(lang));

        return apiRequest('streams', {lang: lang})
            .then((res) => {
                return dispatch(receiveStreams(lang, res));
            }).promise();
    };
}