const { Probe } = require("./probe.js");

class Endoscope {
  constructor() {
    this.probes = [];
  }

  register(probe, options) {
    this.probes.push(new Probe(probe, options));

    return this;
  }

  run(level = 0) {
    return Promise.all(
      this.probes
        .filter(probe => probe.level <= level)
        .map(probe => probe.run())
    );
  }
}

module.exports = {
  Endoscope
};
