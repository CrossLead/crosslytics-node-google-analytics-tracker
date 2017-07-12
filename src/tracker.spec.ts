import test from 'ava';
import { GoogleAnalyticsTracker } from './tracker';

test('Should throw if calling .track() before .identify()', async (t) => {
  const tracker = new GoogleAnalyticsTracker('UA-12345678-1');
  const err = await t.throws(tracker.track(null));
  t.is(err.message, 'Visitor not set. Please call .identify() first');
});
