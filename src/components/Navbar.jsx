import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { weddingData } from '../data/weddingData';

const navLinks = [
  { href: '#hero', label: 'الرئيسية' },
  { href: '#countdown', label: 'العد التنازلي' },
  { href: '#story', label: 'قصتنا' },
  { href: '#details', label: 'التفاصيل' },
  { href: '#schedule', label: 'الجدول' },
  { href: '#gallery', label: 'المعرض' },
  { href: '#wishes', label: 'التهاني' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);



  const handleLinkClick = () => setIsOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${'border-b border-beige/80 bg-white/95 shadow-md backdrop-blur-md'

        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a
          href="#hero"
          className={`font-display text-xl sm:text-2xl ${'text-gold'
            }`}
        >
          {weddingData.displayName}
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${'text-charcoal/80 hover:text-gold'
                }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className='text-charcoal md:hidden'
          onClick={() => setIsOpen(!isOpen)}
          aria-label="القائمة"
        >
          {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`border-t px-4 py-4 md:hidden ${'border-beige bg-white/95'
            }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`block py-2 ${'text-charcoal/80 hover:text-gold'
                }`}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
