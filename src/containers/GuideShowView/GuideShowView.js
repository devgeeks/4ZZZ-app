import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import animateView from 'react-animated-views';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

//import { isAndroid } from 'utils/Device';

const GuideShowView = React.createClass({

  displayName: 'GuideShowView',

  propTypes: {
    guide: React.PropTypes.object,
    params: React.PropTypes.object,
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
    const {
      style,
      guide: { showsBySlug },
      params: { show },
    } = this.props;
    const currentShow = showsBySlug[show];
    const title = currentShow.name || show;

    return (
      <div className="page" style={ style}>
        <GuidePane>
          <Navbar>
            <Tappable className="button left" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MdArrowBack size="24" />
            </Tappable>
            <div className="title">{ title }</div>
          </Navbar>
          <div className="content">
            <div>{ currentShow && currentShow.name }</div>
            <div>{ currentShow && currentShow.broadcasters }</div>
          </div>
        </GuidePane>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(GuideShowView));
