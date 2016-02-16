import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdPlayArrow from 'react-icons/lib/md/play-arrow';

import './playbutton.css';

export default React.createClass({

  displayName: 'PlayButton',

  propTypes: {
    handleClick: React.PropTypes.func.isRequired,
  },

  clickHandler() {
    const { handleClick } = this.props;
    handleClick('play');
  },

  render() {
    const cx = classNames({
      'play-button': true,
    });

    return (
        <div>
          <Tappable className={ cx } component="a" classBase="tappable"
            onTap={ this.clickHandler }
          >
            <MdPlayArrow size="40" />
          </Tappable>
        </div>
    );
  },
});
