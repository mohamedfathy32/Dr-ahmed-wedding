import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { weddingData } from '../data/weddingData';

const detailItems = [
  { icon: FaCalendarAlt, label: 'التاريخ', value: weddingData.details.date },
  { icon: FaClock, label: 'الوقت', value: weddingData.details.time },
  { icon: FaBuilding, label: 'القاعة', value: weddingData.details.venue },
  { icon: FaMapMarkerAlt, label: 'العنوان', value: weddingData.details.address },
];

export default function DetailsSection() {
  return (
    <section id="details" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-script text-xl text-rose-gold">تفاصيل الحفل</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            ننتظركم في يومنا المميز
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {detailItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-beige bg-cream p-6 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <item.icon className="text-xl text-gold" />
              </div>
              <h3 className="mb-2 font-medium text-charcoal">{item.label}</h3>
              <p className="text-charcoal/70">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
