const { Probe } = require("./probe.js");

describe("Probe", () => {
  it("should pass with a long but not timed out probe", () => {
    const probe = () => new Promise(resolve => setTimeout(resolve, 10));
    const okCb = jest.fn();
    const errCb = jest.fn();

    return new Probe(probe, { timeout: 20 })
      .run()
      .then(okCb)
      .catch(errCb)
      .then(() => {
        expect(okCb).toHaveBeenCalled();
        expect(errCb).not.toHaveBeenCalled();
      });
  });

  it("should fail with not timed out but unsuccessful probe", () => {
    const probe = () => Promise.reject("error");
    const okCb = jest.fn();
    const errCb = jest.fn();

    return new Probe(probe, { timeout: 10 })
      .run()
      .then(okCb)
      .catch(errCb)
      .then(() => {
        expect(okCb).not.toHaveBeenCalled();
        expect(errCb).toHaveBeenCalledWith("error");
      });
  });

  it("should fail with timed out successfull probe", () => {
    const probe = () => new Promise(resolve => setTimeout(resolve, 20));
    const okCb = jest.fn();
    const errCb = jest.fn();

    return new Probe(probe, { timeout: 10 })
      .run()
      .then(okCb)
      .catch(errCb)
      .then(() => {
        expect(okCb).not.toHaveBeenCalled();
        expect(errCb).toHaveBeenCalled();
      });
  });

  it("should fail with timed out unsuccessfull probe", () => {
    const probe = () =>
      new Promise((_, reject) => setTimeout(() => reject("blblbl"), 20));
    const okCb = jest.fn();
    const errCb = jest.fn();

    return new Probe(probe, { timeout: 10 })
      .run()
      .then(okCb)
      .catch(errCb)
      .then(() => {
        expect(okCb).not.toHaveBeenCalled();
        expect(errCb).toHaveBeenCalled();
        expect(errCb).not.toHaveBeenCalledWith("blblbl");
      });
  });
});
