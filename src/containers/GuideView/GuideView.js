import React from 'react';
import { connect } from 'react-redux';

const GuideView = React.createClass({

  displayName: 'GuideView',

  propTypes: {
    history: React.PropTypes.object,
  },

  render() {
    return (
      <div />
    );
  },
});

function mapStateToProps(state) {
  const { guide } = state;
  return {
    guide,
  };
}

export default connect(mapStateToProps)(GuideView);
