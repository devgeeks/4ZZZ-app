import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import ErrorDialog from 'components/ErrorDialog';
import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';

import { setAudioDuration, setAudioStatus } from 'actions/audioActions';
import { fetchGuideDataIfNeeded } from 'actions/guideActions';

import { throttle, hhmmss } from 'utils/AudioUtils';

const audioURL = 'http://stream.4zzzfm.org.au:789/;';
let audio;

const App = React.createClass({

  displayName: 'App',

  propTypes: {
    media: React.PropTypes.object,
    children: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
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
    }, 2600);
  },

  // @TODO - How much of this could be moved to utils?
  //  or should it just be a PlaybackControlsContainer?
  handlePlaybackControlAction(type) {
    const { dispatch } = this.props;
    switch (type) {
      case 'play':
        console.log('pending');
        audio = new Audio(audioURL);
        audio.addEventListener('timeupdate', throttle(() => {
          if (!audio) return;
          dispatch(setAudioDuration(hhmmss(audio.currentTime)));
        }, 1000), false);
        audio.addEventListener('error', (error) => {
          console.error('error', error);
          this.handlePlaybackControlAction('stop');
          dispatch(setAudioStatus('stopped'));
        }, false);
        audio.addEventListener('canplay', () => {
          // Is this one needed?
        }, false);
        audio.addEventListener('waiting', () => {
          dispatch(setAudioStatus('pending'));
        }, false);
        audio.addEventListener('playing', () => {
          dispatch(setAudioStatus('playing'));
        }, false);
        audio.addEventListener('ended', () => {
          dispatch(setAudioStatus('stopped'));
        }, false);
        audio.addEventListener('stalled', () => {
          dispatch(setAudioStatus('pending'));
          audio.load();
          audio.play();
        }, false);
        audio.play();
        break;
      case 'pending':
      case 'stop':
      default:
        dispatch(setAudioStatus('stopped'));
        if (audio) audio.pause();
        audio = null;
    }
  },

  render() {
    const {
      media: { duration, isPlaying, isPending },
      location: { pathname: key },
    } = this.props;
    const props = {
      key,
      errorHandler: this.errorHandler,
    };

    // Default to the play button
    let controls = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    if (isPending) {
      controls = (
        <PendingButton handleClick={ this.handlePlaybackControlAction }>
          <span className="loading-message">Loading...</span>
        </PendingButton>
      );
    } else if (isPlaying) {
      controls = (
        <StopButton handleClick={ this.handlePlaybackControlAction }>
          <span className="playback-duration">{ duration || '0:00' }</span>
        </StopButton>
      );
    } else {
      controls = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    }

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
        <PlaybackControls currentPosition={ duration }
          isPlaying={ isPlaying }
        >
          { controls }
        </PlaybackControls>
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
