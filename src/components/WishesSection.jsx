import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { submitWish } from '../services/wishesService';

export default function WishesSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setName('');
      setMessage('');
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
      <div className="mx-auto max-w-2xl px-4">
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
          className="rounded-2xl border border-beige bg-white p-8 shadow-lg"
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
              className={`mb-4 text-center text-sm ${
                status.type === 'success' ? 'text-green-600' : 'text-red-500'
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
      </div>
    </section>
  );
}
