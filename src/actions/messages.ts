import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ContactFormInput } from '../utils/dataTransformers';
import { ContactMessageResult, submitContactMessage } from '../services/contactService';

type RootState = any;
type AppThunk<ReturnType = Promise<ContactMessageResult>> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export const sendMessage = (message: ContactMessageResult) => ({
    type: 'SEND_MESSAGE',
    message
});

export const startSendMessage = (messageData: ContactFormInput): AppThunk => {
    return async (dispatch) => {
        const result = await submitContactMessage(messageData);
        dispatch(sendMessage(result));
        return result;
    };
};
