import { motion } from 'framer-motion';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { weddingData } from '../data/weddingData';

export default function LocationSection() {
  const handleOpenMap = () => {
    window.open(weddingData.location.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="location" className="bg-beige py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 font-script text-xl text-rose-gold">الموقع</p>
          <h2 className="mb-4 font-display text-3xl text-charcoal">
            {weddingData.details.venue}
          </h2>
          <p className="mb-8 text-charcoal/70">{weddingData.details.address}</p>

          <motion.button
            type="button"
            onClick={handleOpenMap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3 text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            <FaMapMarkedAlt />
            {weddingData.location.label}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
