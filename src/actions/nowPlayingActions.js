import utils from 'utils/4ZZZGuideUtils';

export const NOW_PLAYING_REQUESTED = 'NOW_PLAYING_REQUESTED';
export const NOW_PLAYING_RECEIVED = 'NOW_PLAYING_RECEIVED';

function nowPlayingRequested() {
  return {
    type: NOW_PLAYING_REQUESTED,
  };
}

function nowPlayingReceived(nowPlaying) {
  return {
    type: NOW_PLAYING_RECEIVED,
    nowPlaying,
  };
}

function shouldDetermineNowPlaying(state) {
  const { nowPlaying } = state;
  if (nowPlaying.searchPending) {
    return false;
  }
  return true;
}

function determineNowPlaying() {
  return (dispatch, getState) => {
    dispatch(nowPlayingRequested());
    const { guide } = getState();
    utils.determineNowPlaying(guide.shows)
      .then(nowPlaying => dispatch(nowPlayingReceived(nowPlaying)))
      .catch((error) => console.error(error));
  };
}

export function determineNowPlayingIfNeeded() {
  return (dispatch, getState) => {
    if (shouldDetermineNowPlaying(getState())) {
      return dispatch(determineNowPlaying());
    }
  };
}
