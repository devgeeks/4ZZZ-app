import React from 'react';
import { connect } from 'react-redux';

import PlaybackControls from 'components/PlaybackControls';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';
import { setAudioDuration, setAudioStatus } from 'actions/audioActions';
import { throttle, hhmmss } from 'utils/AudioUtils';

const audioURL = 'http://stream.4zzzfm.org.au:789/;';
let audio;

const PlaybackControlsView = React.createClass({

  displayName: 'PlaybackControlsView',

  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    media: React.PropTypes.object,
  },

  // @TODO - How much of this could be moved to utils?
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
