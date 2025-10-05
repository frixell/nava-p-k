export const cloudinaryEnv = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ?? ''
};

export const isCloudinaryConfigured = (): boolean =>
    Boolean(cloudinaryEnv.cloudName && cloudinaryEnv.uploadPreset);

export const logMissingCloudinaryConfig = () => {
    if (process.env.NODE_ENV !== 'production' && !isCloudinaryConfigured()) {
        // eslint-disable-next-line no-console
        console.error('Cloudinary environment variables are missing. Configure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.');
    }
};
