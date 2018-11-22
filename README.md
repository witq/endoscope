# Endoscope

A Node.js library for creating and exposing healthchecks.

[![CircleCI](https://circleci.com/gh/witq/endoscope.svg?style=svg)](https://circleci.com/gh/witq/endoscope)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f0d34636452a31ccaf0f/test_coverage)](https://codeclimate.com/github/witq/endoscope/test_coverage)
[![Dependency Status](https://david-dm.org/witq/endoscope.svg)](https://david-dm.org/witq/endoscope)


## Usage

Endoscope is used by registering probes and exposing their results via a web app framework of your choice.

The module exports a singleton `endoscopeInstance` so it can be accessed anywhere in your app to register probes.

### Registering probes

Import the endoscope instance

```javascript
import { endoscopeInstance } from "endoscope";
```

Then, register a `Probe`. A `Probe` is a function that returns a `Promise` which resolves or rejects based on the result.

```javascript
endoscopeInstance.register(
  () =>
    new Promise((resolve, reject) => {
      someService.ping(err => {
        if (err) {
          return reject();
        }

        resolve();
      });
    })
);
```

Of course, if the probe subject returns a promise, it can be registered directly.

```javascript
endoscopeInstance.register(someservice.ping);
```

Multiple registrations can be chained.

```javascript
endoscopeInstance
  .register(someservice.ping)
  .register(someOtherService.connect);
```

#### Probe options

##### Level

Probes can be registered with various levels of importance. The default level is `0`.

```javascript
endoscopeInstance.register(someservice.ping, { level: 1 });
```

##### Timeout

Probes can have timeouts, so that they are considered as failed if they don't resolve in a specified number of milliseconds. The default timeout is `100`.

```javascript
endoscopeInstance.register(someservice.ping, { timeout: 500 });
```

### Usage with Fastify

Endoscope provides a Fastify plugin for easy integration.

```javascript
import fastify from 'fastify';
import { fastifyEndoscope } from 'endoscope';

const app = fastify();

app.register(fastifyEndoscope);
```

The created healthcheck routes will be `/healthz` and `/healthz/:level` where level is the desired level of the healthcheck.

If you want to change the healthcheck prefix, you can do so during registration.

```javascript
app.register(
  fastifyEndoscope,
  {
    endoscope: {
      prefix: '/someprefix',
    },
  },
);
```

The created healthcheck routes will be `/someprefix` and `/someprefix/:level`.

### Usage with Express

Endoscope provides an express middleware that has to be mounted manually.

```javascript
import express from 'express';
import { expressEndoscope } from 'endoscope';

const app = express();

app.get('/healthz/:level?', expressEndoscope);
```

The created healthcheck routes will be `/healthz` and `/healthz/:level` where level is the desired level of the healthcheck.

The prefix can be changed, but the `level` parameter name has to be maintained.

```javascript
app.get('/someprefix/:level?', expressEndoscope);
```

The created healthcheck routes will be `/someprefix` and `/someprefix/:level`.

### Healthcheck levels

By default, all probes are created with level `0`. When running the probes, by default all probes with level `0` are run.

If you only require basic `liveness` check, this is all you need to use.

For more advanced cases, where the app may be `alive` and should not be killed by the orchestrator but is not ready to work, a higher level check can be used, like for example the `readiness` check in kubernetes.

When a level is provided to the endoscope endpoint, only probes with the level provided _or lower_ are run.

To use this functionality, first a probe has to be registered with a level higher than 0

```javascript
endoscopeInstance
  .register(livenessDependency.ping)
  .register(readynessDependency.ping, { level: 1 })
```

Then, when `/healthz` or `/healthz/0` is called, only `livenessDependency.ping` will be run. But if `/healthz/1` is called, both `livenessDependency.ping` and `readynessDependency.ping` meaning that the app is alive AND ready.