import React from 'react';
import classNames from 'classnames';

import './errordialog.css';

const ErrorDialog = (props) => {
  const { error } = props;
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
};

ErrorDialog.displayName = 'ErrorDialog';

ErrorDialog.propTypes = {
  error: React.PropTypes.object,
};

export default ErrorDialog;
