const { deduplicateSlashes, defaultEndoscopeOptions } = require("./common.js");

module.exports = endoscopeInstance => (app, options = {}) => {
  const endoscopeOptions = Object.assign({}, defaultEndoscopeOptions, options);

  const handler = (request, response) => {
    const level = !request.params.level
      ? endoscopeOptions.defaultLevel
      : parseInt(request.params.level);

    return endoscopeInstance
      .run(level)
      .then(result => {
        response.status(endoscopeOptions.successCode).send(result);
      })
      .catch(error => {
        response.status(endoscopeOptions.errorCode).send(error);
      });
  };

  app.get(deduplicateSlashes(`${endoscopeOptions.prefix}/:level?`), handler);
};
