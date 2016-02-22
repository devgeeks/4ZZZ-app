import React from 'react';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';

import NowPlaying from './NowPlaying';

const props = {
  nowPlaying: {
    name: 'Neon Meate Dream of an Octafish',
    timeslot: 'Mondays, 3:00am - 7:00am',
    broadcasters: 'with RAK',
  },
};

function setup(localProps = props) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<NowPlaying {...localProps} />);
  const output = renderer.getRenderOutput();

  return {
    localProps,
    output,
    renderer,
  };
}

describe('NowPlaying component', () => {
  it('should render correctly', () => {
    const { output } = setup();
    expect(output.type).toBe('div');
    expect(output.props.className).toBe('now-playing');
  });
  it('should render its children correctly', () => {
    const { output } = setup();
    expect(output.props.children[0].props.children).toBe(props.nowPlaying.name);
    expect(output.props.children[1].props.children).toBe(props.nowPlaying.timeslot);
    expect(output.props.children[2].props.children).toBe(props.nowPlaying.broadcasters);
    expect(output.props.children.length).toBe(3);
  });
});
