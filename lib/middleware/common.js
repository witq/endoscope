const deduplicateSlashes = url => url.replace(/\/{2,}/, "/");
const defaultEndoscopeOptions = {
  prefix: "/healthz",
  defaultLevel: 0,
  successCode: 200,
  errorCode: 500
};

module.exports = {
  deduplicateSlashes,
  defaultEndoscopeOptions
};
