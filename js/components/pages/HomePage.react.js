/*
 * HomePage
 * This is the first thing users see of our App
 */

import { changeLanguage, changeBitrate, asyncHeartbeat ,asyncFetchStreams } from '../../actions/AppActions';
import { HEARTBEAT_INTERVAL } from '../../constants/AppConstants';
import isUndefinedOrNull from '../../utils/undefined';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomePage extends Component {

    componentDidMount() {
        this.resetHeartbeat();
        this.props.dispatch(asyncFetchStreams(this.props.data.selectedLanguage));
    }

    componentWillUnmount() {
        if (!isUndefinedOrNull(this.state.heartbeatTimerId)) {
            clearInterval(this.state.heartbeatTimerId);
        }
        this.clearPlayer();
    }

    constructor() {
        super();
        this.state = {
            heartbeatTimerId: null
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
        this.clearPlayer();
        this.props.dispatch(changeLanguage(code));
        this.props.dispatch(asyncFetchStreams(code));
    }

    onBitrateSelected(bitrate) {
        console.log('Bitrate selected', bitrate);
        this.clearPlayer();
        this.props.dispatch(changeBitrate(bitrate));
    }

    clearPlayer() {
        if (!isUndefinedOrNull(window.jwplayer)) {
            const jwp = window.jwplayer("jwplayer-container");
            if (!isUndefinedOrNull(jwp) && jwp.getState() != null) {
                jwp.stop();
                jwp.remove();
            }
        }
    }

    chooseStream(streams, bitrate) {
        if (streams.has(bitrate)) {
            return streams.get(bitrate);
        } else {
            return streams.values().next().value;
        }
    }

    render() {
        const { languages, streams, selectedLanguage, selectedBitrate, broadcast } = this.props.data;

        let langPhrase = '';
        const langs = [];
        for (let code of Object.keys(languages)) {
            const lang = languages[code];
            if (code == selectedLanguage) {
                langPhrase = 'Playing ' + lang.Name;
            }
            langs.push((
                <li className={"language " + (code == selectedLanguage ? "active" : "")}
                     key={code}
                     onClick={(e) => this.onLangSelected(code)}>
                    <div className={"translation-indicator" + (lang.Translation ? ' active' : ' inactive')}></div>
                    {lang.Name}
                </li>)
            );
        }

        const bitrates = [];
        if (streams[selectedLanguage]) {
            for (let bitrate of streams[selectedLanguage].keys()) {
                bitrates.push((
                    <span className="bitrate-option" key={bitrate}>
                        <input type="radio" name="bitrate"
                           value={bitrate}
                           checked={selectedBitrate == bitrate}
                           onChange={(e) => this.onBitrateSelected(bitrate)}
                        />
                        {bitrate}k
                    </span>
                ));
            }
        }

        let statusPhrase;
        if (!!broadcast) {
            statusPhrase = (<div className="loading">Loading...</div>);
            if (!isUndefinedOrNull(window.jwplayer) &&
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
        } else {
            this.clearPlayer();
            const msg = languages.hasOwnProperty(selectedLanguage) ? 
                languages[selectedLanguage].Offline : 
                "No broadcast now";
            statusPhrase = (<div className="loading">{msg}</div>);
        }

        return (
            <div>
                <h3>BB Live Broadcast</h3>
                <div className="player">
                    <div className="bitrate-menu">
                        <span className="title">{langPhrase},</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="bitrates">Quality: {bitrates}</span>
                    </div>
                    <div id="jwplayer-container">
                        {statusPhrase}
                    </div>
                </div>
                <div className="languages">
                    <h4>Languages</h4>
                    <ul className="languages-list">
                        {langs}
                    </ul>
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
