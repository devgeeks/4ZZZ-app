import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import ErrorDialog from 'components/ErrorDialog';
import PlaybackControlsViewiOS from 'containers/PlaybackControlsViewiOS';
import PlaybackControlsViewAndroid from 'containers/PlaybackControlsViewAndroid';

import { fetchGuideDataIfNeeded } from 'actions/guideActions';

const App = React.createClass({

  displayName: 'App',

  propTypes: {
    media: React.PropTypes.object,
    children: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
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

  componentDidMount() {
    const { dispatch } = this.props;
    (function updateGuide() {
      dispatch(fetchGuideDataIfNeeded());
      setTimeout(updateGuide, 3600000); // Immediately, and every hour after
    }());
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
    }, 3600);
  },

  isAndroid() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1;
  },

  render() {
    const {
      location: { pathname: key },
    } = this.props;
    const props = {
      key,
      errorHandler: this.errorHandler,
    };

    const playBackControlsView = this.isAndroid()
      ? <PlaybackControlsViewAndroid errorHandler={ this.errorHandler } />
      : <PlaybackControlsViewiOS errorHandler={ this.errorHandler } />;

    return (
      <div className="app">
        <ErrorDialog error={ this.state.error } />
        <CSSTransitionGroup
          transitionEnterTimeout={ 300 }
          transitionLeaveTimeout={ 300 }
          transitionName="routetransition"
        >
          { React.cloneElement(this.props.children || <div />, props) }
        </CSSTransitionGroup>
        { playBackControlsView }
      </div>
    );
  },
});

function mapStateToProps(state) {
  const { media, guide } = state;
  return {
    media,
    guide,
  };
}

export default connect(mapStateToProps)(App);
