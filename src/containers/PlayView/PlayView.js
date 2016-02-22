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
      nowPlaying: {},
    };
  },

  componentWillMount() {
    GuideStore.addChangeListener('nowPlaying', this.updateStateFromGuideStore);
    GuideStore.addChangeListener('error', this.updateErrorFromGuideStore);
  },

  componentWillUnmount() {
    GuideStore.removeChangeListener('nowPlaying', this.updateStateFromGuideStore);
    GuideStore.removeChangeListener('error', this.updateErrorFromGuideStore);
  },

  updateStateFromGuideStore() {
    const guideState = GuideStore.getState();
    this.setState({
      nowPlaying: guideState.nowPlaying,
    });
    console.log('state updated');
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
    switch (type) {
      case 'play':
        console.log('pending');
        this.setState({
          isPlaying: true,
          isPending: true,
        });
        setTimeout(() => {
          if (this.state.isPlaying) {
            console.log('playing');
            this.setState({
              isPlaying: true,
              isPending: false,
            });
          }
        }, 2000);
        break;
      case 'pending':
      case 'stop':
      default:
        console.log('stopping');
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
