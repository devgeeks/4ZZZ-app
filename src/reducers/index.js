import moment from 'moment-timezone';

import { combineReducers } from 'redux';
import {
  SET_GUIDE_DATA_URL, SET_GUIDE_DATA, GUIDE_DATA_REQUESTED,
  GUIDE_DATA_RECEIVED, GUIDE_DATA_ERROR, GUIDE_DATA_PARSED,
  GUIDE_PARSING_ERROR,
} from 'actions/guideActions';
import {
  NOW_PLAYING_REQUESTED, NOW_PLAYING_RECEIVED,
} from 'actions/nowPlayingActions';

let url = 'http://4zzzfm.org.au:41021';
if (process.env.NODE_ENV !== 'production') {
  url = 'data.json';
}

function guideDataUrl(state = url, action) {
  switch (action.type) {
    case SET_GUIDE_DATA_URL:
      return action.url;
    default:
      return state;
  }
}

function guideData(state = {
  data: {},
  isFetching: false,
  fetched: null,
  error: null,
}, action) {
  switch (action.type) {
    case SET_GUIDE_DATA:
      return action.data;
    case GUIDE_DATA_REQUESTED:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case GUIDE_DATA_RECEIVED:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        fetched: moment().format(),
        error: null,
      };
    case GUIDE_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}

function guide(state = {
  programme: {
    Sunday: {},
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
  },
  isParsing: false,
  error: null,
}, action) {
  switch (action.type) {
    case GUIDE_DATA_RECEIVED:
      // @TODO how do we kick off parsing here?
      //  or are we just noting that we are at this stage?
      return state;
    case GUIDE_DATA_PARSED:
      return {
        ...state,
        guide: action.guide,
        isParsing: false,
        error: null,
      };
    case GUIDE_PARSING_ERROR:
      return {
        ...state,
        isParsing: false,
        error: action.error,
      };
    default:
      return state;
  }
}

function slots(state = {
  shows: [],
  isParsing: false,
  error: null,
}, action) {
  switch (action.type) {
    case GUIDE_DATA_PARSED:
      return {
        ...state,
        isParsing: false,
        error: null,
        shows: action.shows,
      };
    case GUIDE_PARSING_ERROR:
      return {
        ...state,
        isParsing: false,
        error: action.error,
      };
    default:
      return state;
  }
}

function nowPlaying(state = {
  show: {},
  searchPending: false,
  error: null,
}, action) {
  switch (action.type) {
    case NOW_PLAYING_REQUESTED:
      return {
        ...state,
        searchPending: true,
        error: null,
      };
    case NOW_PLAYING_RECEIVED:
      return {
        ...state,
        show: action.show,
        searchPending: false,
        error: null,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  guide,
  guideData,
  guideDataUrl,
  nowPlaying,
  slots,
});

export default rootReducer;
