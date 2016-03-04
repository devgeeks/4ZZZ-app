import React from 'react';
import classNames from 'classnames';

import './playbackcontrols.css';

export default React.createClass({

  displayName: 'PlaybackControls',

  propTypes: {
    children: React.PropTypes.any,
    isPlaying: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      offline: false,
    };
  },

  componentDidMount() {
    //window.Offline.on('down', () => {
      //this.setState({
        //offline: true,
      //});
    //});
    //window.Offline.on('confirmed-up', () => {
      //this.setState({
        //offline: false,
      //});
    //});
  },

  render() {
    const { isPlaying } = this.props;
    const { offline } = this.state;

    const cx = classNames({
      'playback-controls': true,
      'is-playing': isPlaying,
      offline: !!offline,
    });
    return (
      <div className={ cx }>
        { this.props.children }
      </div>
    );
  },
});
