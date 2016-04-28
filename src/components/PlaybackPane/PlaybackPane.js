import React from 'react';
import classNames from 'classnames';

import './playbackpane.css';

export default React.createClass({

  displayName: 'PlaybackPane',

  propTypes: {
    children: React.PropTypes.array,
  },

  render() {
    const cx = classNames({
      'playback-pane': true,
      'dark-primary-color': true,
    });

    return (
      <div className={ cx }>
        <div className="bg" />
        { this.props.children }
      </div>
    );
  },
});
