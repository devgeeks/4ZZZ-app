import moment from 'moment-timezone';
import { combineReducers } from 'redux';
import {
  SET_GUIDE_DATA_URL, GUIDE_DATA_REQUESTED, GUIDE_DATA_ERROR,
  GUIDE_DATA_PARSED, GUIDE_PARSING_ERROR,
} from 'actions/guideActions';
import {
  NOW_PLAYING_REQUESTED, NOW_PLAYING_RECEIVED,
} from 'actions/nowPlayingActions';
import {
  SET_AUDIO_STATUS, PLAY_AUDIO, STOP_AUDIO,
  AUDIO_OBJECT_CREATED, AUDIO_OBJECT_DESTROYED,
} from 'actions/audioActions';

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

function guide(state = {
  programme: {},
  shows: [],
  isFetching: false,
  isParsing: false,
  fetched: null,
  error: null,
}, action) {
  switch (action.type) {
    case GUIDE_DATA_REQUESTED:
      return {
        ...state,
        isFetching: true,
        isParsing: false,
        error: null,
      };
    case GUIDE_DATA_PARSED:
      return {
        ...state,
        programme: action.guide.programme,
        shows: action.guide.shows,
        fetched: moment().format(),
        isFetching: false,
        isParsing: false,
        error: null,
      };
    case GUIDE_DATA_ERROR:
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
        show: action.nowPlaying,
        searchPending: false,
        error: null,
      };
    default:
      return state;
  }
}

function media(state = {
  url: 'http://stream.4zzzfm.org.au:789/;',
  status: 'stopped',
  audio: null,
  duration: '0:00',
  isPlaying: false,
  isPending: false,
  error: null,
}, action) {
  switch (action.type) {
    case SET_AUDIO_STATUS:
      console.log(action.type);
      return {
        ...state,
        status,
      };
    case PLAY_AUDIO:
      console.log(action.type);
      return state;
    case STOP_AUDIO:
      console.log(action.type);
      return state;
    case AUDIO_OBJECT_CREATED:
      console.log(action.type);
      return state;
    case AUDIO_OBJECT_DESTROYED:
      console.log(action.type);
      return state;
    default:
      return state;
  }
}


const rootReducer = combineReducers({
  guideDataUrl,
  guide,
  media,
  nowPlaying,
});

export default rootReducer;
