const { deduplicateSlashes, defaultEndoscopeOptions } = require("./common.js");

module.exports = endoscopeInstance => (fastify, options, next) => {
  const endoscopeOptions = Object.assign(
    {},
    defaultEndoscopeOptions,
    options.endoscope
  );
  const handler = (request, reply) => {
    const level = !request.params.level
      ? endoscopeOptions.defaultLevel
      : parseInt(request.params.level);

    return endoscopeInstance
      .run(level)
      .then(result => {
        reply.code(endoscopeOptions.successCode);

        return result;
      })
      .catch(error => {
        reply.code(endoscopeOptions.errorCode);

        return error;
      });
  };

  fastify.route({
    url: deduplicateSlashes(`${endoscopeOptions.prefix}/:level`),
    method: "GET",
    handler
  });
  fastify.route({
    url: deduplicateSlashes(`${endoscopeOptions.prefix}`),
    method: "GET",
    handler
  });

  next();
};
