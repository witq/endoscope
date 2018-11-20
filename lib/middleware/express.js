module.exports = endoscopeInstance => (request, response) => {
  const level = !!request.params.level ? 0 : parseInt(request.params.level);

  endoscopeInstance
    .run({ level })
    .then(() => {
      response.status(204).end();
    })
    .catch(() => {
      response.status(500).end();
    });
};
