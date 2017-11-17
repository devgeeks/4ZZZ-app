import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MDClose from 'react-icons/lib/md/close';

import animateView from 'react-animated-views';

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

  handleAboutLinkClick(e) {
    const { target: { href: link } } = e;
    e.preventDefault();
    const { cordova } = window || { cordova: null };
    const { InAppBrowser: iap } = cordova || { InAppBrowser: null };
    if (iap) {
      iap.open(
        link,
        '_system'
      );
    } else {
      window.location = link;
      console.warn('InAppBrowser not supported');
    }
  },

  render() {
    const { style } = this.props;

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <div className="title">Info</div>
            <Tappable
              className="button right" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MDClose size="24" />
            </Tappable>
          </Navbar>
          <div className="content">
            <h2>About the 4ZZZ App</h2>
            <p>This app was created with love by me, Tommy-Carlos Williams
              (aka: <a
                onClick={ this.handleAboutLinkClick }
                href="https://twitter.com/theRealDevgeeks"
              >devgeeks</a>).
            Even though no longer living in Brisbane, I am a huge fan of
            4ZZZ. I wrote the original 4ZZZ app many years ago when I was
            first getting into mobile app development but I sadly did not
            keep it as up to date as I should. It&#39;s now finally
            getting the attention it deserves.</p>
            <h2>Open Source</h2>
            <p>In keeping with the spirit of community radio, this app is now
            open source, and it also relies on many other open source
              projects. The source for this app can be found <a
                onClick={ this.handleAboutLinkClick }
                href="https://github.com/devgeeks/4ZZZ-app"
              >on GitHub</a></p>
            <p>I am always happy to hear feedback about the app and
            suggestions of how to make it better.</p>
            <h2>Thanks</h2>
            <p>Huge thanks to Michelle Brown, long-time friend and station
              manager for many years. Thanks for letting me do this back when
              I had never released an app before. It started me down a road
              I could not have imagined at the time.
            </p>
          </div>
        </GuidePane>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(InfoView));
