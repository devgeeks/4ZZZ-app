import React from 'react';
import classNames from 'classnames';

import './nowplaying.css';

export default React.createClass({

  displayName: 'NowPlaying',

  render() {
    const cx = classNames({
      'now-playing': true,
    });

    return (
      <div className={ cx }>
        <div>This will display</div>
        <div>the currently playing</div>
        <div>show</div>
      </div>
    );
  },
});
