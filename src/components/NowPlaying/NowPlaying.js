import React from 'react';
import classNames from 'classnames';

import './nowplaying.css';

export default React.createClass({

  displayName: 'NowPlaying',

  propTypes: {
    nowPlaying: React.PropTypes.object,
  },

  render() {
    const { nowPlaying } = this.props;
    let { show } = nowPlaying;
    if (!show.name) {
      show = {
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
        <div className="show-name">{ show.name }</div>
        <div className="show-time">
          { show.timeslot }
        </div>
        <div className="show-broadcasters">
          { show.broadcasters }
        </div>
      </div>
    );
  },
});
