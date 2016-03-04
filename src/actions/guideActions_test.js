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

  it('creates GUIDE_DATA_RECEIVED when fetching guide data has been done', (done) => {
    // Minimal data representation
    const response = {
      Tuesday: {
        '22:00': {
          slug: 'nothin-but-the-blues',
        },
      },
    };

    // Mock the fetch call
    nock('http://4zzzfm.org.au:41021')
      .get('/')
      .reply(200, response);

    // Expect first a requested, then a received action
    const expectedActions = [
      { type: actions.GUIDE_DATA_REQUESTED },
      { type: actions.GUIDE_DATA_RECEIVED, data: response },
    ];
    // Mock the store with default data
    const store = mockStore({
      guideDataUrl: 'http://4zzzfm.org.au:41021',
      guideData: {
        data: {},
        isFetching: false,
        fetched: null,
        error: null,
      },
    }, expectedActions, done);
    store.dispatch(actions.fetchGuideDataIfNeeded());
  });
});
