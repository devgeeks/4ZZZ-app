import React from 'react';
import classNames from 'classnames';

import './playbackcontrols.css';

export default React.createClass({

  displayName: 'PlaybackControls',

  propTypes: {
    children: React.PropTypes.object,
    isPlaying: React.PropTypes.bool,
  },

  render() {
    const { isPlaying } = this.props;

    const cx = classNames({
      'playback-controls': true,
      'is-playing': isPlaying,
    });
    return (
      <div className={ cx }>
        { this.props.children }
      </div>
    );
  },
});
