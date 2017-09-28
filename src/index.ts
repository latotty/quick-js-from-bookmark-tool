import { makeDOMDriver } from '@cycle/dom';
import onionify from 'cycle-onionify';

import { App } from './app';

const main = onionify(App);

/// #if PRODUCTION

import { run } from '@cycle/run';

const drivers = {
  DOM: makeDOMDriver('#app'),
};
run(main as any, drivers);

/// #else

import { setup } from '@cycle/run';
import isolate from '@cycle/isolate';
import { restartable, rerunner } from 'cycle-restart';

const driverFn = () => ({
  DOM: restartable(makeDOMDriver('#app'), {
    pauseSinksWhileReplaying: false,
  }),
});
const rerun = rerunner(setup, driverFn, isolate);
rerun(main);

if (module.hot) {
  module.hot.accept('./app', () => {
    const newApp = require<any>('./app').App;

    rerun(onionify(newApp));
  });
}

/// #endif
