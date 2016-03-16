import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const GuideDayView = React.createClass({

  displayName: 'GuideDayView',

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  handleBackButtonClick(e) {
    const { router } = this.context;
    e.preventDefault();
    router.goBack();
  },

  render() {
    return (<GuidePane>
      <Navbar>
        <Tappable className="button left" component="a" classBase="tappable"
          onTap={ this.handleBackButtonClick }
        >
          <MdArrowBack size="24" />
        </Tappable>
        <div className="title">Day</div>
      </Navbar>
      <div className="content">list of shows...</div>
    </GuidePane>);
  },
});

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(GuideDayView);
