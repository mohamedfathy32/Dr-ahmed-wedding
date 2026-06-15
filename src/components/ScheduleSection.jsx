import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';

export default function ScheduleSection() {
  return (
    <section id="schedule" className="bg-cream py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-script text-xl text-rose-gold">جدول الحفل</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            برنامج اليوم
          </h2>
        </motion.div>

        <div className="space-y-4">
          {weddingData.schedule.map((item, index) => (
            <motion.div
              key={item.event}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-6 rounded-2xl border border-beige bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-gold/10">
                <span className="font-display text-lg text-gold">{item.time} </span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-charcoal">{item.event}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
