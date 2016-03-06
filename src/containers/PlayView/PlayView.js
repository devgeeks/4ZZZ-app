import React from 'react';
import { connect } from 'react-redux';

import { determineNowPlayingIfNeeded } from 'actions/nowPlayingActions';
import { playAudio, stopAudio, setAudioStatus } from 'actions/audioActions';

import PlaybackPane from 'components/PlaybackPane';
import Navbar from 'components/Navbar';
import PlaybackControls from 'components/PlaybackControls';
import NowPlaying from 'components/NowPlaying';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';

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

const PlayView = React.createClass({

  displayName: 'PlayView',

  propTypes: {
    audio: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    errorHandler: React.PropTypes.func,
    nowPlaying: React.PropTypes.object,
    store: React.PropTypes.object,
    guide: React.PropTypes.object,
  },

  getInitialState() {
    return {
      currentPosition: '0:00',
      isPending: false,
      isPlaying: false,
    };
  },

  componentWillMount() {
    const { dispatch } = this.props;
    window.nowPlayingTimer = setInterval(() => {
      console.log('checking now playing');
      dispatch(determineNowPlayingIfNeeded());
    }, 30000);
  },

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.guide.shows !== this.props.guide.shows) {
      dispatch(determineNowPlayingIfNeeded());
    }
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
          dispatch(setAudioStatus('stopped'));
          console.log('stalled');
          this.setState({
            isPlaying: false,
            isPending: false,
          });
          this.handlePlaybackControlAction('stop');
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
    const { nowPlaying } = this.props;

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
      <PlaybackPane>
        <Navbar />
        <NowPlaying nowPlaying={ nowPlaying } />
        <PlaybackControls currentPosition={ currentPosition }
          isPlaying={ isPlaying }
        >
          { controls }
        </PlaybackControls>
      </PlaybackPane>
    );
  },
});

function mapStateToProps(state) {
  const { media, guide, nowPlaying } = state;
  return {
    media,
    guide,
    nowPlaying,
  };
}

export default connect(mapStateToProps)(PlayView);
