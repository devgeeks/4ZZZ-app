import React from 'react';
import { connect } from 'react-redux';

import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';
import { setAudioDuration, setAudioStatus } from 'actions/audioActions';
import { throttle, hhmmss } from 'utils/AudioUtils';

const PlaybackControlsViewiOS = React.createClass({

  displayName: 'PlaybackControlsViewiOS',

  propTypes: {
    errorHandler: React.PropTypes.func,
    dispatch: React.PropTypes.func.isRequired,
    media: React.PropTypes.object,
    nowPlaying: React.PropTypes.object,
  },

  componentDidMount() {
    document.addEventListener('deviceready', () => {
      console.log('device ready!');

      if (window.RemoteCommand) {
        window.RemoteCommand.on('command', command => {
          switch (command) {
            case 'play':
              this.handlePlaybackControlAction('play');
              break;
            case 'pause':
              this.handlePlaybackControlAction('stop');
              break;
            default:
              break;
          }
        });
        window.RemoteCommand.enabled('nextTrack', false);
        window.RemoteCommand.enabled('previousTrack', false);
      }
    });
  },

  setNowPlayingControls() {
    const { nowPlaying: { show: { name, broadcasters } } } = this.props;
    window.NowPlaying && window.NowPlaying.set({
      artwork: 'http://cart.4zzzfm.org.au/includes/templates/classic/images/4ZZZ_CIRC.png',
      albumTitle: broadcasters,
      artist: name,
      title: '4ZZZ',
    });
  },

  audio: null,

  createOrPlayAudio() {
    const { dispatch, errorHandler } = this.props;
    if (this.audio) {
      this.audio.play();
      return;
    }
    const audioURL = 'http://stream.4zzzfm.org.au:789/;';
    this.audio = window.audio = new Audio(audioURL);
    this.audio.play();
    this.audio.addEventListener('timeupdate', throttle(() => {
      this.setNowPlayingControls();
      dispatch(setAudioDuration(hhmmss(this.audio.currentTime)));
    }, 1000), false);
    this.audio.addEventListener('error', (error) => {
      console.log('ERROR');
      console.error('error', error);
      errorHandler({
        error: new Error(),
        msg: `There was an error playing back the stream.
          Make sure your device has an internet connection.`,
      });
      this.handlePlaybackControlAction('stop');
      dispatch(setAudioStatus('stopped'));
    }, false);
    this.audio.addEventListener('canplay', () => {
      console.log('CAN PLAY');
      // Is this one needed?
    }, false);
    this.audio.addEventListener('emptied', () => {
      console.log('EMPTIED');
      // Is this one needed?
    }, false);
    this.audio.addEventListener('abort', () => {
      console.log('ABORT');
      // Is this one needed?
    }, false);
    this.audio.addEventListener('suspend', () => {
      console.log('SUSPEND');
      // Is this one needed?
    }, false);
    this.audio.addEventListener('waiting', () => {
      console.log('WAITING');
      dispatch(setAudioStatus('pending'));
    }, false);
    this.audio.addEventListener('play', () => {
      console.log('PLAY');
      dispatch(setAudioStatus('playing'));
    }, false);
    this.audio.addEventListener('playing', () => {
      console.log('PLAYING');
      dispatch(setAudioStatus('playing'));
    }, false);
    this.audio.addEventListener('emptied', () => {
      console.log('EMPTIED');
    }, false);
    this.audio.addEventListener('ended', () => {
      console.log('ENDED');
    }, false);
    this.audio.addEventListener('pause', () => {
      console.log('PAUSE');
      dispatch(setAudioStatus('stopped'));
    }, false);
    this.audio.addEventListener('stalled', () => {
      console.log('STALLED');
      // 'stalled' was being called sometimes after stop
      //dispatch(setAudioStatus('pending'));
      //this.audio.load();
      //this.audio.play();
    }, false);
  },

  handlePlaybackControlAction(type) {
    const { dispatch } = this.props;
    if (type === 'play') {
      this.createOrPlayAudio();
    } else {
      dispatch(setAudioStatus('stopped'));
      if (this.audio) {
        this.audio.pause();
        dispatch(setAudioDuration(hhmmss(0)));
        this.audio.load();
      }
    }
  },

  render() {
    const {
      media: { duration, isPlaying, isPending },
    } = this.props;

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
      <PlaybackControls
        currentPosition={ duration }
        isPlaying={ isPlaying }
      >
        { controls }
      </PlaybackControls>
    );
  },
});

function mapStateToProps(state) {
  const { media, nowPlaying } = state;
  return {
    media,
    nowPlaying,
  };
}

export default connect(mapStateToProps)(PlaybackControlsViewiOS);
