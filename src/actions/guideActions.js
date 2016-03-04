import fetch from 'isomorphic-fetch';
import moment from 'moment-timezone';

import utils from 'utils/4ZZZGuideUtils';

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

function guideDataReceived() {
  return {
    type: GUIDE_DATA_RECEIVED,
  };
}

function guideDataError(error) {
  return {
    type: GUIDE_DATA_ERROR,
    error,
  };
}

function guideParseError(error) {
  return {
    type: GUIDE_PARSING_ERROR,
    error,
  };
}

function receiveGuide(guide) {
  return {
    type: GUIDE_DATA_PARSED,
    guide,
  };
}

function parseGuideData(data) {
  return (dispatch) => {
    dispatch(guideDataReceived);
    utils.parseGuideData(data)
      .then(guide => dispatch(receiveGuide(guide)))
      .catch(err => dispatch(guideParseError(err)));
  };
}

function fetchGuideData() {
  return (dispatch, getState) => {
    const { guideDataUrl } = getState();
    dispatch(requestGuideData());
    return fetch(guideDataUrl)
      .then(response => response.json())
      .then((json) => dispatch(parseGuideData(json)))
      .catch(error => dispatch(guideDataError(error)));
  };
}

function shouldFetchGuideData(state) {
  const { guide } = state;
  const now = moment();
  const fetched = moment(guide.fetched || '');
  const expires = fetched.isValid() ? fetched.clone().add(1, 'day') : now;
  // Don't fetch if we are already, and don't fetch if we have fetched in the
  //  last 24 hours
  if (now < expires || guide.isFetching) {
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
