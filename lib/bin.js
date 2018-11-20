#!/usr/bin/env node

const loadProbes = require("./load-probes.js");

const [, , path, level] = process.argv;
const endoscope = loadProbes(path);

endoscope.run({ level: parseInt(level) }).catch(() => process.exit(1));
