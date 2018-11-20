module.exports = endoscopeInstance => (fastify, options, next) => {
  const endoscopeOptions = options.endoscope || {
    prefix: "/healthz",
  };
  const handler = (request, reply) => {
    const level = !!request.params.level ? 0 : parseInt(request.params.level);

    endoscopeInstance
      .run({ level })
      .then(() => {
        reply.code(204).send();
      })
      .catch(() => {
        reply.code(500).send();
      });
  };

  fastify.route({
    url: `${endoscopeOptions.prefix}/:level`,
    method: "GET",
    handler,
  });
  fastify.route({
    url: `${endoscopeOptions.prefix}`,
    method: "GET",
    handler,
  })

  next();
};
