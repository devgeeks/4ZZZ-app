import moment from 'moment-timezone';

export default {
  parseGuideData(guideData) {
    const guide = {
      programme: {},
      shows: [],
    };
    let slotLocalTime;

    for (const day in guideData) {
      if (guideData.hasOwnProperty(day)) {
        for (const slot in guideData[day]) {
          if (guideData[day].hasOwnProperty(slot)) {
            guide.shows.push(guideData[day][slot]);
            slotLocalTime = moment(guideData[day][slot].thisweek);
            if (!guide.programme[slotLocalTime.format('dddd')]) {
              guide.programme[slotLocalTime.format('dddd')] = {};
            }
            guide.programme[slotLocalTime.format('dddd')][slotLocalTime.format()]
              = guideData[day][slot];
          }
        }
      }
    }
    // Cache locally?
    // Only if using something async like localForage...
    return Promise.resolve(guide);
  },
  determineNowPlaying(shows) {
    let nowPlaying = {};
    let error;
    if (shows.length) {
      const now = moment();
      let slotThisWeek;
      const nowPlayingSlotArr = shows.filter((slot) => {
        slotThisWeek = moment(slot.thisweek);
        // If the API is returning next weeks show...
        if (slotThisWeek > moment().add(3, 'days')) {
          slotThisWeek.subtract(7, 'days');
        }
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
        nowPlaying = {
          name: nowPlayingSlot.name,
          timeslot: `${slotLocalTime.format('dddd')}s,
          ${slotLocalTime.format('h:mma')} - ${slotEndTime.format('h:mma')}`,
          broadcasters,
        };
      } else {
        error = new Error('Failed to find current show');
      }
    } else {
      error = new Error('No valid guide');
    }
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(nowPlaying);
  },
};
