import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdPlayArrow from 'react-icons/lib/md/play-arrow';

import './playbutton.css';

const PlayButton = (props) => {
  const { handleClick } = props;
  const cx = classNames({
    'play-button': true,
  });

  return (
    <div>
      <Tappable
        className={ cx } component="a" classBase="tappable"
        onTap={ () => handleClick('play') }
      >
        <MdPlayArrow size="40" />
      </Tappable>
    </div>
  );
};

PlayButton.displayName = 'PlayButton';

PlayButton.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
};

export default PlayButton;
