import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nock from 'nock';

import * as actions from './nowPlayingActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('nowPlaying actions', () => {
  // @TODO
});
