import React from 'react';

import PlaybackPane from 'components/PlaybackPane';
import PlaybackControls from 'components/PlaybackControls';
import NowPlaying from 'components/NowPlaying';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';

import GuideStore from 'stores/Guide';

export default React.createClass({

  displayName: 'PlayView',

  propTypes: {
    errorHandler: React.PropTypes.func,
    nowPlaying: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      isPending: false,
      isPlaying: false,
      mediaStream: null,
      nowPlaying: {},
    };
  },

  componentWillMount() {
    document.addEventListener('deviceready', () => {
      const mediaStream = this.createMediaStream();
      this.setState({
        mediaStream,
      });
    }, false);
    GuideStore.addChangeListener('nowPlaying', this.updateStateFromGuideStore);
    GuideStore.addChangeListener('error', this.updateErrorFromGuideStore);
  },

  componentWillUnmount() {
    const { mediaStream } = this.state();
    if (mediaStream) {
      mediaStream.stop();
      mediaStream.release();
    }
    GuideStore.removeChangeListener('nowPlaying', this.updateStateFromGuideStore);
    GuideStore.removeChangeListener('error', this.updateErrorFromGuideStore);
  },

  createMediaStream() {
    return new window.Media(
      'http://stream.4zzzfm.org.au:789/;',
      () => { console.log('media stream complete?'); },
      (error) => {
        console.log(this);
        console.error(error);
      },
      (status) => {
        console.log(status);
        switch (status) {
          case 2:
            console.log('playing');
            this.setState({
              isPaying: true,
              isPending: false,
            });
            break;
          case 4:
            console.log('stopped');
            this.setState({
              isPlaying: false,
              isPending: false,
            });
            break;
          default:
            // ...
        }
      });
  },

  updateStateFromGuideStore() {
    const guideState = GuideStore.getState();
    this.setState({
      nowPlaying: guideState.nowPlaying,
    });
  },

  updateErrorFromGuideStore() {
    const { error } = GuideStore.getState();
    // @TODO Error handling needs UI
    const { errorHandler } = this.props;
    errorHandler(error);
  },

  // At the moment this just simulates for showing the UI/UX
  //  of the controls
  handlePlaybackControlAction(type) {
    const { mediaStream } = this.state;
    if (!mediaStream) {
      console.error('No media yet. No deviceready?');
      return;
    }
    switch (type) {
      case 'play':
        console.log('pending');
        mediaStream.play();
        this.setState({
          isPlaying: true,
          isPending: true,
        });
        break;
      case 'pending':
      case 'stop':
      default:
        console.log('stopping');
        mediaStream.stop();
        this.setState({
          isPending: false,
          isPlaying: false,
        });
    }
  },

  render() {
    const { isPending, isPlaying, nowPlaying } = this.state;

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
          <span className="playback-duration">00:00:00</span>
        </StopButton>
      );
    } else {
      controls = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    }

    return (
      <PlaybackPane>
        <NowPlaying nowPlaying={ nowPlaying } />
        <PlaybackControls isPlaying={ isPlaying }>
          { controls }
        </PlaybackControls>
      </PlaybackPane>
    );
  },
});
