import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const GuideView = React.createClass({

  displayName: 'GuideView',

  propTypes: {
    children: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  handleBackButtonClick() {
    const { router } = this.context;
    router.goBack();
  },

  render() {
    const days = (<GuidePane>
      <Navbar>
        <Tappable className="button left" component="a" classBase="tappable"
          onTap={ this.handleBackButtonClick }
        >
          <MdArrowBack size="24" />
        </Tappable>
        <div className="title">Program</div>
      </Navbar>
      <div className="content">list of days...</div>
    </GuidePane>);
    if (this.props.children) {
      return React.cloneElement(this.props.children || <div/>, this.props);
    }
    return days;
  },
});

function mapStateToProps(state) {
  const { guide, nowPlaying } = state;
  return {
    guide,
    nowPlaying,
  };
}

export default connect(mapStateToProps)(GuideView);