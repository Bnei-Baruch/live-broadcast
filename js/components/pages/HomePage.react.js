/*
 * HomePage
 * This is the first thing users see of our App
 */

import { asyncGetStreams } from '../../actions/AppActions';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomePage extends Component {

    onLangSelected(e, code) {
        console.log('Lang selected', code);
        this.props.dispatch(asyncGetStreams(code));
    }

    render() {
        const { languages } = this.props.data;

        console.log(languages);

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
    return {
        data: state
    };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(HomePage);
