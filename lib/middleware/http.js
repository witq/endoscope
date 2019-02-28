const { parse } = require("url");
const { defaultEndoscopeOptions } = require("./common.js");

module.exports = endoscopeInstance => (options = {}) => {
  const endoscopeOptions = Object.assign({}, defaultEndoscopeOptions, options);

  return (request, response) => {
    const url = parse(request.url);
    const prefix = (/^\/\w+/.exec(url.path) || [])[0];
    const levelString = (/\d+$/.exec(url.path) || [])[0];
    const level = !levelString
      ? endoscopeOptions.defaultLevel
      : parseInt(levelString);

    if (prefix != endoscopeOptions.prefix || request.method != "GET") {
      response.writeHead(404);

      return Promise.resolve(response.end());
    }

    return endoscopeInstance
      .run(level)
      .then(result => {
        response.writeHead(endoscopeOptions.successCode, {
          "Content-Type": "application/json"
        });

        return response.end(JSON.stringify(result));
      })
      .catch(error => {
        response.writeHead(endoscopeOptions.errorCode, {
          "Content-Type": "application/json"
        });

        return response.end(error);
      });
  };
};
