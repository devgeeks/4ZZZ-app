export const AUDIO_OBJECT_CREATED = 'AUDIO_OBJECT_CREATED';
export const AUDIO_OBJECT_DESTROYED = 'AUDIO_OBJECT_DESTROYED';
export const SET_AUDIO_STATUS = 'SET_AUDIO_STATUS';
export const SET_AUDIO_DURATION = 'SET_AUDIO_DURATION';
export const PLAY_AUDIO = 'PLAY_AUDIO';
export const STOP_AUDIO = 'STOP_AUDIO';

export function setAudioDuration(duration) {
  return {
    type: SET_AUDIO_DURATION,
    duration,
  };
}

export function setAudioStatus(status) {
  return {
    type: SET_AUDIO_STATUS,
    isPending: (status === 'pending'),
    isPlaying: (status !== 'stopped'),
    status,
  };
}

export function createAudio(audio) {
  return {
    type: AUDIO_OBJECT_CREATED,
    audio,
  };
}

export function destroyAudio(audio) {
  return {
    type: AUDIO_OBJECT_DESTROYED,
    audio,
  };
}

function audioCanBeStopped(state) {
  return !!state.isPlaying;
}

function audioCanBePlayed(state) {
  if (!!state.isPlaying || !!state.isPending) {
    return false;
  }
  return true;
}

export function playAudio() {
  return (dispatch, getState) => {
    if (audioCanBePlayed(getState())) {
      return {
        type: PLAY_AUDIO,
      };
    }
  };
}

export function stopAudio() {
  return (dispatch, getState) => {
    if (audioCanBeStopped(getState())) {
      dispatch(setAudioStatus('stopped'));
      return {
        type: STOP_AUDIO,
      };
    }
  };
}
