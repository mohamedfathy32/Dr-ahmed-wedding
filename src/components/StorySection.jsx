import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';

export default function StorySection() {
  return (
    <section id="story" className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl border border-gold/20" />
            <img
              src={weddingData.storyImage}
              alt="قصة الحب"
              className="relative rounded-2xl object-cover shadow-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-2 font-script text-xl text-rose-gold">قصتنا</p>
            <h2 className="mb-6 font-display text-3xl text-charcoal sm:text-4xl">
              {weddingData.groom.fullName}
            </h2>
            <p className="text-lg leading-relaxed text-charcoal/70">
              {weddingData.story}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-l from-gold to-transparent" />
              <span className="font-script text-gold">♥</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
