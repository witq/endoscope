const expressDecorator = require("./express.js");

describe("expressDecorator", () => {
  const expressInstance = {
    get: null
  };

  beforeEach(() => (expressInstance.get = jest.fn()));

  it("should decorate the express instance", () => {
    const decorator = expressDecorator({});

    decorator(expressInstance);

    expect(expressInstance.get.mock.calls).toMatchSnapshot();
  });

  it("should respect the prefix option", () => {
    const decorator = expressDecorator({});

    decorator(expressInstance, {
      prefix: "/"
    });

    expect(expressInstance.get.mock.calls).toMatchSnapshot();
  });

  it("should respect the successCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve([]))
    };
    const resposeMock = {
      status: jest.fn(() => ({
        send: jest.fn()
      }))
    };
    const decorator = expressDecorator(endoscopeMock);

    decorator(expressInstance, {
      successCode: 200
    });

    const handler = expressInstance.get.mock.calls[0][1];

    expect.assertions(1);

    return handler({ params: {} }, resposeMock).then(() => {
      expect(resposeMock.status).toBeCalledWith(200);
    });
  });

  it("should respect the errorCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject(""))
    };
    const resposeMock = {
      status: jest.fn(() => ({
        send: jest.fn()
      }))
    };
    const decorator = expressDecorator(endoscopeMock);

    decorator(expressInstance, {
      errorCode: 666
    });

    const handler = expressInstance.get.mock.calls[0][1];

    expect.assertions(1);

    return handler({ params: {} }, resposeMock).then(() => {
      expect(resposeMock.status).toBeCalledWith(666);
    });
  });

  it("should return successful result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve(["ok"]))
    };
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({
      send: sendMock
    }));
    const resposeMock = {
      status: statusMock
    };
    const decorator = expressDecorator(endoscopeMock);

    decorator(expressInstance);

    const handler = expressInstance.get.mock.calls[0][1];

    expect.assertions(1);

    return handler({ params: {} }, resposeMock).then(() => {
      expect(sendMock).toBeCalledWith(["ok"]);
    });
  });

  it("should return error result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject("err"))
    };
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({
      send: sendMock
    }));
    const resposeMock = {
      status: statusMock
    };
    const decorator = expressDecorator(endoscopeMock);

    decorator(expressInstance);

    const handler = expressInstance.get.mock.calls[0][1];

    expect.assertions(1);

    return handler({ params: {} }, resposeMock).then(() => {
      expect(sendMock).toBeCalledWith("err");
    });
  });
});
