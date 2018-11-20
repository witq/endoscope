const { resolve } = require("path");
const { Endoscope } = require("./endoscope.js");

module.exports = path => {
  const endoscope = new Endoscope();
  const loadProbes = require(resolve(__dirname, path));

  loadProbes(endoscope.register.bind(endoscope));

  return endoscope;
};
