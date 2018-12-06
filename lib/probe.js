class Probe {
  constructor(fn, { timeout = 100, level = 0 } = {}) {
    this.fn = fn;
    this.timeout = timeout;
    this.level = level;
  }

  run() {
    return Promise.race([this.fn().then(result => result || 'OK'), timeout(this.timeout)]);
  }
}

const timeout = ms =>
  new Promise((_, reject) => setTimeout(() => reject("Probe timeout"), ms));

module.exports = {
  Probe
};
