import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { weddingData } from '../data/weddingData';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function GallerySection() {
  return (
    <section id="gallery" className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-script text-xl text-rose-gold">معرض الصور</p>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            لحظات لا تُنسى
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="gallery-swiper !overflow-hidden !pb-12"
          >
            {weddingData.gallery.map((image) => (
              <SwiperSlide key={image.src} className="!w-72 sm:!w-80">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-80 w-full rounded-2xl object-cover shadow-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
