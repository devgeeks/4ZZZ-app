import React from 'react';
import classNames from 'classnames';

import './errordialog.css';

export default React.createClass({

  displayName: 'ErrorDialog',

  render() {
    const cx = classNames({
      'error-dialog': true,
    });

    return (
      <div className={ cx } />
    );
  },
});
