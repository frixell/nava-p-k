import React from 'react';

const ContactFollow = (props) => (
    <div className={`contact__follow__box--${props.style}`}>
        <div className={`contact__follow__facebook__icon--${props.style}__hover`} />
        <div className={`contact__follow__instagram__icon--${props.style}__hover`} />
        <h3 className={`contact__follow__header--${props.style} Heebo-Medium`}>רשתות חברתיות</h3>
        <div className={`contact__follow__icon__box--${props.style}`}>
            <div className={`contact__follow__instagram__icon--${props.style}`} />
            <div className={`contact__follow__facebook__icon--${props.style}`} />
        </div>
    </div>
);

export default ContactFollow;