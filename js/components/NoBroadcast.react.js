import React, {Component} from 'react';

class NoBroadcast extends Component {

    render() {
        return (
            <div className="no-broadcast">
                <span className="message"> {this.props.message} </span>
            </div>
        );
    }
    
}

export default NoBroadcast;
