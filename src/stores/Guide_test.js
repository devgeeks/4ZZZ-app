import expect from 'expect';
import moment from 'moment-timezone';

import GuideStore from './Guide';

/*
 * We need to allow very specific testing, such as edge cases. Ones that come
 *  to mind are say where a show crosses midnight, or a show is on Sunday in
 *  QLD but Monday in VIC (say because it starts at 11pm in QLD). Or when a
 *  show has no broadcasters, etc.
 */

const now = moment();

describe('GuideStore', () => {
  it('Should have the correct data uri', () => {
    const { uri } = GuideStore.getState();
    expect(uri).toBe('http://4zzzfm.org.au:41021');
  });
  it('Should accept guideData', () => {
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
    GuideStore.addChangeListener('data', () => {
      expect(1).toBe(1); // any hit here is a success
    });
    GuideStore.setGuideData(guideData);
  });
  it('Should determine nowPlaying', () => {
    const today = now.format('dddd');
    GuideStore.addChangeListener('nowPlaying', () => {
      const { nowPlaying } = GuideStore.getState();
      expect(nowPlaying.name).toBe('Mocked Show');
      expect(nowPlaying.timeslot).toContain(today);
      expect(nowPlaying.timeslot).toContain(now.format('h:mma'));
      expect(nowPlaying.broadcasters).toBe('with Tommy');
    });
    GuideStore.update();
  });
  it('Should update the guide with the data', () => {
    const today = now.format('dddd');
    GuideStore.addChangeListener('guide', () => {
      const { guide } = GuideStore.getState();
      expect(Object.keys(guide[today]).length).toBe(1);
      expect(Object.keys(guide[today][now.format()]).length).toBe(5);
      expect(guide[today][now.format()].slug)
        .toBe('mocked-show');
    });
    GuideStore.update();
  });
});
