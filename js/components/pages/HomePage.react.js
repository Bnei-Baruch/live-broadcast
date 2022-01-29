import PlayerPage from './PlayerPage.react'
import React, {Component} from 'react';
import {connect} from 'react-redux';

const DONATE_LINKS = {
    'Hebrew': { url: 'https://www.kab1.com', label: 'לתרום'},
    'English': { url: 'https://www.kab1.com/en', label: 'donate'},
    'Russian': { url: 'https://www.kab1.com/ru', label: 'Внести Вклад'},
    'Spanish': { url: 'https://www.kab1.com/es', label: 'donar'},
}

class HomePage extends PlayerPage {

    getBaseCssClass() {
        return 'home';
    }

    getDonateButton(lang) {
        const cssClasses = lang === 'Hebrew' ? 'btn-donate hebrew' : 'btn-donate';
        const key = lang in DONATE_LINKS ? lang : 'English';
        const link = DONATE_LINKS[key];
        return (
            <a href={link.url} className={cssClasses}>
                <label>{link.label}</label>
                <span>❤</span>
            </a>
        );
    }

    getPlayerMenu() {
        const {languages, streams, selectedLanguage, selectedBitrate} = this.props.data;
        if (!languages.hasOwnProperty(selectedLanguage))
            return null;

        const selectedLanguageName = languages[selectedLanguage].Name;
        const langPhrase = 'Playing ' + selectedLanguageName;

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
                <section className="left">
                    <span className="title">{langPhrase},</span>
                    <span className="bitrates">Quality: {bitrates}</span>
                </section>

                <section className="right">
                    {this.getDonateButton(selectedLanguageName)}
                </section>
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
