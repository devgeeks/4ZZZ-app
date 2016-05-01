import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdClose from 'react-icons/lib/md/close';

import animateView from 'react-animated-views';

import { isAndroid } from 'utils/Device';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const GuideView = React.createClass({

  displayName: 'GuideView',

  propTypes: {
    children: React.PropTypes.object,
    push: React.PropTypes.func,
    pop: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  handleBackButtonClick() {
    const { pop } = this.props;
    pop('slideUp'); // I don't want to have to do this...
  },

  handleNextButtonClick() {
    const { push } = this.props;
    const animation = isAndroid() ? 'popFade' : 'slideLeft';
    push('/guide/day/Monday', animation);
  },

  render() {
    const { style } = this.props;

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <div className="title">Program</div>
            <Tappable className="button right" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MdClose size="24" />
            </Tappable>
          </Navbar>
          <div className="content">
            list of days...
            <div>
              <Tappable className="button" component="a" classBase="tappable"
                onTap={ this.handleNextButtonClick }
              >
                Animate to next page
              </Tappable>
            </div>
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

export default animateView(connect(mapStateToProps)(GuideView));
