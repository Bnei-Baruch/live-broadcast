/*
 * HomePage
 * This is the first thing users see of our App
 */

import { changeLanguage, asyncFetchStreams } from '../../actions/AppActions';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomePage extends Component {

    onLangSelected(e, code) {
        console.log('Lang selected', code);
        this.props.dispatch(changeLanguage(code));

        // TODO: Proper error handling should come here
        this.props.dispatch(asyncFetchStreams(code));
    }

    render() {
        const { languages } = this.props.data;

        const langs = [];
        for (let [code, display] of languages.entries()) {
          langs.push((
              <div className="language"
                   key={code}
                   onClick={(e) => this.onLangSelected(e, code)}>
                  Lang: {code}: {display}
              </div>)
          ) ;
        }

        return (
            <div>
                <h3>BB Live Broadcast</h3>
                <div className="player">
                    <a className="btn" href="https://google.com">Play</a>
                </div>
                <div className="languages">{langs}</div>
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
