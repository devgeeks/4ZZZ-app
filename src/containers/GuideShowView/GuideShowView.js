import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import moment from 'moment-timezone';

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

  openExternalLink(link) {
    const { cordova } = window || { cordova: null };
    const { InAppBrowser: iap } = cordova || { InAppBrowser: null };
    if (iap) {
      iap.open(
        link,
        '_blank',
        'enableViewportScale=yes'
      );
    } else {
      window.location = link;
      console.warn('InAppBrowser not supported');
    }
  },

  render() {
    const {
      style,
      guide: { showsBySlug },
      params: { show },
    } = this.props;
    const currentShow = showsBySlug[show];
    console.log(currentShow);
    const title = currentShow && currentShow.name || show;
    const time = currentShow &&
      moment(currentShow.localTime).format('dddd\\s \\at h:mma') || '';

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <Tappable
              className="button left" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MdArrowBack size="24" />
            </Tappable>
            <div className="title">{ title }</div>
          </Navbar>
          <div className="content">
            <div>{ currentShow && currentShow.name }</div>
            <div>{ currentShow && currentShow.broadcasters }</div>
            <Tappable
              className="external-link" component="a" classBase="tappable"
              onTap={ () => this.openExternalLink(currentShow.link) }
            >
              { currentShow && currentShow.link }
            </Tappable>
            <div>{ time }</div>
          </div>
        </GuidePane>
      </div>
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

export default animateView(connect(mapStateToProps)(GuideShowView));
