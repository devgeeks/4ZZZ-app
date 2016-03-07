import moment from 'moment-timezone';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
//import expect from 'expect';

import * as actions from './nowPlayingActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('nowPlaying actions', () => {
  // @TODO MOAR -- these are really important
  it('should determine now playing based on the shows array and the current time', (done) => {
    // Mock some dates
    const now = moment();
    const shows = [
      {
        broadcasters: 'Mark',
        dayofweek: now.format('dddd'),
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
      broadcasters: 'with Mark',
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
});
