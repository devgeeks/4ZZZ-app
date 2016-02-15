import React from 'react';
import classNames from 'classnames';

import './playbackpanel.css';

export default React.createClass({

  displayName: 'PlaybackPanel',

  propTypes: {
    children: React.PropTypes.array,
  },

  render() {
    const cx = classNames({
      'playback-panel': true,
    });

    return (
      <div className={ cx }>
        { this.props.children }
      </div>
    );
  },
});
