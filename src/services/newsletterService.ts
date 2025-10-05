import { firebase } from '../firebase/firebase';
import 'firebase/database';
import {
  NewsletterFormData,
  NewsletterRecord,
  createNewsletterRecord,
  createNewsletterApiPayload
} from '../utils/dataTransformers';
import apiClient from './apiClient';

const DEFAULT_NEWSLETTER_API_URL =
  process.env.NEWSLETTER_API_URL ||
  'https://ssl-vp.com/rest/v1/Contacts?updateIfExists=true&restoreIfDeleted=true&restoreIfUnsubscribed=true&api_key=68701475-bf12-46b4-8854-8bd40b8d09ad';
const DEFAULT_NEWSLETTER_LIST_ID = process.env.NEWSLETTER_LIST_ID || '476816';

export interface NewsletterSubscriptionResult {
  id: string | null;
  record: NewsletterRecord;
  apiRequestSucceeded: boolean;
}

export const registerNewsletterSubscriber = async (
  data: NewsletterFormData
): Promise<NewsletterSubscriptionResult> => {
  const record = createNewsletterRecord(data);
  let apiRequestSucceeded = true;

  try {
    await apiClient.post(
      DEFAULT_NEWSLETTER_API_URL,
      createNewsletterApiPayload(data, DEFAULT_NEWSLETTER_LIST_ID)
    );
  } catch (error) {
    apiRequestSucceeded = false;
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to sync newsletter subscriber with external service', error);
    }
  }

  const ref = await firebase.database().ref('newsletter').push(record);

  return {
    id: ref.key ?? null,
    record,
    apiRequestSucceeded
  };
};
