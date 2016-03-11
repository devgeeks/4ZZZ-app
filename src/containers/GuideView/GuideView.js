import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdClose from 'react-icons/lib/md/close';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const GuideView = React.createClass({

  displayName: 'GuideView',

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  handleGuideButtonClick() {
    const { router } = this.context;
    router.push('/listen');
  },

  render() {
    return (
      <GuidePane>
        <Navbar>
          <div className="title">Program Guide</div>
          <Tappable className="button right" component="a" classBase="tappable"
            onTap={ this.handleGuideButtonClick }
          >
            <MdClose size="24" />
          </Tappable>
        </Navbar>
      </GuidePane>
    );
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
