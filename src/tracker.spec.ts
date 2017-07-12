import test from 'ava';
import { GoogleAnalyticsTracker } from './tracker';

test('Should throw if no identity', async (t) => {
  const tracker = new GoogleAnalyticsTracker();
  await t.throws(tracker.track(null));
});
