import { TrackedEvent, Tracker } from 'crosslytics';
import * as ua from 'universal-analytics';
import { GoogleAnalyticsIdentity } from './identity';
import { getLabelAndValue } from './util/getLabelAndValue';

export class GoogleAnalyticsTracker implements Tracker {
  protected visitor: ua.Visitor;

  // tslint:disable:max-line-length
  /**
   * @param identity Must include the Google Analytics accountId
   * @param persistentParams {@link https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md}
   */
  // tslint:enable:max-line-length
  public identify(identity: GoogleAnalyticsIdentity, persistentParams: { [key: string]: any } = {}) {
    this.visitor = ua(identity.traits.accountId, identity.userId, { strictCidFormat: false });
    Object.keys(persistentParams).forEach((key) => {
      this.visitor.set(key, persistentParams[key]);
    });
  }

  public async track<T>(event: TrackedEvent<T>) {
    if (!this.visitor) {
      throw new Error('Visitor not set. Please call .identify() first');
    }

    const params: ua.EventParams = {
      ea: event.name,
      ec: event.category,
    };

    const labelAndVal = getLabelAndValue(event);

    return new Promise<void>((resolve, reject) => {
      this.visitor.event(params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
