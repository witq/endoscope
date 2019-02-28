const httpHandler = require("./http.js");

describe("httpHandler", () => {
  const requestMock = {
    method: "GET",
    url: "/healthz"
  };
  const responseMock = {
    writeHead: jest.fn(),
    end: jest.fn()
  };

  beforeEach(() => {
    responseMock.writeHead.mockClear();
    responseMock.end.mockClear();
  });

  it("should respect the successCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve([]))
    };

    const handler = httpHandler(endoscopeMock)({ successCode: 666 });

    return handler(requestMock, responseMock).then(() => {
      expect(responseMock.writeHead.mock.calls).toMatchSnapshot();
      expect(responseMock.end.mock.calls).toMatchSnapshot();
    });
  });

  it("should respect the errorCode option", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject(""))
    };

    const handler = httpHandler(endoscopeMock)({ errorCode: 666 });

    return handler(requestMock, responseMock).then(() => {
      expect(responseMock.writeHead.mock.calls).toMatchSnapshot();
      expect(responseMock.end.mock.calls).toMatchSnapshot();
    });
  });

  it("should return successful result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve(["ok"]))
    };

    const handler = httpHandler(endoscopeMock)();

    return handler(requestMock, responseMock).then(() => {
      expect(responseMock.writeHead.mock.calls).toMatchSnapshot();
      expect(responseMock.end.mock.calls).toMatchSnapshot();
    });
  });

  it("should return error result", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.reject("err"))
    };

    const handler = httpHandler(endoscopeMock)();

    return handler(requestMock, responseMock).then(() => {
      expect(responseMock.writeHead.mock.calls).toMatchSnapshot();
      expect(responseMock.end.mock.calls).toMatchSnapshot();
    });
  });

  it("should return 404 status for urls other than prefix", () => {
    const endoscopeMock = {
      run: jest.fn(() => Promise.resolve([]))
    };

    const requestMock = {
      method: "GET",
      url: "/health"
    };

    const handler = httpHandler(endoscopeMock)();

    return handler(requestMock, responseMock).then(() => {
      expect(responseMock.writeHead.mock.calls).toMatchSnapshot();
      expect(responseMock.end.mock.calls).toMatchSnapshot();
    });
  })
});
