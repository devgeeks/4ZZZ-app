import React from 'react';
import classNames from 'classnames';

import './guidepane.css';

export default React.createClass({

  displayName: 'GuidePane',

  propTypes: {
    children: React.PropTypes.object,
  },

  render() {
    const cx = classNames({
      'guide-pane': true,
    });

    return (
      <div className={ cx }>
        { this.props.children }
      </div>
    );
  },
});
