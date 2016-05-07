import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdEventNote from 'react-icons/lib/md/event-note';
import MdInfoOutline from 'react-icons/lib/md/info-outline';

import { determineNowPlayingIfNeeded } from 'actions/nowPlayingActions';

import animateView from 'react-animated-views';

//import { isAndroid } from 'utils/Device';

import NowPlaying from 'components/NowPlaying';
import PlaybackPane from 'components/PlaybackPane';
import Navbar from 'components/Navbar';

const PlayView = React.createClass({

  displayName: 'PlayView',

  propTypes: {
    audio: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    errorHandler: React.PropTypes.func,
    nowPlaying: React.PropTypes.object,
    push: React.PropTypes.func,
    store: React.PropTypes.object,
    guide: React.PropTypes.object,
    setAction: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  componentWillMount() {
    const { dispatch } = this.props;
    window.nowPlayingTimer = setInterval(() => {
      console.log('checking now playing');
      dispatch(determineNowPlayingIfNeeded());
    }, 10000); // In prod, maybe this should be like 1 second?
  },

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.guide.shows !== this.props.guide.shows) {
      dispatch(determineNowPlayingIfNeeded());
    }
  },

  componentWillUnmount() {
    clearInterval(window.nowPlayingTimer);
  },

  handleInfoButtonClick() {
    const { push } = this.props;
    push('/info', 'slideUp');
  },

  handleGuideButtonClick() {
    const { push } = this.props;
    push('/guide', 'slideUp');
  },

  render() {
    const { nowPlaying, style } = this.props;

    return (
      <div className="page" style={ style }>
        <PlaybackPane>
          <Navbar gradient>
            <Tappable className="button left" component="a" classBase="tappable"
              onTap={ this.handleInfoButtonClick }
            >
              <MdInfoOutline size="24" />
            </Tappable>
            <div className="title">Listen</div>
            <Tappable className="button right" component="a" classBase="tappable"
              onTap={ this.handleGuideButtonClick }
            >
              <MdEventNote size="24" />
            </Tappable>
          </Navbar>
          <NowPlaying nowPlaying={ nowPlaying } />
        </PlaybackPane>
      </div>
    );
  },
});

function mapStateToProps(state) {
  const { media, guide, nowPlaying } = state;
  return {
    media,
    guide,
    nowPlaying,
  };
}

export default animateView(connect(mapStateToProps)(PlayView));
