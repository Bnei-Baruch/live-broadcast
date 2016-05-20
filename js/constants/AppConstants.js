/*
 * AppConstants
 * These are the variables that determine what our central data store (reducer.js)
 * changes in our state. When you add a new action, you have to add a new constant here
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'YOUR_ACTION_CONSTANT';
 */

// Misc
export const HEARTBEAT_INTERVAL = 5000;

// Actions

export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_BITRATE = 'CHANGE_BITRATE';
export const CHANGE_VOLUME = 'CHANGE_VOLUME';

export const REQUEST_HEARTBEAT = 'REQUEST_HEARTBEAT';
export const RECEIVE_HEARTBEAT = 'RECEIVE_HEARTBEAT';
export const REQUEST_STREAMS = 'REQUEST_STREAMS';
export const RECEIVE_STREAMS = 'RECEIVE_STREAMS';

export const TOGGLE_TRANSLATION = 'TOGGLE_TRANSLATION';
