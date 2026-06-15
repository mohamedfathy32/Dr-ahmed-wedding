import { motion } from 'framer-motion';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { weddingData } from '../data/weddingData';

function getMapEmbedUrl() {
  if (weddingData.location.embedUrl) {
    return weddingData.location.embedUrl;
  }

  const query = encodeURIComponent(
    `${weddingData.details.venue}, ${weddingData.details.address}`,
  );
  return `https://www.google.com/maps?q=${query}&hl=ar&z=17&output=embed`;
}

export default function LocationSection() {
  const mapEmbedUrl = getMapEmbedUrl();

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-8 overflow-hidden rounded-2xl border border-beige bg-white shadow-lg"
          >
            <div className="relative min-h-[280px] w-full aspect-[16/10] sm:aspect-[16/9]">
              <iframe
                title={`موقع ${weddingData.details.venue}`}
                src={mapEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>

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
