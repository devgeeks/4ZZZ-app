import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdStop from 'react-icons/lib/md/stop';

import './stopbutton.css';

export default React.createClass({

  displayName: 'StopButton',

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
      'stop-button': true,
    });

    return (
      <div>
        <Tappable className={ cx } component="a" classBase="tappable"
          onTap={ this.clickHandler }
        >
          <MdStop size="40" />
        </Tappable>
        { this.props.children }
      </div>
    );
  },
});
