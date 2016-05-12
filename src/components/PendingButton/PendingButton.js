import React from 'react';
import classNames from 'classnames';
import FaSpinner from 'react-icons/lib/fa/circle-o-notch';
import Tappable from 'react-tappable';

import './pendingbutton.css';

const PendingButton = (props) => {
  const { children, handleClick } = props;
  const cx = classNames({
    'pending-button': true,
  });

  return (
    <div>
      <Tappable
        className={ cx } component="a" classBase="tappable"
        onTap={ () => handleClick('stop') }
      >
        <FaSpinner size="32" />
      </Tappable>
      { children }
    </div>
  );
};

PendingButton.displayName = 'PendingButton';

PendingButton.propTypes = {
  children: React.PropTypes.any,
  handleClick: React.PropTypes.func.isRequired,
};

export default PendingButton;
