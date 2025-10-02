import { firebase } from '../firebase/firebase';
import 'firebase/database';
import { ContactFormInput, ContactMessageRecord, createContactMessageRecord } from '../utils/dataTransformers';
import { postFormUrlEncoded } from './apiClient';

export interface ContactMessageResult extends ContactMessageRecord {
    id: string;
    emailSent: boolean;
}

export const submitContactMessage = async (
    data: ContactFormInput
): Promise<ContactMessageResult> => {
    const record = createContactMessageRecord(data);
    const ref = await firebase.database().ref('messages').push(record);
    let emailSent = true;

    try {
        await postFormUrlEncoded('/sendEmail', {
            name: record.name,
            email: record.email,
            message: record.message
        });
    } catch (error) {
        emailSent = false;
        if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to send contact email', error);
        }
    }

    return {
        ...record,
        id: ref.key ?? '',
        emailSent
    };
};
