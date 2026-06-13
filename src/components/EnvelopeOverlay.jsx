import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { weddingData } from '../data/weddingData';
import { useWindowSize } from '../hooks/useWindowSize';

export default function EnvelopeOverlay({ onOpen }) {
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
    }, 2600);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFAFA]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {showConfetti && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={350}
              colors={['#C9A961', '#B76E79', '#F5F0EB', '#D4AF37', '#E8B4B8']}
            />
          )}

          <motion.div
            className="relative flex flex-col items-center px-4"
            animate={
              isOpening
                ? { scale: 0.75, opacity: 0, y: -80 }
                : { scale: 1, opacity: 1, y: 0 }
            }
            transition={{ duration: 1.4, delay: isOpening ? 1 : 0 }}
          >
            {/* 3D Scene */}
            <div
              className="relative flex items-center justify-center"
              style={{ perspective: '2000px', perspectiveOrigin: '50% 40%' }}
            >
              {/* Floor shadow */}
              <motion.div
                className="absolute bottom-[-30px] left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-xl"
                animate={{ scale: isOpening ? 1.3 : [1, 1.05, 1], opacity: isOpening ? 0 : [0.25, 0.35, 0.25] }}
                transition={{ duration: 3, repeat: isOpening ? 0 : Infinity }}
              />

              <motion.div
                className="relative cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') handleOpen();
                }}
                aria-label="افتح الدعوة"
                animate={
                  isOpening
                    ? { rotateX: -25, rotateY: 0, z: 0 }
                    : {
                        rotateX: [-18, -12, -18],
                        rotateY: [-6, 6, -6],
                      }
                }
                transition={
                  isOpening
                    ? { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                {/* Envelope container */}
                <div
                  className="relative"
                  style={{
                    width: 'min(88vw, 520px)',
                    height: 'min(58vw, 400px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Back panel - depth layer */}
                  <div
                    className="absolute inset-0 rounded-sm bg-[#E8E8E8]"
                    style={{ transform: 'translateZ(-8px)' }}
                  />

                  {/* Main body */}
                  <div
                    className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#FFFFFF] to-[#F7F7F7]"
                    style={{
                      transform: 'translateZ(0px)',
                      boxShadow:
                        '0 2px 4px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  />

                  {/* Left side depth */}
                  <div
                    className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-[#D5D5D5] to-[#EBEBEB]"
                    style={{
                      transform: 'rotateY(-90deg) translateZ(0px)',
                      transformOrigin: 'left center',
                    }}
                  />

                  {/* Right side depth */}
                  <div
                    className="absolute right-0 top-0 h-full w-3 bg-gradient-to-l from-[#D5D5D5] to-[#EBEBEB]"
                    style={{
                      transform: 'rotateY(90deg) translateZ(0px)',
                      transformOrigin: 'right center',
                    }}
                  />

                  {/* Bottom depth */}
                  <div
                    className="absolute bottom-0 left-0 h-3 w-full bg-gradient-to-t from-[#D0D0D0] to-[#E8E8E8]"
                    style={{
                      transform: 'rotateX(90deg) translateZ(0px)',
                      transformOrigin: 'bottom center',
                    }}
                  />

                  {/* Left diagonal fold */}
                  <div
                    className="absolute left-0 top-0 h-[52%] w-1/2"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, transparent 60%)',
                      clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                      transform: 'translateZ(2px)',
                    }}
                  />

                  {/* Right diagonal fold */}
                  <div
                    className="absolute right-0 top-0 h-[52%] w-1/2"
                    style={{
                      background:
                        'linear-gradient(225deg, rgba(0,0,0,0.03) 0%, transparent 60%)',
                      clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                      transform: 'translateZ(2px)',
                    }}
                  />

                  {/* Fold crease lines - SVG */}
                  <svg
                    className="absolute inset-0 z-[5] h-full w-full"
                    style={{ transform: 'translateZ(4px)' }}
                    viewBox="0 0 520 400"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="260"
                      y2="200"
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="520"
                      y1="0"
                      x2="260"
                      y2="200"
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="0"
                      y1="200"
                      x2="520"
                      y2="200"
                      stroke="rgba(0,0,0,0.06)"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="400"
                      x2="260"
                      y2="200"
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth="1"
                    />
                    <line
                      x1="520"
                      y1="400"
                      x2="260"
                      y2="200"
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Bottom flap */}
                  <div
                    className="absolute bottom-0 left-0 right-0 z-[4] h-[52%]"
                    style={{
                      background: 'linear-gradient(to top, #F2F2F2 0%, #FAFAFA 100%)',
                      clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                      transform: 'translateZ(4px)',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  />

                  {/* Inner invitation card */}
                  <motion.div
                    className="absolute left-[12%] right-[12%] top-[18%] z-[3] rounded-sm bg-gradient-to-b from-[#F5F0EB] to-white"
                    style={{
                      height: '65%',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                    animate={
                      isOpening
                        ? { y: -120, rotateX: -15, opacity: 1, z: 40 }
                        : { y: 8, opacity: 0.7 }
                    }
                    transition={{ duration: 1.2, delay: isOpening ? 0.4 : 0 }}
                  />

                  {/* Top flap - opens in 3D */}
                  <motion.div
                    className="absolute left-0 right-0 top-0 z-[8] origin-top"
                    style={{
                      height: '52%',
                      transformStyle: 'preserve-3d',
                      clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      transform: 'translateZ(8px)',
                    }}
                    animate={
                      isOpening
                        ? { rotateX: -175, y: -10, opacity: 0.5 }
                        : { rotateX: 0, y: 0, opacity: 1 }
                    }
                    transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent" />
                  </motion.div>
                </div>

                {/* Wax seal - outside, on top of all flaps */}
                <div
                  className="pointer-events-none absolute left-1/2 top-[50%] z-[50]"
                  style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}
                >
                  <motion.div
                    className="pointer-events-auto"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    animate={
                      isOpening
                        ? { scale: 0, opacity: 0, rotate: 200, y: -20 }
                        : { scale: 1, opacity: 1, rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.7 }}
                  >
                  <div className="relative flex h-28 w-28 flex-col items-center justify-center sm:h-32 sm:w-32">
                    <div className="absolute -inset-1 rounded-full bg-rose-gold/20 blur-sm" />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 30%, #E8B4B8, #B76E79 50%, #9A5A64 100%)',
                        boxShadow:
                          '0 8px 28px rgba(183,110,121,0.6), inset 0 3px 6px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.15)',
                      }}
                    />
                    <div
                      className="absolute inset-[-4px] rounded-full opacity-60"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(0,0,0,0.1), transparent)',
                      }}
                    />
                    <div className="absolute inset-2 rounded-full border border-white/25" />
                    <span
                      className="relative text-center font-script leading-tight"
                      style={{
                        fontSize: 'clamp(0.85rem, 3.5vw, 1.1rem)',
                        color: 'rgba(255,255,255,0.92)',
                        textShadow:
                          '0 1px 2px rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.3)',
                      }}
                    >
                      {weddingData.sealName}
                    </span>
                    {!isOpening && (
                      <motion.div
                        className="absolute -inset-3 rounded-full border-2 border-rose-gold/25"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.p
              className="mt-10 font-script text-xl text-charcoal/80 sm:text-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isOpening ? 0 : 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {weddingData.envelopeMessage}
            </motion.p>

            {!isOpening && (
              <motion.p
                className="mt-4 text-sm text-charcoal/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                اضغط على الختم لفتح الدعوة
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
