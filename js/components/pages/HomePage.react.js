/*
 * HomePage
 * This is the first thing users see of our App
 */

import { changeLanguage, asyncHeartbeat ,asyncFetchStreams } from '../../actions/AppActions';
import { HEARTBEAT_INTERVAL } from '../../constants/AppConstants';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomePage extends Component {

    componentDidMount() {
        this.resetHeartbeat();
        this.props.dispatch(asyncFetchStreams(this.props.data.selectedLanguage));
    }

    componentWillUnmount() {
        if (!!this.state.heartbeatTimerId) {
            clearInterval(this.state.heartbeatTimerId);
        }
    }

    constructor() {
        super();
        this.state = {
            heartbeatTimerId: null,
            prevLang: null
        };
    }

    resetHeartbeat() {
        if (this.state.heartbeatTimerId) {
            clearInterval(this.state.heartbeatTimerId);
        }
        this.dispatchHeartbeat();
        this.setState({
            heartbeatTimerId: setInterval(this.dispatchHeartbeat.bind(this), HEARTBEAT_INTERVAL)
        });
    }

    dispatchHeartbeat(){
        const {selectedLanguage, selectedBitrate} = this.props.data;
        this.props.dispatch(asyncHeartbeat(selectedLanguage, selectedBitrate));
    }

    onLangSelected(code) {
        console.log('Lang selected', code);
        const jwp = jwplayer("jwplayer-container");
        if (jwp.getState() != null) {
            jwp.stop();
            jwp.remove();
        }

        this.props.dispatch(changeLanguage(code));

        // TODO: Proper error handling should come here
        this.props.dispatch(asyncFetchStreams(code));
    }

    chooseStream(streams, bitrate) {
        if (streams.has(bitrate)) {
            return streams.get(bitrate);
        } else {
            return streams.values().next().value;
        }
    }

    render() {
        const { languages, streams, selectedLanguage, selectedBitrate } = this.props.data;

        const langs = [];
        for (let code of Object.keys(languages)) {
            const lang = languages[code];
            langs.push((
                <div className="language"
                     key={code}
                     onClick={(e) => this.onLangSelected(code)}>
                    <div className={"translation-indicator" + (lang.Translation ? ' active' : ' inactive')}></div>
                    {lang.Name}
                </div>)
            );
        }
        if (!!window.jwplayer &&
            streams[selectedLanguage] &&
            window.jwplayer("jwplayer-container").getState() == null) {
            const s = this.chooseStream(streams[selectedLanguage], selectedBitrate),
                sources = [{file: s.rtmp}, {file: s.hls}];
            console.log('Setting up player', sources.map((x) => x.file));
            window.jwplayer("jwplayer-container").setup({
                playlist: [{sources: sources}],
                primary: 'flash',
                androidhls: true,
                autostart: true,
                aspectratio: '16:9',
                width: "100%"
            });
        }

        return (
            <div>
                <h3>BB Live Broadcast</h3>
                <div className="player">
                    <div id="jwplayer-container">
                        <div className="loading">Loading...</div>
                    </div>
                </div>
                <div className="languages">
                    <h4>Languages</h4>
                    {langs}
                </div>
            </div>
        );
    }
}

// REDUX STUFF

// Which props do we want to inject, given the global state?
function select(state) {
    console.debug('Global state', state);
    return {
        data: state
    };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(HomePage);
