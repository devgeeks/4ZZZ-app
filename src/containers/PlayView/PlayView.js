import React from 'react';

import PlaybackPanel from '../../components/PlaybackPanel';
import PlaybackControls from '../../components/PlaybackControls';
import NowPlaying from '../../components/NowPlaying';
import PlayButton from '../../components/PlayButton';
import StopButton from '../../components/StopButton';
import PendingButton from '../../components/PendingButton';

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

  handlePlaybackControlAction(type) {
    let tmpTimer;
    switch (type) {
      case 'play':
        console.log('pending');
        this.setState({
          isPlaying: true,
          isPending: true,
        });
        tmpTimer = setTimeout(() => {
          console.log('playing');
          this.setState({
            isPlaying: true,
            isPending: false,
          });
        }, 2000);
        break;
      case 'pending':
      case 'stop':
      default:
        console.log('stopping');
        clearTimeout(tmpTimer);
        this.setState({
          isPending: false,
          isPlaying: false,
        });
    }
  },

  render() {
    const { nowPlaying } = this.props;
    const { isPending, isPlaying } = this.state;

    let button = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    if (isPlaying && isPending) {
      button = <PendingButton handleClick={ this.handlePlaybackControlAction } />;
    } else if (isPlaying) {
      button = <StopButton handleClick={ this.handlePlaybackControlAction } />;
    } else {
      button = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    }

    return (
      <PlaybackPanel>
        <NowPlaying nowPlaying={ nowPlaying } />
        <PlaybackControls isPlaying={ isPlaying }>
          { button }
        </PlaybackControls>
      </PlaybackPanel>
    );
  },
});
