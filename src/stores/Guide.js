import Store from 'store-prototype';
import moment, { tz } from 'moment-timezone';
import xhr from 'xhr';

const GuideStore = new Store();

// let _guideDataUri = 'http://4zzzfm.org.au:41021';
let _guideDataUri = 'data.json';
let _guideData;
let _nowPlaying = {
  name: '',
  timeslot: '',
  broadcasters: '',
};
const _guide = {
  Sunday: {},
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
};
let _error;

function fetchGuideData(callback) {
  xhr({
    body: '',
    uri: _guideDataUri,
    headers: {
      'Content-Type': 'application/json',
    },
  }, (err, resp, data) => {
    try {
      callback(null, JSON.parse(data));
    } catch (e) {
      // console.error('Error: unable to load guide data from the API', err, resp);
      _error = {
        msg: 'Error: unable to load guide data from the API',
        err,
      };
      callback(err);
    }
  });
}

function parseGuideData() {
  let guideMoment;
  for (const day in _guideData) {
    if (_guideData.hasOwnProperty(day)) {
      for (const slot in _guideData[day]) {
        if (_guideData[day].hasOwnProperty(slot)) {
          guideMoment = tz(_guideData[day][slot].thisweek, 'UTC')
            .clone().tz(tz.guess());
          _guide[guideMoment.format('dddd')][guideMoment.format()]
            = _guideData[day][slot];
        }
      }
    }
  }
}

function determineNowPlaying(callback) {
  // @TODO Refactor for clarity
  let guideMoment;
  let tmpH;
  let nowH;
  const today = moment().format('dddd');
  for (const slot in _guide[today]) {
    if (_guide[today].hasOwnProperty(slot)) {
      guideMoment = tz(_guide[today][slot].thisweek, 'UTC')
        .clone().tz(tz.guess());
      tmpH = parseInt(guideMoment.format('H'), 10);
      nowH = parseInt(moment().format('H'), 10);
      if (nowH >= tmpH && nowH < (tmpH + _guide[today][slot].duration)) {
        const tmpEndTime =
          guideMoment.clone().add(_guide[today][slot].duration, 'hours');
        const broadcasters = _guide[today][slot].broadcasters
          ? `with ${_guide[today][slot].broadcasters}`
          : '';
        _nowPlaying = {
          name: _guide[today][slot].name,
          timeslot: `${guideMoment.format('dddd')}s,
            ${guideMoment.format('h:mma')} - ${tmpEndTime.format('h:mma')}`,
          broadcasters,
        };
        callback(null, _nowPlaying);
        return;
      }
    }
  }
  const err = new Error('Failed to find current show');
  _error = {
    msg: 'Failed to find current show',
    err,
  };
  // console.error(_error);
  callback(_error, null);
}

GuideStore.extend({
  getState() {
    return {
      error: _error,
      guide: _guide,
      nowPlaying: _nowPlaying,
    };
  },
  fetch() {
    // Begin the guide data fetching loop
    clearTimeout(window.updateGuideDataTimeout);
    fetchGuideData((err, guideData) => {
      if (!err) this.setGuideData(guideData);
      else this.notifyChange('error');
      window.updateGuideDataTimeout =
        setTimeout(() => GuideStore.fetch(), 3600000); // one hour
    });
  },
  updateNowPlaying() {
    // @TODO immutable?
    clearTimeout(window.updateNowPlayingTimeout);
    determineNowPlaying((err) => {
      if (!err) this.notifyChange('nowPlaying');
      else this.notifyChange('error');
      window.updateNowPlayingTimeout =
        setTimeout(() => GuideStore.updateNowPlaying(), 30000); // 30 seconds
    });
  },
  update() {
    // @TODO immutable?
    parseGuideData();
    // Next, kick off the now playing update loop
    this.updateNowPlaying();
    this.notifyChange('guide');
  },
  setGuideDataUri(uri) {
    _guideDataUri = uri;
  },
  setGuideData(data) {
    // @TODO immutable?
    _guideData = data;
    this.update();
    this.notifyChange('data');
  },
});

GuideStore.fetch();

module.exports = GuideStore;