import React from 'react';
import Tappable from 'react-tappable';
import MdEventNote from 'react-icons/lib/md/event-note';
import MdInfoOutline from 'react-icons/lib/md/info-outline';
import classNames from 'classnames';

import './navbar.css';

export default React.createClass({

  displayName: 'Navbar',

  render() {
    const cx = classNames({
      navbar: true,
      'very-dark-primary-color': true,
    });

    return (
      <div className={ cx }>
        <Tappable className="button left" component="a" classBase="tappable">
          <MdInfoOutline size="24" />
        </Tappable>
        <div className="title">Listen</div>
        <Tappable className="button right" component="a" classBase="tappable">
          <MdEventNote size="24" />
        </Tappable>
      </div>
    );
  },
});
