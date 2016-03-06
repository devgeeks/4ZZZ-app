export function hhmmss(secs) {
  let s1 = Math.floor(secs);
  const h1 = Math.floor(s1 / (60 * 60));
  s1 %= 60 * 60;
  const m1 = Math.floor(s1 / 60);
  s1 %= 60;
  const h2 = h1 ? `${h1}:` : '';
  const m2 = h1 && m1 < 10 ? `0${m1}` : m1;
  const s2 = s1 < 10 ? `0${s1}` : s1;
  return `${h2}${m2}:${s2}`;
}

export function throttle(callback, limit) {
  let wait = false;
  return () => {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}
