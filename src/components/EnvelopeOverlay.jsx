import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { weddingData } from '../data/weddingData';
import { useWindowSize } from '../hooks/useWindowSize';

function FloralWreath() {
  return (
    <svg viewBox="0 0 300 80" fill="none" className="mx-auto w-full max-w-[260px]">
      <path d="M20 55 Q80 15 150 25 Q220 15 280 55" stroke="#C9A961" strokeWidth="1" opacity="0.5" />
      <ellipse cx="55" cy="38" rx="14" ry="10" fill="#E8B4B8" opacity="0.55" />
      <ellipse cx="45" cy="32" rx="10" ry="8" fill="#D4969C" opacity="0.5" />
      <ellipse cx="65" cy="30" rx="9" ry="7" fill="#C4828E" opacity="0.45" />
      <ellipse cx="150" cy="22" rx="16" ry="12" fill="#E8B4B8" opacity="0.6" />
      <ellipse cx="138" cy="16" rx="11" ry="9" fill="#D4969C" opacity="0.55" />
      <ellipse cx="162" cy="16" rx="11" ry="9" fill="#C4828E" opacity="0.5" />
      <ellipse cx="245" cy="38" rx="14" ry="10" fill="#E8B4B8" opacity="0.55" />
      <ellipse cx="235" cy="32" rx="10" ry="8" fill="#D4969C" opacity="0.5" />
      <ellipse cx="255" cy="30" rx="9" ry="7" fill="#C4828E" opacity="0.45" />
      <path d="M48 48 Q55 38 62 48" stroke="#7A9E72" strokeWidth="1" opacity="0.5" />
      <path d="M238 48 Q245 38 252 48" stroke="#7A9E72" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function CardBorderArt() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 360 640" fill="none">
      <rect x="16" y="16" width="328" height="608" rx="6" stroke="#C9A961" strokeWidth="0.8" opacity="0.35" />
      <rect x="24" y="24" width="312" height="592" rx="4" stroke="#C9A961" strokeWidth="0.5" opacity="0.2" />
      <path d="M16 16 H50 V24 H24 V50 H16 Z" fill="#C9A961" opacity="0.25" />
      <path d="M344 16 H310 V24 H336 V50 H344 Z" fill="#C9A961" opacity="0.25" />
      <path d="M16 624 H50 V616 H24 V590 H16 Z" fill="#C9A961" opacity="0.25" />
      <path d="M344 624 H310 V616 H336 V590 H344 Z" fill="#C9A961" opacity="0.25" />
      <ellipse cx="50" cy="580" rx="22" ry="16" fill="#E8B4B8" opacity="0.2" />
      <ellipse cx="310" cy="580" rx="22" ry="16" fill="#E8B4B8" opacity="0.2" />
      <ellipse cx="50" cy="60" rx="18" ry="13" fill="#E8B4B8" opacity="0.15" />
      <ellipse cx="310" cy="60" rx="18" ry="13" fill="#E8B4B8" opacity="0.15" />
    </svg>
  );
}

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-rose-gold/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-12 bottom-1/3 h-48 w-48 rounded-full bg-gold/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-gold/15 blur-2xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}

export default function EnvelopeOverlay({ onOpen, guestName = '' }) {
  const envelopeMessage = guestName
    ? `هذه الدعوة خاصة بـ ${guestName}`
    : weddingData.envelopeMessage;
  const [isVisible, setIsVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setShowConfetti(true);
    setTimeout(() => {
      setIsVisible(false);
      onOpen?.();
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="invite-screen fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <BackgroundOrbs />

          {showConfetti && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={420}
              colors={['#C9A961', '#B76E79', '#F5F0EB', '#D4AF37', '#E8B4B8', '#FFF']}
            />
          )}

          <motion.div
            className="relative z-10 w-full max-w-[380px]"
            animate={
              isOpening
                ? { scale: 0.85, opacity: 0, y: -40, rotateX: 15 }
                : { scale: 1, opacity: 1, y: 0, rotateX: 0 }
            }
            transition={{ duration: 1.2, delay: isOpening ? 0.6 : 0 }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="invite-card relative mx-auto cursor-pointer overflow-hidden rounded-2xl"
              style={{
                height: 'min(78dvh, 640px)',
                maxHeight: 'calc(100dvh - 80px)',
              }}
              onClick={handleOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
              aria-label="افتح الدعوة"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              animate={isOpening ? { rotateY: [0, 8, 0] } : {}}
            >
              <CardBorderArt />

              {/* Paper texture */}
              <div className="invite-texture absolute inset-0 opacity-[0.03]" />

              <div className="relative flex h-full flex-col items-center justify-between px-8 py-10 text-center">
                {/* Top section */}
                <div className="w-full">
                  <FloralWreath />
                  <motion.p
                    className="mt-4 text-[10px] tracking-[0.45em] text-gold/60 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Wedding Invitation
                  </motion.p>
                  <motion.h1
                    className="mt-2 font-script text-4xl text-gold sm:text-5xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    دعوة زفاف
                  </motion.h1>
                </div>

                {/* Center monogram */}
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    className="invite-monogram relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <div className="absolute inset-0 rounded-full border border-gold/30" />
                    <div className="absolute inset-2 rounded-full border border-gold/15" />
                    <span className="font-display text-4xl text-gold sm:text-5xl">
                      {weddingData.sealInitials}
                    </span>
                  </motion.div>

                  <div>
                    <p className="font-display text-xl text-charcoal/80 sm:text-2xl">
                      {weddingData.displayName}
                    </p>
                    <div className="mx-auto my-3 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    <p className="max-w-[260px] text-sm leading-relaxed text-charcoal/55">
                      {guestName
                        ? `يتشرف بدعوتك ${guestName} لمشاركة فرحته في هذا اليوم المميز`
                        : 'يتشرف بدعوتكم لمشاركة فرحته في هذا اليوم المميز'}
                    </p>
                  </div>
                </div>

                {/* Details boxes */}
                <div className="grid w-full grid-cols-2 gap-3">
                  <div className="invite-detail-box rounded-xl px-3 py-3">
                    <p className="text-[9px] tracking-widest text-gold/55">التاريخ</p>
                    <p className="mt-1 text-[11px] leading-snug text-charcoal/65">
                      {weddingData.details.date}
                    </p>
                  </div>
                  <div className="invite-detail-box rounded-xl px-3 py-3">
                    <p className="text-[9px] tracking-widest text-gold/55">المكان</p>
                    <p className="mt-1 text-[11px] leading-snug text-charcoal/65">
                      {weddingData.details.venue}
                    </p>
                  </div>
                </div>

                {/* Wax seal CTA */}
                <motion.div
                  className="flex flex-col items-center gap-3"
                  animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="seal-pulse relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                    <div className="absolute -inset-2 rounded-full bg-rose-gold/25 blur-md" />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 30%, #F0C8CC, #C98E98 45%, #A05A66)',
                        boxShadow:
                          '0 10px 30px rgba(183,110,121,0.5), inset 0 3px 6px rgba(255,255,255,0.4)',
                      }}
                    />
                    <svg className="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)]" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                    </svg>
                    <span className="relative font-display text-lg text-white/95 sm:text-xl">
                      {/* {weddingData.sealInitials.split(' ')[0]} */}
                      أضغط هنا
                    </span>
                  </div>
                  {/* <p className="text-xs tracking-[0.2em] text-charcoal/40">
                    اضغط لفتح الدعوة
                  </p> */}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            className="relative z-10 mt-5 font-script text-lg text-charcoal/50 sm:text-xl"
            animate={{ opacity: isOpening ? 0 : [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {envelopeMessage}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
