import React from 'react';
import classNames from 'classnames';

import './playbackpane.css';

const PlaybackPane = (props) => {
  const { children } = props;
  const cx = classNames({
    'playback-pane': true,
    'dark-primary-color': true,
  });

  return (
    <div className={ cx }>
      <div className="bg" />
      { children }
    </div>
  );
};

PlaybackPane.displayName = 'PlaybackPane';

PlaybackPane.propTypes = {
  children: React.PropTypes.array,
};

export default PlaybackPane;
