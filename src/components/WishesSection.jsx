/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaPaperPlane, FaQuoteRight } from 'react-icons/fa';
import { fetchWishes, submitWish } from '../services/wishesService';

function formatWishDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const datePart = date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} في ${timePart}`;
}

function getInitial(name) {
  const trimmed = name.trim();
  return trimmed ? trimmed[0] : '؟';
}

function WishCard({ wish, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-beige/80 bg-white p-6 shadow-[0_8px_30px_rgba(201,169,97,0.12)] transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(201,169,97,0.18)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-rose-gold/50 via-gold to-gold-light" />

      <FaQuoteRight
        className="pointer-events-none absolute start-5 top-5 text-4xl text-gold/20 transition-colors duration-300 group-hover:text-gold/30"
        aria-hidden
      />

      <p className="relative z-10 flex-1 pt-10 text-base leading-8 text-charcoal/85">
        {wish.message}
      </p>
      <div className="relative z-10 mt-5 border-t border-beige/90 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold/85 text-lg font-semibold text-white shadow-md shadow-gold/25"
                aria-hidden
              >
                {getInitial(wish.name)}
              </div>
              <p className="truncate font-semibold text-charcoal">
                {wish.name}
                {wish.createdAt && (
                  <p className="mt-0.5 text-xs text-charcoal/45">
                    {formatWishDate(wish.createdAt)}
                  </p>
                )}
              </p>

          </div>
          <FaHeart className="shrink-0 text-sm text-rose-gold/35" aria-hidden />


        </div>
      </div>

    </motion.article>
  );
}

export default function WishesSection({ defaultName = '' }) {
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [loadingWishes, setLoadingWishes] = useState(true);

  useEffect(() => {
    if (defaultName) setName(defaultName);
  }, [defaultName]);

  const loadWishes = useCallback(async () => {
    setLoadingWishes(true);
    try {
      const data = await fetchWishes();
      setWishes(data);
    } catch {
      setWishes([]);
    } finally {
      setLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'يرجى ملء جميع الحقول' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      await submitWish({ name, message });
      setStatus({ type: 'success', text: 'تم إرسال تهنئتك بنجاح! شكرًا لك 💕' });
      setMessage('');
      if (!defaultName) setName('');
      await loadWishes();
    } catch {
      setStatus({
        type: 'error',
        text: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="bg-beige py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-script text-xl text-rose-gold">أرسل تهنئتك</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            شاركنا فرحتنا
          </h2>
          <p className="mt-4 text-charcoal/70">
            يسعدنا قراءة تهانيكن وتهانيكم في هذا اليوم المميز
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-2xl rounded-2xl border border-beige bg-white p-8 shadow-lg"
        >
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal">
              الاسم
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="اكتب اسمك"
              className="w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus:border-gold"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-charcoal">
              رسالة التهنئة
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="اكتب تهنئتك هنا..."
              rows={4}
              className="w-full resize-none rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus:border-gold"
            />
          </div>

          {status.text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 text-center text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-500'
                }`}
            >
              {status.text}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 font-medium text-white transition-opacity disabled:opacity-60"
          >
            <FaPaperPlane />
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التهنئة'}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-10 text-center">
            <p className="mb-2 font-script text-xl text-rose-gold">رسائل المحبة</p>
            <h3 className="font-display text-2xl text-charcoal sm:text-3xl">
              تهاني الأصدقاء والأحباب
            </h3>
            {!loadingWishes && wishes.length > 0 && (
              <p className="mt-3 text-sm text-charcoal/50">
                {wishes.length} تهنئة جميلة
              </p>
            )}
          </div>

          {loadingWishes ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : wishes.length === 0 ? (
            <div className="rounded-2xl border border-beige bg-white py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold/10">
                <FaHeart className="text-3xl text-rose-gold/50" />
              </div>
              <p className="text-charcoal/60">كن أول من يرسل تهنئة جميلة</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {wishes.map((wish, index) => (
                <WishCard key={wish.id} wish={wish} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
