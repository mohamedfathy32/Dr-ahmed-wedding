import { cloudinaryConfig } from '../config/cloudinaryConfig';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function validateImageFile(file) {
  if (!file) return 'يرجى اختيار صورة';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WEBP';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت';
  }
  return null;
}

export function uploadGuestPhotoWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      reject(new Error(validationError));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', cloudinaryConfig.folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    );

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            imageUrl: data.secure_url,
            publicId: data.public_id,
          });
          return;
        }
        reject(new Error(data.error?.message || 'فشل رفع الصورة. حاول مرة أخرى'));
      } catch {
        reject(new Error('فشل رفع الصورة. حاول مرة أخرى'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('فشل رفع الصورة. تحقق من الاتصال بالإنترنت'));
    });

    xhr.send(formData);
  });
}

export async function uploadGuestPhoto(file) {
  return uploadGuestPhotoWithProgress(file);
}
