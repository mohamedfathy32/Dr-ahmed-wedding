import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { weddingData } from '../data/weddingData';

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/20 bg-white shadow-lg sm:h-24 sm:w-24">
        <span className="font-display text-3xl text-gold sm:text-4xl">{value}</span>
      </div>
      <span className="mt-3 text-sm text-charcoal/60">{label}</span>
    </div>
  );
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <p className="font-display text-2xl text-gold">اليوم الكبير وصل! 🎉</p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
      <CountdownUnit value={days} label="يوم" />
      <CountdownUnit value={hours} label="ساعة" />
      <CountdownUnit value={minutes} label="دقيقة" />
      <CountdownUnit value={seconds} label="ثانية" />
    </div>
  );
};

export default function CountdownSection() {
  return (
    <section id="countdown" className="bg-beige py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-2 font-script text-xl text-rose-gold">العد التنازلي</p>
          <h2 className="mb-12 font-display text-3xl text-charcoal sm:text-4xl">
            ننتظركم قريبًا
          </h2>
          <Countdown date={weddingData.weddingDate} renderer={renderer} />
        </motion.div>
      </div>
    </section>
  );
}
