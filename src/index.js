import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Router, Route } from 'react-router';
import { hashHistory } from 'react-router';

import App from 'containers/App';
import PlayView from 'containers/PlayView';
import configureStore from 'stores/configureStore';

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
