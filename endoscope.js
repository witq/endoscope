const { Endoscope } = require("./lib/endoscope.js");
const fastifyEndoscope = require("./lib/middleware/fastify.js");
const expressEndoscope = require("./lib/middleware/express.js");

const endoscopeInstance = new Endoscope();

module.exports = {
  endoscopeInstance,
  expressEndoscope: expressEndoscope(endoscopeInstance),
  fastifyEndoscope: fastifyEndoscope(endoscopeInstance)
};
