import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nock from 'nock';

import * as actions from './guideActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('guide actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should create an action to set the guide data url', () => {
    const url = 'http://4zzzfm.org.au:41021';
    const expectedAction = {
      type: actions.SET_GUIDE_DATA_URL,
      url,
    };
    expect(actions.setGuideDataUrl(url)).toEqual(expectedAction);
  });

  it('creates GUIDE_DATA_PARSED when fetching and parsing guide data has been done', (done) => {
    // Minimal data representation, 1 show only
    const guideData = {
      Tuesday: {
        '22:00': {
          slug: 'nothin-but-the-blues',
          broadcasters: 'Mark',
          link: 'http://www.4zzzfm.org.au/program/nothin-but-the-blues',
          timeofday: '22:00',
          duration: 1,
          name: 'Nothin but the Blues',
          thisweek: '2016-03-01T12:00:00.000Z',
          dayofweek: 'Tuesday',
        },
      },
    };

    // Expected result after parsing
    const guide = {
      program: {
        Tuesday: {
          '2016-03-01T23:00:00+11:00': {
            broadcasters: 'Mark',
            dayofweek: 'Tuesday',
            duration: 1,
            link: 'http://www.4zzzfm.org.au/program/nothin-but-the-blues',
            name: 'Nothin but the Blues',
            slug: 'nothin-but-the-blues',
            thisweek: '2016-03-01T12:00:00.000Z',
            timeofday: '22:00',
          },
        },
      },
      shows: [
        {
          broadcasters: 'Mark',
          dayofweek: 'Tuesday',
          duration: 1,
          link: 'http://www.4zzzfm.org.au/program/nothin-but-the-blues',
          name: 'Nothin but the Blues',
          slug: 'nothin-but-the-blues',
          thisweek: '2016-03-01T12:00:00.000Z',
          timeofday: '22:00',
        },
      ],
    };

    // Mock the fetch call
    nock('http://4zzzfm.org.au:41021')
      .get('/')
      .reply(200, guideData);

    // Expect first a requested, then a received action
    const expectedActions = [
      { type: actions.GUIDE_DATA_REQUESTED },
      { type: actions.GUIDE_DATA_PARSED, guide },
    ];
    // Mock the store with default data
    const store = mockStore({
      guideDataUrl: 'http://4zzzfm.org.au:41021',
      guide: {
        program: {},
        isFetching: false,
        isParsing: false,
        fetched: null,
        error: null,
      },
    }, expectedActions, done);
    store.dispatch(actions.fetchGuideDataIfNeeded());
  });
});
