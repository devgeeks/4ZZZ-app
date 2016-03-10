import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import ErrorDialog from 'components/ErrorDialog';
import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';

import { playAudio, stopAudio, setAudioStatus } from 'actions/audioActions';
import { fetchGuideDataIfNeeded } from 'actions/guideActions';

const audioURL = 'http://stream.4zzzfm.org.au:789/;';
let audio;

function hhmmss(secs) {
  let s1 = Math.floor(secs);
  const h1 = Math.floor(s1 / (60 * 60));
  s1 %= 60 * 60;
  const m1 = Math.floor(s1 / 60);
  s1 %= 60;
  const h2 = h1 ? `${h1}:` : '';
  const m2 = h1 && m1 < 10 ? `0${m1}` : m1;
  const s2 = s1 < 10 ? `0${s1}` : s1;
  return `${h2}${m2}:${s2}`;
}

function throttle(callback, limit) {
  let wait = false;
  return () => {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}

const App = React.createClass({

  displayName: 'App',

  propTypes: {
    audio: React.PropTypes.object,
    children: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      currentPosition: '0:00',
      isPending: false,
      isPlaying: false,
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

  // @TODO consider if all of this should be a store with actions, etc
  handlePlaybackControlAction(type) {
    const { dispatch } = this.props;
    switch (type) {
      case 'play':
        dispatch(playAudio());
        console.log('pending');
        audio = new Audio(audioURL);
        audio.addEventListener('timeupdate', throttle(() => {
          if (!audio) return;
          this.setState({ currentPosition: hhmmss(audio.currentTime) });
        }, 1000), false);
        audio.addEventListener('error', (error) => {
          console.error('error', error);
          this.setState({
            isPlaying: false,
            isPending: false,
          });
          this.handlePlaybackControlAction('stop');
        }, false);
        audio.addEventListener('canplay', () => {
          console.log('audio can play');
          // Is this one needed?
        }, false);
        audio.addEventListener('waiting', () => {
          dispatch(setAudioStatus('pending'));
          console.log('waiting');
          this.setState({
            isPlaying: true,
            isPending: true,
          });
        }, false);
        audio.addEventListener('playing', () => {
          dispatch(setAudioStatus('playing'));
          console.log('playing');
          this.setState({
            isPlaying: true,
            isPending: false,
          });
        }, false);
        audio.addEventListener('ended', () => {
          dispatch(setAudioStatus('stopped'));
          console.log('ended');
          this.setState({
            isPlaying: false,
            isPending: false,
          });
        }, false);
        audio.addEventListener('stalled', () => {
          dispatch(setAudioStatus('pending'));
          console.log('stalled');
          audio.load();
          this.setState({
            isPlaying: true,
            isPending: true,
          });
          audio.play();
        }, false);
        audio.play();
        break;
      case 'pending':
      case 'stop':
      default:
        dispatch(stopAudio());
        console.log('stopping');
        if (audio) audio.pause();
        audio = null;
        this.setState({
          currentPosition: '0:00',
          isPending: false,
          isPlaying: false,
        });
    }
  },

  render() {
    const { currentPosition, isPending, isPlaying } = this.state;
    const key = this.props.location.pathname;
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
          <span className="playback-duration">{ currentPosition || '0:00' }</span>
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
        <PlaybackControls currentPosition={ currentPosition }
          isPlaying={ isPlaying }
        >
          { controls }
        </PlaybackControls>
      </div>
    );
  },
});

function mapStateToProps(state) {
  const { guide } = state;
  return {
    guide,
  };
}

export default connect(mapStateToProps)(App);
