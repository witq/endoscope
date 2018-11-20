module.exports = register => {
  register(() => Promise.resolve("from file"));
};
