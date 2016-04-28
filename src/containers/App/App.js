import React from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-transition-group';
import classNames from 'classnames';

import ErrorDialog from 'components/ErrorDialog';
import PlaybackControlsViewiOS from 'containers/PlaybackControlsViewiOS';
import PlaybackControlsViewAndroid from 'containers/PlaybackControlsViewAndroid';

import { isAndroid } from 'utils/Device';

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

  render() {
    const {
      location: { pathname: key, action: direction },
    } = this.props;
    const props = {
      key,
      errorHandler: this.errorHandler,
      direction: direction.toLowerCase(),
    };

    const cx = classNames({
      app: true,
      iOS: !isAndroid(),
    });

    const playBackControlsView = isAndroid()
      ? <PlaybackControlsViewAndroid errorHandler={ this.errorHandler } />
      : <PlaybackControlsViewiOS errorHandler={ this.errorHandler } />;

    return (
      <div className={ cx }>
        <ErrorDialog error={ this.state.error } />
        <TransitionGroup className="transitiongroup">
          { React.cloneElement(this.props.children || <div />, props) }
        </TransitionGroup>
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
