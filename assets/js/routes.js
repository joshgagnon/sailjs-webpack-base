import { Route, Router, DefaultRoute } from 'react-router';
import React from 'react';
import App from './components/app';
import Landing from './components/landing';
import Home from './components/home';
import Users from './components/users';
//import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';


import configureStore from './store';

const store = configureStore();
export default <Provider store={store}>
            <Router>
                <Route component={ App }>
                    <Route path="/" component={ Landing }  />
                    <Route path="home" component={ Home }  />
                    <Route path="users" component={ Users }  />
                </Route>
            </Router>
        </Provider>



