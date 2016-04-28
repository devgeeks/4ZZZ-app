import React from 'react';
import classNames from 'classnames';

import './navbar.css';

export default React.createClass({

  displayName: 'Navbar',

  propTypes: {
    children: React.PropTypes.array,
    gradient: React.PropTypes.bool,
    style: React.PropTypes.object,
  },

  render() {
    const cx = classNames({
      navbar: true,
      'very-dark-primary-color': true,
      gradient: this.props.gradient,
    });

    return (
      <div className={ cx } style={ this.props.style }>
        { this.props.children }
      </div>
    );
  },
});
