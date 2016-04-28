export function isAndroid() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('android') > -1;
}
