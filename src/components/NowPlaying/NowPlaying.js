import React from 'react';
import classNames from 'classnames';

import './nowplaying.css';

const NowPlaying = (props) => {
  const { nowPlaying } = props;
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
    'text-primary-color': true,
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
};

NowPlaying.displayName = 'NowPlaying';

NowPlaying.propTypes = {
  nowPlaying: React.PropTypes.object,
};

export default NowPlaying;
