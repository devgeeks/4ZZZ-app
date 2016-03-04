import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Router, Route } from 'react-router';
import { hashHistory } from 'react-router';

import App from 'containers/App';
import PlayView from 'containers/PlayView';
import configureStore from 'stores/configureStore';

//const offlineCheckUrl = 'http://4zzzfm.org.au:41021';
//import 'offline-js'; // sets up a global (ew)
//import 'offline-js/themes/offline-theme-dark.css';
//import 'offline-js/themes/offline-language-english.css';
//import './offline.css';
//window.Offline.options = {
  //checks: {
    //xhr: {
      //url: (offlineCheckUrl),
    //},
  //},
  //checkOnLoad: true,
  //interceptRequests: true,
  //reconnect: {
    //initialDelay: 3,
  //},
  //requests: true,
  //game: false,
//};

import './index.css';

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    <Router history={ hashHistory }>
      <Route component={ App }>
        <Route path="play" component={ PlayView } />
        <Redirect from="/" to="/play" />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
