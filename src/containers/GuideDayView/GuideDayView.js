import React from 'react';
import { connect } from 'react-redux';
import Tappable from 'react-tappable';
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import animateView from 'react-animated-views';

import { isAndroid } from 'utils/Device';

import GuidePane from 'components/GuidePane';
import Navbar from 'components/Navbar';
import GuideList from 'components/GuideList';

const GuideDayView = React.createClass({

  displayName: 'GuideDayView',

  propTypes: {
    guide: React.PropTypes.object,
    params: React.PropTypes.object,
    pop: React.PropTypes.func,
    push: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  handleBackButtonClick() {
    const { pop } = this.props;
    pop();
  },

  handleShowListItemClick(slug) {
    const { push } = this.props;
    const animation = isAndroid() ? 'popFade' : 'slideLeft';
    push(`/guide/show/${slug}`, animation);
  },

  render() {
    const {
      style,
      params: { day },
      guide: { program },
    } = this.props;
    const showKeys = program[day]
      ? Object.keys(program[day])
      : [];
    const shows = showKeys.map((show) => {
      const { slug, name, broadcasters } = program[day][show];
      const broadcastersDisplay = broadcasters
        ? `with ${broadcasters}`
        : '';
      const tappable = (
        <Tappable component="a" onTap={ () => this.handleShowListItemClick(slug) }>
          <div>{ name }</div>
          <div><small>{ broadcastersDisplay }</small></div>
        </Tappable>
      );
      return (
        <li key={ show }>
          { tappable }
        </li>
      );
    });

    return (
      <div className="page" style={ style }>
        <GuidePane>
          <Navbar>
            <Tappable className="button left" component="a" classBase="tappable"
              onTap={ this.handleBackButtonClick }
            >
              <MdArrowBack size="24" />
            </Tappable>
            <div className="title">{ day }</div>
          </Navbar>
          <GuideList className="content">
            { shows }
          </GuideList>
        </GuidePane>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(GuideDayView));
