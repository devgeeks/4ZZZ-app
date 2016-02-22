import React from 'react';
import classNames from 'classnames';

import './nowplaying.css';

export default React.createClass({

  displayName: 'NowPlaying',

  propTypes: {
    nowPlaying: React.PropTypes.object,
  },

  render() {
    let { nowPlaying } = this.props;
    if (!nowPlaying.name) {
      nowPlaying = {
        name: '',
        timeslot: '',
        broadcasters: '',
      };
    }

    const cx = classNames({
      'now-playing': true,
    });

    return (
      <div className={ cx }>
        <div className="show-name">{ nowPlaying.name }</div>
        <div className="show-time">
          { nowPlaying.timeslot }
        </div>
        <div className="show-broadcasters">
          { nowPlaying.broadcasters }
        </div>
      </div>
    );
  },
});
