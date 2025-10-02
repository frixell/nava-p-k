import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { NewsletterFormData } from '../utils/dataTransformers';
import { NewsletterSubscriptionResult, registerNewsletterSubscriber } from '../services/newsletterService';

type RootState = any;
type AppThunk<ReturnType = Promise<NewsletterSubscriptionResult>> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export const subscribeToNewsletter = (newsletterData: NewsletterFormData): AppThunk => {
    return async () => {
        return registerNewsletterSubscriber(newsletterData);
    };
};
