/**
 *
 * app.js
 *
 * This is the entry file for the application, mostly just setup and boilerplate
 * code. Routes are configured at the end of this file!
 *
 */


// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import IndexRoute from 'react-router/lib/IndexRoute'
import Route from 'react-router/lib/Route'
import Router from 'react-router/lib/Router'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import createHistory from 'history/lib/createBrowserHistory';
import createHistory from 'history/lib/createHashHistory';
import useBasename from 'history/lib/useBasename';

// Import the pages
import HomePage from './components/pages/HomePage.react';
import AdminPage from './components/pages/AdminPage.react';
import NotFoundPage from './components/pages/NotFound.react';
import App from './components/App.react';

// Import the CSS file, which HtmlWebpackPlugin transfers to the build folder
import '../css/main.css';

// Create the store with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
import rootReducer from './reducers/rootReducer';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
    module.hot.accept('./reducers/rootReducer', () => {
        const nextRootReducer = require('./reducers/rootReducer').default;
        store.replaceReducer(nextRootReducer);
    });
}

const browserHistory = useBasename(createHistory)({
    basename: module.hot ? '' : '/live'
});


// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route component={App} path='/'>
                <IndexRoute component={HomePage}/>
                <Route path="admin" component={AdminPage}/>
                <Route path="*" component={NotFoundPage}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
