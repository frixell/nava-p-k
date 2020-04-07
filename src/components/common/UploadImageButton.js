import React from 'react';

const UploadImageButton = (props) => (
    <button
        data-action={props.action}
        data-field={props.field}
        data-index={props.id}
        data-name={props.name}
        className={props.cssClass ? props.cassClass : "common__image__upload-button"}
    >
        <img
            data-action={props.action}
            data-field={props.field}
            data-index={props.id}
            data-name={props.name}
            onClick={props.uploadWidget}
            className="common__image__upload-button__image"
            src="/images/common/upload-image.svg"
             alt="הוספת תמונה"
        />
    </button>
);

export default UploadImageButton;