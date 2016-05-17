import PlayerPage from './PlayerPage.react'
import {asyncToggleTranslation} from '../../actions/AppActions';
import React, {Component} from 'react';
import {connect} from 'react-redux';

class AdminPage extends PlayerPage {

    onToggleTranslation(e, code) {
        const state = this.props.data.languages[code].Translation ? false : true;
        console.info('toggle translation', code, state);
        this.props.dispatch(asyncToggleTranslation(code, state));
        e.stopPropagation();
    }

    chooseStream(streams) {
        return super.chooseStream(streams, 300);
    }
    
    getBaseCssClass() {
        return 'admin';
    }

    getTitle() {
        return super.getTitle() + " - Admin";
    }

    getPlayerMenu() {
        const {languages, selectedLanguage} = this.props.data;
        if (!languages.hasOwnProperty(selectedLanguage))
            return null;

        const langPhrase = 'Playing ' + languages[selectedLanguage].Name;
        return (
            <div className="bitrate-menu">
                <span className="title">{langPhrase}</span>
            </div>
        );
    }

    getLanguageList() {
        const {languages, selectedLanguage} = this.props.data;

        const langs = [];
        for (let code of Object.keys(languages)) {
            const lang = languages[code];
            langs.push((
                <li className={"language " + (code == selectedLanguage ? "active" : "")}
                    key={code}
                    onClick={(e) => this.onLangSelected(code)}>
                    <div className={"translation-indicator " + (lang.Translation ? 'active' : 'inactive')}></div>
                    {lang.Name}
                    <div className="btn translation-toggle" onClick={(e) => this.onToggleTranslation(e, code)}>
                        Toggle
                    </div>
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
export default connect(select)(AdminPage);
