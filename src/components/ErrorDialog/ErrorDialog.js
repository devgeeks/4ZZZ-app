import React from 'react';
import classNames from 'classnames';

import './errordialog.css';

export default React.createClass({

  displayName: 'ErrorDialog',

  propTypes: {
    error: React.PropTypes.object,
  },

  render() {
    const { error } = this.props;
    const { displayed, message } = error;

    const cx = classNames({
      displayed,
      'error-dialog': true,
    });

    return (
      <div className={ cx }>
        <div className="title">Error</div>
        <div className="message">{ message }</div>
      </div>
    );
  },
});
