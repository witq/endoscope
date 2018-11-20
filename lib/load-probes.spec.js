const loadProbes = require("./load-probes.js");
const { Endoscope } = require("../lib/endoscope.js");

describe("loadProbes", () => {
  it("should return an endoscope", () => {
    const endoscope = loadProbes("../tests/endoscope-probes.js");

    expect(endoscope instanceof Endoscope).toBe(true);
  });

  it("should run probes loaded from file", () => {
    const endoscope = loadProbes("../tests/endoscope-probes.js");

    return endoscope
      .run()
      .then(result => expect(result).toEqual(["from file"]));
  });
});
