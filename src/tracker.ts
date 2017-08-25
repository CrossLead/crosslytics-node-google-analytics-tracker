import { Identity, Page, TrackedEvent, Tracker } from 'crosslytics';
import * as ua from 'universal-analytics';
import { getLabelAndValue } from './util/getLabelAndValue';

export class GoogleAnalyticsTracker implements Tracker {
  /**
   * @see {@link https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md}
   */
  public persistentParams: { [key: string]: any };
  protected visitor: ua.Visitor;

  constructor(public id: string) {
    this.visitor = ua(this.id);
  }

  public identify(identity: Identity) {
    this.visitor.set('uid', identity.userId);
  }

  public async track<T>(event: TrackedEvent<T>) {
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
      this.visitor.event({...this.persistentParams, ...params}, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async page(page: Page) {
    // Fancy: https://github.com/tc39/proposal-object-rest-spread/issues/45
    const params: ua.PageviewParams = {
      dl: page.url,
      ...page.title && { dt: page.title },
      ...page.referrer && { dr: page.referrer},
    };

    return new Promise<void>((resolve, reject) => {
      this.visitor.pageview({...this.persistentParams, ...params}, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
