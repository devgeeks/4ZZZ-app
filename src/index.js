import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, hashHistory } from 'react-router';

import App from 'containers/App';
import PlayView from 'containers/PlayView';
import InfoView from 'containers/InfoView';
import GuideView from 'containers/GuideView';
import GuideDayView from 'containers/GuideDayView';
//import GuideShowView from 'containers/GuideShowView';
import configureStore from 'stores/configureStore';

const offlineCheckUrl = 'http://4zzzfm.org.au:41021';
import 'offline-js'; // sets up a global (ew)
import 'offline-js/themes/offline-theme-dark.css';
import 'offline-js/themes/offline-language-english.css';
import './offline.css';
window.Offline.options = {
  checks: {
    xhr: {
      url: (offlineCheckUrl),
    },
  },
  checkOnLoad: true,
  interceptRequests: true,
  reconnect: {
    initialDelay: 3,
  },
  requests: true,
  game: false,
};

import './index.css';

const store = configureStore();

ReactDOM.render((
  <Provider store={ store }>
    <Router history={ hashHistory }>
      <Route component={ App }>
        <Route path="listen" component={ PlayView } />
        <Route path="info" component={ InfoView } />
        <Route path="guide" component={ GuideView } />
        <Route path="guide/day/:day" component={ GuideDayView } />
        { /* <Route path="guide/show/:show" component={ GuideShowView } /> */ }
        <Redirect from="/" to="/listen" />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
