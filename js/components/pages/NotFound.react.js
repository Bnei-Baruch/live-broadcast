import React, {Component} from 'react';
import Link from 'react-router/lib/Link'

class NotFound extends Component {
    
    render() {
        return (
            <article>
                <h1>Page not found.</h1>
                Go to <Link to="/" className="btn">Home</Link>
            </article>
        );
    }
    
}

export default NotFound;
