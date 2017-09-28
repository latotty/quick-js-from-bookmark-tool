import { setup, run } from '@cycle/run';
import { restartable, rerunner } from 'cycle-restart';
import { makeDOMDriver } from '@cycle/dom';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';

import { App } from './app';

const main = onionify(App);

let drivers: any, driverFn: any;
/// #if PRODUCTION
drivers = {
  DOM: makeDOMDriver('#app'),
};
/// #else
driverFn = () => ({
  DOM: restartable(makeDOMDriver('#app'), {
    pauseSinksWhileReplaying: false,
  }),
});
/// #endif
export const driverNames: string[] = Object.keys(drivers || driverFn());

/// #if PRODUCTION
run(main as any, drivers);
/// #else
const rerun = rerunner(setup, driverFn, isolate);
rerun(main);

if (module.hot) {
  module.hot.accept('./app', () => {
    const newApp = require<any>('./app').App;

    rerun(onionify(newApp));
  });
}
/// #endif
