import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import animateView from 'react-animated-views';

import { isAndroid } from 'utils/Device';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';

const GuideDayView = React.createClass({

  displayName: 'GuideDayView',

  propTypes: {
    pop: React.PropTypes.func,
    push: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  handleBackButtonClick() {
    const { pop } = this.props;
    pop();
  },

  handleNextButtonClick() {
    const { push } = this.props;
    const animation = isAndroid() ? 'popFade' : 'slideLeft';
    push('/guide/show/the-punk-show', animation);
  },

  render() {
    const { style } = this.props;

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <Tappable className="button left" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MdArrowBack size="24" />
            </Tappable>
            <div className="title">Day</div>
          </Navbar>
          <div className="content">
            list of shows...
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
  return { ...state };
}

export default animateView(connect(mapStateToProps)(GuideDayView));
