import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        /* autoplay blocked until user interaction */
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={weddingData.heroVideo} type="video/mp4" />
          <source src={weddingData.heroVideoFallback} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(201,169,97,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(183,110,121,0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-2 w-2 rounded-full bg-gold/40"
            style={{
              left: `${15 + index * 14}%`,
              top: `${20 + (index % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 font-script text-5xl text-gold-light sm:text-6xl"
        >
          دعوة زفاف
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl leading-tight sm:text-7xl md:text-8xl"
        >
          {weddingData.displayName}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto my-6 h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto max-w-2xl text-2xl leading-relaxed text-gold-light sm:text-4xl font-bold"
        >
          {weddingData.welcomeMessage}
        </motion.p>

        <motion.a
          href="#details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto mt-10 inline-block rounded-full border border-gold bg-gold/20 px-8 py-3 font-medium text-gold-light backdrop-blur-sm transition-colors hover:bg-gold hover:text-white"
        >
          تفاصيل الحفل
        </motion.a>
      </div>

    </section>
  );
}
