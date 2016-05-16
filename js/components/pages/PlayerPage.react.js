import {changeLanguage, changeBitrate, asyncHeartbeat, asyncFetchStreams} from '../../actions/AppActions';
import {HEARTBEAT_INTERVAL} from '../../constants/AppConstants';
import NoBroadcast from '../NoBroadcast.react'
import React, {Component} from 'react';

class PlayerPage extends Component {

    componentDidMount() {
        this.resetHeartbeat();
        this.props.dispatch(asyncFetchStreams(this.props.data.selectedLanguage));
    }

    componentWillUnmount() {
        if (this.state.heartbeatTimerId) {
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

    dispatchHeartbeat() {
        const {selectedLanguage, selectedBitrate} = this.props.data;
        this.props.dispatch(asyncHeartbeat(selectedLanguage, selectedBitrate));
    }

    onLangSelected(code) {
        console.info('Lang selected', code);
        this.clearPlayer();
        this.props.dispatch(changeLanguage(code));
        this.props.dispatch(asyncFetchStreams(code));
    }

    onBitrateSelected(bitrate) {
        console.info('Bitrate selected', bitrate);
        this.clearPlayer();
        this.props.dispatch(changeBitrate(bitrate));
    }

    clearPlayer() {
        if (document.getElementById("jwplayer-container") == null)
            return;

        const jwp = window.jwplayer("jwplayer-container");
        if (jwp && jwp.getState() != null) {
            jwp.stop();
            jwp.remove();
        }
    }

    chooseStream(streams, bitrate) {
        if (streams.has(bitrate)) {
            return streams.get(bitrate);
        } else {
            return streams.values().next().value;
        }
    }

    getBaseCssClass() {
        return '';
    }

    getTitle() {
        return "BB Live Broadcast";
    }

    getPlayerMenu() {
        return null;
    }

    getLanguageList() {
        return null;
    }

    render() {
        const {languages, streams, selectedLanguage, selectedBitrate, broadcast} = this.props.data;
        const statusPhrase = broadcast ?
            "Loading..." :
            languages.hasOwnProperty(selectedLanguage) ?
                languages[selectedLanguage].Offline :
                "No broadcast now";

        // Setup jwplayer if it is idle and we're broadcasting
        if (broadcast) {
            if (window.jwplayer &&
                streams.hasOwnProperty(selectedLanguage) &&
                document.getElementById("jwplayer-container") != null &&
                window.jwplayer("jwplayer-container").getState() == null) {
                const s = this.chooseStream(streams[selectedLanguage], selectedBitrate),
                    sources = [{file: s.rtmp}, {file: s.hls}];
                console.info('Setting up player', sources.map((x) => x.file));
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
        }

        return (
            <div className={this.getBaseCssClass()}>
                <h3>{this.getTitle()}</h3>
                <div className="player">
                    {this.getPlayerMenu()}
                    <div id="jwplayer-container">
                        <NoBroadcast message={statusPhrase}/>
                    </div>
                </div>
                <div className="languages">
                    <h4>Languages</h4>
                    <ul className="languages-list">
                        {this.getLanguageList()}
                    </ul>
                </div>
            </div>
        );
    }

}
export default PlayerPage;
