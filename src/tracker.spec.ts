import test from 'ava';
import { GoogleAnalyticsTracker } from './tracker';

test('Should throw if no event', async (t) => {
  const tracker = new GoogleAnalyticsTracker('UA-12345678-1');
  await t.throws(tracker.track(null));
});
