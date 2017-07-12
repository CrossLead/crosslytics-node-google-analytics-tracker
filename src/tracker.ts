import { Identity, TrackedEvent, Tracker } from 'crosslytics';
import * as ua from 'universal-analytics';
import { getLabelAndValue } from './util/getLabelAndValue';

export class GoogleAnalyticsTracker implements Tracker {
  /**
   * @see {@link https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md}
   */
  public persistentParams: { [key: string]: any };
  protected visitor: ua.Visitor;

  constructor(public id: string) {}

  public identify(identity: Identity) {
    this.visitor = ua(this.id);
    this.visitor.set('uid', identity.userId);
  }

  public async track<T>(event: TrackedEvent<T>) {
    if (!this.visitor) {
      throw new Error('Visitor not set. Please call .identify() first');
    }

    Object.keys(this.persistentParams).forEach((key) => {
      this.visitor.set(key, this.persistentParams[key]);
    });

    const params: ua.EventParams = {
      ea: event.name,
      ec: event.category,
    };

    const labelAndVal = getLabelAndValue(event);
    if (labelAndVal[0] !== undefined) {
      params.el = labelAndVal[0];
    }
    if (labelAndVal[1] !== undefined) {
      params.ev = labelAndVal[1];
    }

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
