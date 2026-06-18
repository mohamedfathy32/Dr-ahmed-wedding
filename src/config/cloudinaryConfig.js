export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsisurv9k',
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Upload image',
  folder: 'wedding/guest-photos',
};
