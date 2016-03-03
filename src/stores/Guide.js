/* global __PRODUCTION__ */
import Store from 'store-prototype';
import moment, { tz } from 'moment-timezone';
import xhr from 'xhr';

let _guideDataUri = 'http://4zzzfm.org.au:41021';
if (process.env.NODE_ENV !== 'production') {
  _guideDataUri = 'data.json';
}
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
const _flatGuideArray = [];
let _error;

const GuideStore = new Store();

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
      _error = {
        msg: 'Error: unable to load guide data from the API',
        err,
      };
      callback(err);
    }
  });
}

function parseGuideData(callback) {
  let slotLocalTime;
  for (const day in _guideData) {
    if (_guideData.hasOwnProperty(day)) {
      for (const slot in _guideData[day]) {
        if (_guideData[day].hasOwnProperty(slot)) {
          _flatGuideArray.push(_guideData[day][slot]);
          slotLocalTime = tz(_guideData[day][slot].thisweek, 'UTC')
            .clone().tz(tz.guess());
          _guide[slotLocalTime.format('dddd')][slotLocalTime.format()]
            = _guideData[day][slot];
        }
      }
    }
  }
  if (callback) callback(null, _guide, _flatGuideArray);
}

function determineNowPlaying(callback) {
  if (_flatGuideArray.length) {
    const now = moment();
    let slotThisWeek;
    const nowPlayingSlotArr = _flatGuideArray.filter((slot) => {
      slotThisWeek = moment(slot.thisweek);
      if (now > slotThisWeek && now < slotThisWeek.add(slot.duration, 'hours')) {
        return true;
      }
    });
    if (nowPlayingSlotArr.length === 1) {
      const nowPlayingSlot = nowPlayingSlotArr[0];
      const slotLocalTime = moment(nowPlayingSlot.thisweek);
      const slotEndTime = slotLocalTime.clone().add(nowPlayingSlot.duration, 'hours');
      const broadcasters = nowPlayingSlot.broadcasters
        ? `with ${nowPlayingSlot.broadcasters}`
        : '';
      _nowPlaying = {
        name: nowPlayingSlot.name,
        timeslot: `${slotLocalTime.format('dddd')}s,
            ${slotLocalTime.format('h:mma')} - ${slotEndTime.format('h:mma')}`,
        broadcasters,
      };
      callback(null);
    } else {
      const err = new Error('Failed to find current show');
      _error = {
        msg: 'Failed to find current show',
        err,
      };
      console.error(_error);
      callback(_error);
    }
  } else {
    callback({ msg: 'No valid guide', err: new Error('No valid guide') });
  }
}

GuideStore.extend({
  getState() {
    return {
      uri: _guideDataUri,
      error: _error,
      flatGuide: _flatGuideArray,
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
  update(callback) {
    // @TODO immutable?
    parseGuideData();
    // Next, kick off the now playing update loop
    this.updateNowPlaying(callback);
    this.notifyChange('guide');
  },
  setGuideDataUri(uri, callback) {
    _guideDataUri = uri;
    if (callback) callback(null, _guideDataUri);
  },
  setGuideData(data, callback) {
    // @TODO immutable?
    _guideData = data;
    this.update();
    this.notifyChange('data');
    if (callback) callback(null, _guideData);
  },
});

GuideStore.fetch();

module.exports = GuideStore;
