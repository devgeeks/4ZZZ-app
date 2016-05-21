import React from 'react';
import { connect } from 'react-redux';

import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';
import { setAudioDuration, setAudioStatus } from 'actions/audioActions';
import { hhmmss } from 'utils/AudioUtils';

const PlaybackControlsViewAndroid = React.createClass({

  displayName: 'PlaybackControlsViewAndroid',

  propTypes: {
    errorHandler: React.PropTypes.func,
    dispatch: React.PropTypes.func.isRequired,
    media: React.PropTypes.object,
    nowPlaying: React.PropTypes.object,
  },

  componentDidMount() {
    document.addEventListener('deviceready', () => {
      console.log('device ready!');
      window.StatusBar && window.StatusBar.backgroundColorByHexString('#263238');

      if (window.MusicControls) {
        window.MusicControls.subscribe((action) => {
          switch (action) {
            case 'music-controls-play':
              this.handlePlaybackControlAction('play');
              break;
            case 'music-controls-pause':
              this.handlePlaybackControlAction('stop');
              break;
            default:
              break;
          }
        });
      }
    });
  },

  setNowPlayingControls(isInitial) {
    const { nowPlaying: { show: { name, broadcasters } } } = this.props;
    const { MusicControls } = window;
    isInitial && MusicControls.destroy(() => {
      console.error('MusicControls destroyed');
    }, () => {
      console.error('Error destroying MusicControls');
    });
    MusicControls && MusicControls.create({
      track: `${name} - ${broadcasters}`,
      artist: '4ZZZ',
      cover: 'http://cart.4zzzfm.org.au/includes/templates/classic/images/4ZZZ_CIRC.png',
      isPlaying: false,
      dismissable: false,
      // hide previous/next/close buttons:
      hasPrev: false,
      hasNext: false,
      hasClose: false,
    }, () => true, err => console.error(err));
    if (isInitial) {
      MusicControls && MusicControls.listen();
    }
  },

  audio: null,
  mediaTimer: null,

  mediaSuccess() {
    console.log('MEDIA_SUCCESS');
  },

  mediaError(err) {
    /*
      MediaError.MEDIA_ERR_ABORTED = 1
      MediaError.MEDIA_ERR_NETWORK = 2
      MediaError.MEDIA_ERR_DECODE = 3
      MediaError.MEDIA_ERR_NONE_SUPPORTED = 4
    */
    const { dispatch, errorHandler } = this.props;
    console.error(err.code, err.message);
    errorHandler({
      error: new Error(),
      msg: `There was an error playing back the stream.
        Make sure your device has an internet connection.`,
    });
    this.handlePlaybackControlAction('stop');
    dispatch(setAudioStatus('stopped'));
  },

  mediaStatus(status) {
    /*
      Media.MEDIA_NONE = 0;
      Media.MEDIA_STARTING = 1;
      Media.MEDIA_RUNNING = 2;
      Media.MEDIA_PAUSED = 3;
      Media.MEDIA_STOPPED = 4;
    */
    const { Media, MusicControls } = window;
    const { dispatch } = this.props;
    switch (status) {
      case Media.MEDIA_STARTING:
        console.log('WAITING');
        dispatch(setAudioStatus('pending'));
        break;
      case Media.MEDIA_RUNNING:
        console.log('PLAY');
        dispatch(setAudioStatus('playing'));
        MusicControls && MusicControls.updateIsPlaying(true);
        break;
      case Media.MEDIA_PAUSED:
        console.log('PAUSE');
        dispatch(setAudioStatus('stopped'));
        MusicControls && MusicControls.updateIsPlaying(false);
        break;
      default:
        console.log('MEDIA_STATUS', status);
        break;
    }
  },

  createOrPlayAudio() {
    if (this.audio) {
      this.audio.release();
    }
    const { dispatch } = this.props;
    const audioURL = 'http://stream.4zzzfm.org.au:789/;';
    this.audio = window.audio = new window.Media(audioURL, this.mediaSuccess,
        this.mediaError, this.mediaStatus);
    this.setNowPlayingControls(true);
    this.audio.play();
    this.mediaTimer = setInterval(() => {
      // get media position
      this.audio.getCurrentPosition(
        // success callback
        position => {
          if (position > -1) {
            dispatch(setAudioDuration(hhmmss(position)));
          }
        },
        // error callback
        error => {
          console.log(`Error getting pos=${error}`);
        }
      );
    }, 1000);
  },

  handlePlaybackControlAction(type) {
    const { dispatch } = this.props;
    if (type === 'play') {
      this.createOrPlayAudio();
    } else {
      dispatch(setAudioStatus('stopped'));
      if (this.audio) {
        this.audio.pause();
        clearInterval(this.mediaTimer);
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

export default connect(mapStateToProps)(PlaybackControlsViewAndroid);
