export const AUDIO_OBJECT_CREATED = 'AUDIO_OBJECT_CREATED';
export const AUDIO_OBJECT_DESTROYED = 'AUDIO_OBJECT_DESTROYED';
export const SET_AUDIO_STATUS = 'SET_AUDIO_STATUS';
export const PLAY_AUDIO = 'PLAY_AUDIO';
export const STOP_AUDIO = 'STOP_AUDIO';

export function stopAudio() {
  return {
    type: STOP_AUDIO,
  };
}

export function setAudioStatus(status) {
  return {
    type: SET_AUDIO_STATUS,
    status,
  };
}

export function createAudio() {
  return {
    type: AUDIO_OBJECT_CREATED,
  };
}

export function destroyAudio() {
  return {
    type: AUDIO_OBJECT_DESTROYED,
  };
}

function audioCanBePlayed(state) {
  if (!!state.isPlaying || !!state.isPending) {
    return false;
  }
  return true;
}

export function playAudio() {
  return (dispatch, setState) => {
    if (audioCanBePlayed(setState())) {
      dispatch(setAudioStatus('pending'));
      return {
        type: PLAY_AUDIO,
      };
    }
  };
}
