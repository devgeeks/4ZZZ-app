import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MDClose from 'react-icons/lib/md/close';

import animateView from 'containers/react-animated-views';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const InfoView = React.createClass({

  displayName: 'InfoView',

  propTypes: {
    style: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  handleBackButtonClick(e) {
    const { router } = this.context;
    e.preventDefault();
    router.goBack();
  },

  render() {
    const { style } = this.props;

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <div className="title">Info</div>
            <Tappable className="button right" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MDClose size="24" />
            </Tappable>
          </Navbar>
          <div className="content">Info about the app...</div>
        </GuidePane>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(InfoView));
