import { Identity, TrackedEvent, Tracker } from 'crosslytics';
import * as ua from 'universal-analytics';
import { isNumber } from 'util';
import { getLabelAndValue } from './util/getLabelAndValue';

export interface GoogleAnalyticsIdentity extends Identity {
  traits: {
    email: string,
    name: string,
    accountId: string,
  } & ua.VisitorOptions;
}

export class GoogleAnalyticsTracker implements Tracker {
  protected visitor: ua.Visitor;

  public identify(identity: GoogleAnalyticsIdentity) {
    // TODO: Include organization
    this.visitor = ua(identity.traits.accountId, identity.userId, identity.traits);
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
