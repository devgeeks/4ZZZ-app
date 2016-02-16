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

    let controls = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    if (isPlaying && isPending) {
      controls = <PendingButton handleClick={ this.handlePlaybackControlAction } />;
    } else if (isPlaying) {
      controls = (<StopButton handleClick={ this.handlePlaybackControlAction }>
                  <span>00:00:00</span>
                 </StopButton>);
    } else {
      controls = <PlayButton handleClick={ this.handlePlaybackControlAction } />;
    }

    return (
      <PlaybackPanel>
        <NowPlaying nowPlaying={ nowPlaying } />
        <PlaybackControls isPlaying={ isPlaying }>
          { controls }
        </PlaybackControls>
      </PlaybackPanel>
    );
  },
});
