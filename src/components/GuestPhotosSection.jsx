/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { FaCamera, FaCheckCircle, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import {
  uploadGuestPhotoWithProgress,
  validateImageFile,
} from '../services/cloudinaryService';
import { fetchGuestPhotos, submitGuestPhoto } from '../services/guestPhotosService';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function UploadProgressBar({ progress, label }) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs text-charcoal/60">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-beige">
        <div
          className="h-full rounded-full bg-gradient-to-l from-gold to-gold-light transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function PhotoSlide({ photo }) {
  return (
    <div className="group relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-2xl shadow-xl shadow-gold/10">
      <img
        src={photo.imageUrl}
        alt={photo.caption}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-16">
        <p className="font-medium text-white">{photo.caption}</p>
      </div>
    </div>
  );
}

export default function GuestPhotosSection({ defaultCaption = '' }) {
  const [caption, setCaption] = useState(defaultCaption);
  const [previewUrl, setPreviewUrl] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudinaryAsset, setCloudinaryAsset] = useState(null);
  const [status, setStatus] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const uploadIdRef = useRef(0);
  const previewUrlRef = useRef('');

  useEffect(() => {
    if (defaultCaption) setCaption(defaultCaption);
  }, [defaultCaption]);

  const loadPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    try {
      const data = await fetchGuestPhotos({ visibleOnly: true });
      setPhotos(data);
    } catch {
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const resetUploadState = () => {
    uploadIdRef.current += 1;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    setPreviewUrl('');
    setCloudinaryAsset(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startCloudinaryUpload = async (selectedFile) => {
    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      setStatus({ type: 'error', text: validationError });
      return;
    }

    const currentUploadId = uploadIdRef.current + 1;
    uploadIdRef.current = currentUploadId;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const objectUrl = URL.createObjectURL(selectedFile);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setCloudinaryAsset(null);
    setUploadProgress(0);
    setIsUploading(true);
    setStatus({ type: '', text: '' });

    try {
      const result = await uploadGuestPhotoWithProgress(selectedFile, (progress) => {
        if (uploadIdRef.current === currentUploadId) {
          setUploadProgress(progress);
        }
      });

      if (uploadIdRef.current !== currentUploadId) return;

      setCloudinaryAsset(result);
      setUploadProgress(100);
      setStatus({ type: 'success', text: 'تم رفع الصورة — أكمل الاسم واضغط إرسال' });
    } catch (error) {
      if (uploadIdRef.current !== currentUploadId) return;

      setStatus({
        type: 'error',
        text: error.message || 'حدث خطأ أثناء رفع الصورة',
      });
      resetUploadState();
    } finally {
      if (uploadIdRef.current === currentUploadId) {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    startCloudinaryUpload(selectedFile);
  };

  const clearFile = () => {
    if (isUploading) return;
    resetUploadState();
    setStatus({ type: '', text: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    if (!cloudinaryAsset) {
      setStatus({
        type: 'error',
        text: isUploading ? 'انتظر حتى ينتهي رفع الصورة' : 'يرجى اختيار صورتك مع العريس',
      });
      return;
    }

    if (!caption.trim()) {
      setStatus({ type: 'error', text: 'يرجى كتابة اسم أو رسالة مع الصورة' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitGuestPhoto({
        caption,
        imageUrl: cloudinaryAsset.imageUrl,
        publicId: cloudinaryAsset.publicId,
      });
      setStatus({
        type: 'success',
        text: 'تم إرسال صورتك بنجاح! شكراً لمشاركتك فرحتنا 📸',
      });
      setCaption(defaultCaption || '');
      resetUploadState();
      await loadPhotos();
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || 'حدث خطأ أثناء حفظ الصورة',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadyToSubmit = Boolean(cloudinaryAsset) && !isUploading && !isSubmitting;

  return (
    <section id="guest-photos" className="overflow-hidden bg-cream py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-script text-xl text-rose-gold">سجّل حضورك</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            أثبت حضورك بصورتك مع العريس
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
            ارفع صورتك مع د. أحمد لتأكيد حضورك وتكون جزءاً من ألبوم ذكريات الحفل
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl rounded-2xl border border-beige bg-white p-8 shadow-lg"
        >
          <div className="mb-6">
            <label htmlFor="photo-caption" className="mb-2 block text-sm font-medium text-charcoal">
              اسمك أو رسالة مع الصورة
            </label>
            <input
              id="photo-caption"
              type="text"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="مثال: أحمد — مع أجمل العريس"
              className="w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus:border-gold"
            />
          </div>

          <div className="mb-6">
            <span className="mb-2 block text-sm font-medium text-charcoal">صورتك</span>
            <input
              ref={fileInputRef}
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            {previewUrl ? (
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-beige">
                  <img
                    src={previewUrl}
                    alt="معاينة الصورة"
                    className={`max-h-72 w-full object-cover transition-opacity ${
                      isUploading ? 'opacity-70' : 'opacity-100'
                    }`}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                  {cloudinaryAsset && !isUploading && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-600/90 px-3 py-1 text-xs text-white">
                      <FaCheckCircle />
                      جاهزة
                    </div>
                  )}
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                      aria-label="إزالة الصورة"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {(isUploading || uploadProgress > 0) && (
                  <UploadProgressBar
                    progress={uploadProgress}
                    label={isUploading ? 'جاري رفع الصورة  ...' : 'تم رفع الصورة بنجاح'}
                  />
                )}
              </div>
            ) : (
              <label
                htmlFor="photo-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-beige bg-cream/60 px-6 py-10 transition-colors hover:border-gold hover:bg-cream"
              >
                <FaCamera className="mb-3 text-3xl text-gold/70" />
                <p className="font-medium text-charcoal">اضغط لاختيار صورة</p>
                <p className="mt-1 text-sm text-charcoal/50">JPG, PNG, WEBP — حتى 5 ميجابايت</p>
              </label>
            )}
          </div>

          {status.text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 text-center text-sm ${
                status.type === 'success' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {status.text}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={!isReadyToSubmit}
            whileHover={{ scale: isReadyToSubmit ? 1.02 : 1 }}
            whileTap={{ scale: isReadyToSubmit ? 0.98 : 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCloudUploadAlt />
            {isSubmitting
              ? 'جاري الإرسال...'
              : isUploading
                ? 'جاري رفع الصورة...'
                : 'رفع الصورة'}
          </motion.button>
        </motion.form>

        {loadingPhotos ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-beige bg-white py-14 text-center"
          >
            <FaCamera className="mx-auto mb-3 text-4xl text-gold/40" />
            <p className="text-charcoal/60">كن أول من يرفع صورة مع العريس</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 text-center">
              <p className="text-sm text-charcoal/50">{photos.length} صورة في الألبوم</p>
            </div>

            <Swiper
              modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 18,
                stretch: 0,
                depth: 120,
                modifier: 1.2,
                slideShadows: true,
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation
              pagination={{ clickable: true }}
              className="guest-photos-swiper !overflow-visible !pb-14"
            >
              {photos.map((photo) => (
                <SwiperSlide key={photo.id} className="!w-[280px] sm:!w-[300px]">
                  <PhotoSlide photo={photo} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>
    </section>
  );
}
