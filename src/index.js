// @flow

const DEFAULT_INTERVAL = 25; // 25 milliseconds
const DEFAULT_TIMEOUT = 2000; // 2 seconds

const _tryHard = async (testable, interval, tries, resolve, reject) => {
  try {
    await testable();
    resolve();
    return;
  } catch (err) {
    if (tries === 0) {
      reject(err);
      return;
    }
    setTimeout(() => {
      _tryHard(testable, interval, tries - 1, resolve, reject);
    }, interval);
  }
};

type TryHardOptions = {
  interval?: number,
  timeout?: number,
}

async function tryHard(testable: Function, options?: TryHardOptions) {
  const interval = (options && options.interval && options.interval > 0) ? options.interval : DEFAULT_INTERVAL;
  const timeout = (options && options.timeout && options.timeout > 0) ? options.timeout : DEFAULT_TIMEOUT;
  const tries = Math.ceil(timeout / interval);

  return new Promise((resolve, reject) => {
    _tryHard(testable, interval, tries, resolve, reject);
  });
};

module.exports = tryHard;
