import fetch from 'isomorphic-fetch';
import moment from 'moment-timezone';

// Export the constants for these actions
export const SET_GUIDE_DATA_URL = 'SET_GUIDE_DATA_URL';
export const SET_GUIDE_DATA = 'SET_GUIDE_DATA';
export const GUIDE_DATA_REQUESTED = 'GUIDE_DATA_REQUESTED';
export const GUIDE_DATA_RECEIVED = 'GUIDE_DATA_RECEIVED';
export const GUIDE_DATA_ERROR = 'GUIDE_DATA_ERROR';
export const GUIDE_DATA_PARSED = 'GUIDE_DATA_PARSED';
export const GUIDE_PARSING_ERROR = 'GUIDE_PARSING_ERROR';

export function setGuideDataUrl(url) {
  return {
    type: SET_GUIDE_DATA_URL,
    url,
  };
}

export function setGuideData(data) {
  return {
    type: SET_GUIDE_DATA,
    data,
  };
}

export function requestGuideData() {
  return {
    type: GUIDE_DATA_REQUESTED,
  };
}

function receiveGuideData(data) {
  return {
    type: GUIDE_DATA_RECEIVED,
    data,
  };
}

function guideDataError(error) {
  return {
    type: GUIDE_DATA_ERROR,
    error,
  };
}

function fetchGuideData() {
  return (dispatch, getState) => {
    const { guideDataUrl } = getState();
    dispatch(requestGuideData());
    return fetch(guideDataUrl)
      .then(response => response.json())
      .then(json => dispatch(receiveGuideData(json)))
      .catch(error => dispatch(guideDataError(error)));
  };
}

function shouldFetchGuideData(state) {
  const { guideData } = state;
  const now = moment();
  const fetched = moment(guideData.fetched || '');
  const expires = fetched.isValid() ? fetched.clone().add(1, 'day') : now;
  if (now < expires || guideData.isFetching) {
    return false;
  }
  return true;
}

export function fetchGuideDataIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchGuideData(getState())) {
      return dispatch(fetchGuideData());
    }
  };
}
