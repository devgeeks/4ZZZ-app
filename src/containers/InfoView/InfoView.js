import React from 'react';
import { connect } from 'react-redux';

const GuideView = React.createClass({

  displayName: 'GuideView',

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div />
    );
  },
});

function mapStateToProps(state) {
  return {
    ...state,
  };
}

export default connect(mapStateToProps)(GuideView);
