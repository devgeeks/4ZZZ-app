import React from 'react';
import classNames from 'classnames';

import './guidepane.css';

const GuidePane = (props) => {
  const cx = classNames({
    'guide-pane': true,
    'primary-text-color': true,
  });

  return (
    <div className={ cx }>
      { props.children }
    </div>
  );
};

GuidePane.displayName = 'GuidePane';

GuidePane.propTypes = {
  children: React.PropTypes.array,
};

export default GuidePane;
