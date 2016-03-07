import moment from 'moment-timezone';
import mockdate from 'mockdate';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
//import expect from 'expect';

import * as actions from './nowPlayingActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('nowPlaying actions', () => {
  afterEach(() => {
    mockdate.reset();
  });
  // @TODO MOAR -- these are really important
  it('should determine now playing based on the shows array and the current time', (done) => {
    // Mock some dates
    const now = moment();
    const shows = [
      {
        broadcasters: 'Tommy',
        duration: 1,
        name: 'Nothin but the Blues',
        thisweek: now.format(),
      },
    ];
    // Mock store data
    const storeData = {
      nowPlaying: {
        show: {},
        searchPending: false,
        error: null,
      },
      guide: {
        shows,
      },
    };
    // Expected result
    const end = now.clone().add(1, 'hours');
    const nowPlaying = {
      name: 'Nothin but the Blues',
      broadcasters: 'with Tommy',
      timeslot: `${now.format('dddd')}s,
          ${now.format('h:mma')} - ${end.format('h:mma')}`,
    };
    // Expect first a requested, then a received action
    const expectedActions = [
      { type: actions.NOW_PLAYING_REQUESTED },
      { type: actions.NOW_PLAYING_RECEIVED, nowPlaying },
    ];
    // Mock the store with default data
    const store = mockStore(storeData, expectedActions, done);
    store.dispatch(actions.determineNowPlayingIfNeeded());
  });
  it('should determine now playing correctly even when the show starts on the next day locally',
    (done) => {
      // Mock some dates
      mockdate.set('2016-03-07T13:10:00.000Z');
      // Show that starts at midnight in Melbourne, but 11pm in Brisbane
      const vicMidnight = moment('2016-03-07T13:00:00Z').tz('Australia/Sydney');
      const shows = [
        {
          broadcasters: 'Tommy',
          duration: 2,
          name: 'Nothin but the Midnight',
          thisweek: vicMidnight.format(),
        },
      ];
      // Mock store data
      const storeData = {
        nowPlaying: {
          show: {},
          searchPending: false,
          error: null,
        },
        guide: {
          shows,
        },
      };
      // Expected result
      const end = vicMidnight.clone().add(2, 'hours');
      const nowPlaying = {
        name: 'Nothin but the Midnight',
        broadcasters: 'with Tommy',
        timeslot: `${vicMidnight.format('dddd')}s,
          ${vicMidnight.format('h:mma')} - ${end.format('h:mma')}`,
      };
      // Expect first a requested, then a received action
      const expectedActions = [
        { type: actions.NOW_PLAYING_REQUESTED },
        { type: actions.NOW_PLAYING_RECEIVED, nowPlaying },
      ];
      // Mock the store with default data
      const store = mockStore(storeData, expectedActions, done);
      store.dispatch(actions.determineNowPlayingIfNeeded());
    });
  it('should determine now playing correctly even when the show spans midnight',
    (done) => {
      // Mock some dates
      mockdate.set('2016-03-07T13:10:00.000Z');
      // Show that starts at midnight in Melbourne, but 11pm in Brisbane
      const vicMidnight = moment('2016-03-07T12:00:00Z').tz('Australia/Sydney');
      const shows = [
        {
          broadcasters: 'Tommy',
          duration: 2,
          name: 'Nothin but the Midnight',
          thisweek: vicMidnight.format(),
        },
      ];
      // Mock store data
      const storeData = {
        nowPlaying: {
          show: {},
          searchPending: false,
          error: null,
        },
        guide: {
          shows,
        },
      };
      // Expected result
      const end = vicMidnight.clone().add(2, 'hours');
      const nowPlaying = {
        name: 'Nothin but the Midnight',
        broadcasters: 'with Tommy',
        timeslot: `${vicMidnight.format('dddd')}s,
          ${vicMidnight.format('h:mma')} - ${end.format('h:mma')}`,
      };
      // Expect first a requested, then a received action
      const expectedActions = [
        { type: actions.NOW_PLAYING_REQUESTED },
        { type: actions.NOW_PLAYING_RECEIVED, nowPlaying },
      ];
      // Mock the store with default data
      const store = mockStore(storeData, expectedActions, done);
      store.dispatch(actions.determineNowPlayingIfNeeded());
    });
});
