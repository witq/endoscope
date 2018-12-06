const fastifyPlugin = require("./fastify.js");

describe("fastifyMiddleware", () => {
  const fastifyInstance = {
    route: null
  };

  beforeEach(() => (fastifyInstance.route = jest.fn()));

  it("should register a plugin in fastify", () => {
    const plugin = fastifyPlugin({});
    const next = jest.fn();

    plugin(fastifyInstance, {}, next);

    expect(next).toBeCalled();
    expect(fastifyInstance.route.mock.calls).toMatchSnapshot();
    expect(fastifyInstance.route.mock.calls[0].handler).toBe(
      fastifyInstance.route.mock.calls[1].handler
    );
  });

  it("should respect the prefix option", () => {
    const plugin = fastifyPlugin({});

    plugin(
      fastifyInstance,
      {
        endoscope: {
          prefix: "/"
        }
      },
      () => {}
    );

    expect(fastifyInstance.route.mock.calls).toMatchSnapshot();
  });

  it("should respect the successCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve([]))
    };
    const replyMock = {
      code: jest.fn()
    };
    const plugin = fastifyPlugin(endoscopeMock);

    plugin(
      fastifyInstance,
      {
        endoscope: {
          successCode: 200
        }
      },
      () => {}
    );

    const handler = fastifyInstance.route.mock.calls[0][0].handler;

    expect.assertions(1);

    return handler({ params: {} }, replyMock).then(() => {
      expect(replyMock.code).toBeCalledWith(200);
    });
  });

  it("should respect the errorCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject(""))
    };
    const replyMock = {
      code: jest.fn()
    };
    const plugin = fastifyPlugin(endoscopeMock);

    plugin(
      fastifyInstance,
      {
        endoscope: {
          errorCode: 666
        }
      },
      () => {}
    );

    const handler = fastifyInstance.route.mock.calls[0][0].handler;

    expect.assertions(1);

    return handler({ params: {} }, replyMock).then(() => {
      expect(replyMock.code).toBeCalledWith(666);
    });
  });

  it("should return succesful result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve(["ok"]))
    };
    const replyMock = {
      code: jest.fn()
    };
    const plugin = fastifyPlugin(endoscopeMock);

    plugin(
      fastifyInstance,
      {},
      () => {}
    );

    const handler = fastifyInstance.route.mock.calls[0][0].handler;

    expect.assertions(1);

    return handler({ params: {} }, replyMock).then(result => {
      expect(result).toEqual(["ok"]);
    });
  });

  it("should return error result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject("err"))
    };
    const replyMock = {
      code: jest.fn()
    };
    const plugin = fastifyPlugin(endoscopeMock);

    plugin(
      fastifyInstance,
      {},
      () => {}
    );

    const handler = fastifyInstance.route.mock.calls[0][0].handler;

    expect.assertions(1);

    return handler({ params: {} }, replyMock).then(result => {
      expect(result).toEqual("err");
    });
  });
});
