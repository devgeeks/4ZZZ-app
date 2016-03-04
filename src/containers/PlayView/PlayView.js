import React from 'react';
import { connect } from 'react-redux';

import { determineNowPlayingIfNeeded } from 'actions/nowPlayingActions';

import PlaybackPane from 'components/PlaybackPane';
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
    switch (type) {
      case 'play':
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
        }, false);
        audio.addEventListener('canplay', () => {
          console.log('audio can play');
          // Is this one needed?
        }, false);
        audio.addEventListener('waiting', () => {
          console.log('waiting');
          this.setState({
            isPlaying: true,
            isPending: true,
          });
        }, false);
        audio.addEventListener('playing', () => {
          console.log('playing');
          this.setState({
            isPlaying: true,
            isPending: false,
          });
        }, false);
        audio.addEventListener('ended', () => {
          console.log('ended');
          this.setState({
            isPlaying: false,
            isPending: false,
          });
        }, false);
        audio.addEventListener('error', (err) => {
          console.error('error', err);
          this.setState({
            isPlaying: false,
            isPending: false,
          });
        }, false);
        audio.addEventListener('stalled', () => {
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
  const { guide, nowPlaying } = state;
  return {
    guide,
    nowPlaying,
  };
}

export default connect(mapStateToProps)(PlayView);
