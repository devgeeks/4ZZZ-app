import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import ErrorDialog from 'components/ErrorDialog';

const App = React.createClass({

  displayName: 'App',

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

// @TODO this is NOT right, it's just a stub...
function mapStateToProps(state) {
  const { guide, guideData, nowPlaying } = state;
  return {
    guide,
    guideData,
    nowPlaying,
  };
}

export default connect(mapStateToProps)(App);
