import React from 'react';
import classNames from 'classnames';

import './guidelist.css';

export default React.createClass({

  displayName: 'GuideList',

  propTypes: {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  },

  render() {
    const cx = classNames({
      'guide-list': true,
      'divider-color': true,
    });

    return (
      <ul className={ cx }>
        { this.props.children }
      </ul>
    );
  },
});
