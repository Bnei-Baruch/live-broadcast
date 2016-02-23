import { changeLanguage, asyncHeartbeat ,asyncFetchStreams, asyncToggleTranslation } from '../../actions/AppActions';
import { HEARTBEAT_INTERVAL } from '../../constants/AppConstants';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class AdminPage extends Component {

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

    onToggleTranslation(code) {
        const state = this.props.data.languages[code].Translation ? false : true;
        this.props.dispatch(asyncToggleTranslation(code, state));
    }

    clearPlayer() {
        const jwp = jwplayer("jwplayer-container");
        if (jwp.getState() != null) {
            jwp.stop();
            jwp.remove();
        }
    }

    chooseStream(streams) {
        if (streams.has(300)) {
            return streams.get(300);
        } else {
            return streams.values().next().value;
        }
    }

    render() {
        const { languages, streams, selectedLanguage } = this.props.data;

        let langPhrase = '';
        const langs = [];
        for (let code of Object.keys(languages)) {
            const lang = languages[code];
            if (code == selectedLanguage) {
                langPhrase = 'Playing ' + lang.Name;
            }
            langs.push((
                <div className="language"
                     key={code}
                     onClick={(e) => this.onLangSelected(code)}>
                    <div className={"translation-indicator" + (lang.Translation ? ' active' : ' inactive')}></div>
                    {lang.Name}
                    <div className="btn translation-toggle" onClick={(e) => this.onToggleTranslation(code)}>Toggle</div>
                </div>)
            );
        }

        if (!!window.jwplayer &&
            streams[selectedLanguage] &&
            window.jwplayer("jwplayer-container").getState() == null) {
            const s = this.chooseStream(streams[selectedLanguage]),
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
                <h3>BB Live Broadcast - Admin</h3>
                <div className="player admin">
                    <div className="bitrate-menu">
                        <span className="title">{langPhrase},</span>
                    </div>
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
export default connect(select)(AdminPage);
