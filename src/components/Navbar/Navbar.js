import React from 'react';
import classNames from 'classnames';

import './navbar.css';

const Navbar = (props) => {
  const cx = classNames({
    navbar: true,
    'very-dark-primary-color': true,
    gradient: props.gradient,
  });

  return (
    <div className={ cx } style={ props.style }>
      { props.children }
    </div>
  );
};

Navbar.displayName = 'Navbar';

Navbar.propTypes = {
  children: React.PropTypes.array,
  gradient: React.PropTypes.bool,
  style: React.PropTypes.object,
};

export default Navbar;
