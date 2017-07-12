import { Identity } from 'crosslytics';

export interface GoogleAnalyticsIdentity extends Identity {
  traits: {
    email: string,
    name: string,
    accountId: string,
  };
}
