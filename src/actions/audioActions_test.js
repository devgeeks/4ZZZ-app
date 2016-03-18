import expect from 'expect';

import * as actions from './audioActions';

describe('audio actions', () => {
  it('should create an action to set the playback duration', () => {
    const duration = '13:13';
    const expectedAction = {
      type: actions.SET_AUDIO_DURATION,
      duration,
    };
    expect(actions.setAudioDuration(duration)).toEqual(expectedAction);
  });
  it('should create the correct action to set the playback status', () => {
    const expectedPendingAction = {
      type: actions.SET_AUDIO_STATUS,
      isPending: true,
      isPlaying: true,
      status: 'pending',
    };
    const expectedStoppedAction = {
      type: actions.SET_AUDIO_STATUS,
      isPending: false,
      isPlaying: false,
      status: 'stopped',
    };
    const expectedPlayingAction = {
      type: actions.SET_AUDIO_STATUS,
      isPending: false,
      isPlaying: true,
      status: 'playing',
    };
    expect(actions.setAudioStatus('pending')).toEqual(expectedPendingAction);
    expect(actions.setAudioStatus('stopped')).toEqual(expectedStoppedAction);
    expect(actions.setAudioStatus('playing')).toEqual(expectedPlayingAction);
  });
});
