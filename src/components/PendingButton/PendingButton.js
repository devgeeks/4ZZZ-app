import React from 'react';
import classNames from 'classnames';
import FaSpinner from 'react-icons/lib/fa/circle-o-notch';
import Tappable from 'react-tappable';

import './pendingbutton.css';

export default React.createClass({

  displayName: 'PendingButton',

  propTypes: {
    children: React.PropTypes.any,
    handleClick: React.PropTypes.func.isRequired,
  },

  clickHandler() {
    const { handleClick } = this.props;
    handleClick('stop');
  },

  render() {
    const cx = classNames({
      'pending-button': true,
    });

    return (
      <div>
        <Tappable className={ cx } component="a" classBase="tappable"
          onTap={ this.clickHandler }
        >
          <FaSpinner size="32" />
        </Tappable>
        { this.props.children }
      </div>
    );
  },
});
