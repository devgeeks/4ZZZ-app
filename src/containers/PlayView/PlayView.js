import React from 'react';

import PlaybackPane from 'components/PlaybackPane';
import PlaybackControls from 'components/PlaybackControls';
import NowPlaying from 'components/NowPlaying';
import PlayButton from 'components/PlayButton';
import StopButton from 'components/StopButton';
import PendingButton from 'components/PendingButton';

export default React.createClass({

  displayName: 'PlayView',

  propTypes: {
    nowPlaying: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      isPending: false,
      isPlaying: false,
      nowPlaying: {},
    };
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
    const { nowPlaying } = this.props;
    const { isPending, isPlaying } = this.state;

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
