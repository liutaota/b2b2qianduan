// 防抖
export const _debounce = (fn, delays) => {
  const delay = delays || 500;
  let timer;
  return function () {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
};
export const _throttle = (fn, intervals) => {
  let last;
  let timer;
  const interval = intervals || 200;
  return function () {
    const th = this;
    const args = arguments;
    const now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
};
