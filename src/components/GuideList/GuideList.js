import React from 'react';
import classNames from 'classnames';

import './guidelist.css';

const GuideList = (props) => {
  const cx = classNames({
    'guide-list': true,
    'divider-color': true,
  });

  return (
    <ul className={ cx }>
      { props.children }
    </ul>
  );
};

GuideList.displayName = 'GuideList';

GuideList.propTypes = {
  children: React.PropTypes.any,
};

export default GuideList;
