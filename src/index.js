import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Router, Route, hashHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import PlayView from 'containers/PlayView';
import ErrorDialog from 'components/ErrorDialog';

import './index.css';

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
  },

  getInitialState() {
    return {
      error: {
        displayed: false,
        message: '',
      },
    };
  },

  // Global error handler passed to all routes
  errorHandler(error) {
    const { err, msg } = error;
    console.log(msg);
    console.error(err);
    this.setState({
      error: {
        displayed: true,
        message: msg,
      },
    });
    setTimeout(() => {
      this.setState({
        error: {
          displayed: false,
          message: '',
        },
      });
    }, 2600);
  },

  render() {
    const key = this.props.location.pathname;
    const props = {
      key,
      errorHandler: this.errorHandler,
    };

    return (
      <div className="app">
        <ErrorDialog error={ this.state.error } />
        <CSSTransitionGroup
          transitionEnterTimeout={ 250 }
          transitionLeaveTimeout={ 250 }
          transitionName="routetransition"
        >
          { React.cloneElement(this.props.children || <div />, props) }
        </CSSTransitionGroup>
      </div>
    );
  },
});

ReactDOM.render((
  <Router history={ hashHistory }>
    <Route component={ App }>
      <Route path="play" component={ PlayView } />
      <Redirect from="/" to="/play" />
    </Route>
  </Router>
), document.getElementById('app'));
