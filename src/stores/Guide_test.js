import expect from 'expect';
import moment from 'moment-timezone';
import mockdate from 'mockdate';

import GuideStore from './Guide';

const now = moment();

describe('GuideStore', () => {
  it('Should have the correct data uri', () => {
    const { uri } = GuideStore.getState();
    expect(uri).toBe('http://4zzzfm.org.au:41021');
  });
  it('Should accept guideData', (done) => {
    const today = now.format('dddd');
    const guideData = {};
    guideData[today] = {
      '00:00': {
        slug: 'mocked-show',
        name: 'Mocked Show',
        thisweek: now.format(),
        duration: 1,
        broadcasters: 'Tommy',
      },
    };
    const dataChangeHandler = () => {
      expect(1).toBe(1); // any hit here is a success
      GuideStore.removeChangeListener('data', dataChangeHandler);
      done();
    };
    GuideStore.addChangeListener('data', dataChangeHandler);
    GuideStore.setGuideData(guideData);
  });
  it('Should determine nowPlaying', (done) => {
    const today = now.format('dddd');
    const nowPlayingChangeHandler = () => {
      const { nowPlaying } = GuideStore.getState();
      expect(nowPlaying.name).toBe('Mocked Show');
      expect(nowPlaying.timeslot).toContain(today);
      expect(nowPlaying.timeslot).toContain(now.format('h:mma'));
      expect(nowPlaying.broadcasters).toBe('with Tommy');
      GuideStore.removeChangeListener('nowPlaying', nowPlayingChangeHandler);
      done();
    };
    GuideStore.addChangeListener('nowPlaying', nowPlayingChangeHandler);
    GuideStore.update();
  });
  it('Should update the guide with the data', (done) => {
    const today = now.format('dddd');
    const guideChangeHandler = () => {
      const { guide } = GuideStore.getState();
      expect(Object.keys(guide[today]).length).toBe(1);
      expect(Object.keys(guide[today][now.format()]).length).toBe(5);
      expect(guide[today][now.format()].slug)
        .toBe('mocked-show');
      GuideStore.removeChangeListener('guide', guideChangeHandler);
      done();
    };
    GuideStore.addChangeListener('guide', guideChangeHandler);
    GuideStore.update();
  });
  // Note: This test will fail if you run these tests while not in VIC, AU
  // @TODO mock the tz so that these tests will pass no matter where they are
  //  run
  it('Should display a Monday 11pm QLD show as Tuesday 12am show in VIC', (done) => {
    mockdate.set('2016-02-22T13:10:00.000Z');
    const guideData = {};
    GuideStore.setGuideData(guideData);
    guideData.Monday = {
      '23:00': {
        slug: 'mocked-midnight-show',
        broadcasters: 'Tommy',
        duration: 1,
        name: 'Mocked Midnight Show',
        thisweek: '2016-02-22T13:00:00.000Z',
      },
    };
    const guideChangeHandler = () => {
      const { guide, nowPlaying } = GuideStore.getState();
      expect(guide.Tuesday[moment('2016-02-22T13:00:00.000Z').format()])
        .toExist();
      expect(nowPlaying.timeslot).toContain('Tuesdays');
      GuideStore.removeChangeListener('guide', guideChangeHandler);
      mockdate.reset();
      done();
    };
    GuideStore.addChangeListener('guide', guideChangeHandler);
    GuideStore.setGuideData(guideData);
  });
});
