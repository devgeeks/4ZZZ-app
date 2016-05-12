import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdStop from 'react-icons/lib/md/stop';

import './stopbutton.css';

const StopButton = (props) => {
  const { children, handleClick } = props;
  const cx = classNames({
    'stop-button': true,
  });

  return (
    <div>
      <Tappable
        className={ cx } component="a" classBase="tappable"
        onTap={ () => handleClick('stop') }
      >
        <MdStop size="40" />
      </Tappable>
      { children }
    </div>
  );
};

StopButton.displayName = 'StopButton';

StopButton.propTypes = {
  children: React.PropTypes.any,
  handleClick: React.PropTypes.func.isRequired,
};

export default StopButton;
