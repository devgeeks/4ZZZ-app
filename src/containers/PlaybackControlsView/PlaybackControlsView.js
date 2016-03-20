import React from 'react';
import { connect } from 'react-redux';

import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';
import { setAudioDuration, setAudioStatus } from 'actions/audioActions';
import { throttle, hhmmss } from 'utils/AudioUtils';

const PlaybackControlsView = React.createClass({

  displayName: 'PlaybackControlsView',

  propTypes: {
    errorHandler: React.PropTypes.func,
    dispatch: React.PropTypes.func.isRequired,
    media: React.PropTypes.object,
  },

  audio: null,

  createAudio() {
    const { dispatch, errorHandler } = this.props;
    const audioURL = 'http://stream.4zzzfm.org.au:789/;';
    this.audio = new Audio(audioURL);
    this.audio.addEventListener('timeupdate', throttle(() => {
      if (!this.audio) return;
      dispatch(setAudioDuration(hhmmss(this.audio.currentTime)));
    }, 1000), false);
    this.audio.addEventListener('error', (error) => {
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
      // Is this one needed?
    }, false);
    this.audio.addEventListener('waiting', () => {
      dispatch(setAudioStatus('pending'));
    }, false);
    this.audio.addEventListener('playing', () => {
      dispatch(setAudioStatus('playing'));
    }, false);
    this.audio.addEventListener('ended', () => {
      dispatch(setAudioStatus('stopped'));
    }, false);
    this.audio.addEventListener('stalled', () => {
      // 'stalled' was being called sometimes after stop
      if (this.audio) {
        dispatch(setAudioStatus('pending'));
        this.audio.load();
        this.audio.play();
      }
    }, false);
  },

  // @TODO - How much of this could be moved to utils?
  handlePlaybackControlAction(type) {
    const { dispatch } = this.props;
    if (type === 'play') {
      console.log('pending');
      this.createAudio();
      this.audio.play();
    } else {
      dispatch(setAudioStatus('stopped'));
      if (this.audio) this.audio.pause();
      this.audio = null;
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
  const { media } = state;
  return {
    media,
  };
}

export default connect(mapStateToProps)(PlaybackControlsView);
