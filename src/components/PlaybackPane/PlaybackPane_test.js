import React from 'react';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';

import PlaybackPane from './PlaybackPane';

const props = {};

function setup(localProps = props) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<PlaybackPane {...localProps} />);
  const output = renderer.getRenderOutput();

  return {
    localProps,
    output,
    renderer,
  };
}

describe('PlaybackPane component', () => {
  it('should render correctly', () => {
    const { output } = setup();
    expect(output.type).toBe('div');
    expect(output.props.className).toBe('playback-pane');
  });

  it('should render its children correctly', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <PlaybackPane { ...props }>
        <span>My child</span>
      </PlaybackPane>
    );
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toBe(2);
    const [div, span] = output.props.children;
    expect(div.type).toBe('div');
    expect(div.props.className).toBe('bg');
    expect(span.type).toBe('span');
  });
});
