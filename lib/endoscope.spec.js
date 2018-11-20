const { Endoscope } = require("./endoscope.js");

describe("Endoscope", () => {
  let endoscope;

  beforeEach(() => {
    endoscope = new Endoscope();
  });

  it("should pass with one successfull probe", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe);
    return endoscope
      .run()
      .then(cb)
      .then(result => {
        expect(cb).toHaveBeenCalled();
        expect(result).toEqual(["ok"]);
      });
  });

  it("should fail with one error probe", () => {
    const probe = () => Promise.reject("err");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe);

    return endoscope
      .run()
      .catch(cb)
      .then(result => {
        expect(cb).toHaveBeenCalled();
        expect(result).toEqual("err");
      });
  });

  it("should pass with multiple successfull probes", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe);
    endoscope.register(probe);
    endoscope.register(probe);

    return endoscope
      .run()
      .then(cb)
      .then(result => {
        expect(cb).toHaveBeenCalled();
        expect(result).toEqual(["ok", "ok", "ok"]);
      });
  });

  it("should fail with multiple successfull probes and one error probe", () => {
    const probe = () => Promise.resolve("ok");
    const errprobe = () => Promise.reject("err");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe);
    endoscope.register(errprobe);
    endoscope.register(probe);
    endoscope.register(probe);

    return endoscope
      .run()
      .catch(cb)
      .then(result => {
        expect(cb).toHaveBeenCalled();
        expect(result).toEqual("err");
      });
  });

  it("should pass with a long but not timed out probe", () => {
    const probe = () => new Promise(resolve => setTimeout(resolve, 90));
    const okCb = jest.fn();
    const errCb = jest.fn();

    endoscope.register(probe);

    return endoscope
      .run()
      .then(okCb)
      .catch(errCb)
      .then(() => {
        expect(okCb).toHaveBeenCalled();
        expect(errCb).not.toHaveBeenCalled();
      });
  });

  it("should fail with timed out successfull probe", () => {
    const probe = () => new Promise(resolve => setTimeout(resolve, 120));
    const cb = jest.fn();

    endoscope.register(probe, { timeout: 100 });

    return endoscope
      .run()
      .catch(cb)
      .then(() => {
        expect(cb).toHaveBeenCalled();
      });
  });

  it("should run all probes with level 0 when no level is specified", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe).register(probe, { level: 0 });

    return endoscope
      .run()
      .then(cb)
      .then(() => {
        expect(cb).toHaveBeenCalledWith(["ok", "ok"]);
      });
  });

  it("should run all probles with level 0 when level 0 is specified", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe).register(probe, { level: 0 });

    return endoscope
      .run({ level: 0 })
      .then(cb)
      .then(() => {
        expect(cb).toHaveBeenCalledWith(["ok", "ok"]);
      });
  });

  it("should run all probles with level 1 and 0 when level 1 is specified", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe).register(probe, { level: 1 });

    return endoscope
      .run({ level: 1 })
      .then(cb)
      .then(() => {
        expect(cb).toHaveBeenCalledWith(["ok", "ok"]);
      });
  });

  it("should run only probles with level 0 when level 0 is specified", () => {
    const probe = () => Promise.resolve("ok");
    const cb = jest.fn().mockImplementation(arg => arg);

    endoscope.register(probe).register(probe, { level: 1 });

    return endoscope
      .run({ level: 0 })
      .then(cb)
      .then(() => {
        expect(cb).toHaveBeenCalledWith(["ok"]);
      });
  });
});
