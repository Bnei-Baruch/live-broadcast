import PlayerPage from './PlayerPage.react'
import React, {Component} from 'react';
import {connect} from 'react-redux';

class HomePage extends PlayerPage {

    getBaseCssClass() {
        return 'home';
    }

    getPlayerMenu() {
        const {languages, streams, selectedLanguage, selectedBitrate} = this.props.data;
        if (!languages.hasOwnProperty(selectedLanguage))
            return null;

        const langPhrase = 'Playing ' + languages[selectedLanguage].Name;

        const bitrates = [];
        if (streams.hasOwnProperty(selectedLanguage)) {
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

        return (
            <div className="bitrate-menu">
                <span className="title">{langPhrase},</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="bitrates">Quality: {bitrates}</span>
            </div>
        );
    }

    getLanguageList() {
        const {languages, selectedLanguage} = this.props.data,
            langs = [];

        for (let code of Object.keys(languages)) {
            const lang = languages[code];
            langs.push((
                <li className={"language " + (code == selectedLanguage ? "active" : "")}
                    key={code}
                    onClick={(e) => this.onLangSelected(code)}>
                    <div className={"translation-indicator " + (lang.Translation ? 'active' : 'inactive')}></div>
                    {lang.Name}
                </li>)
            );
        }

        return langs;
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
