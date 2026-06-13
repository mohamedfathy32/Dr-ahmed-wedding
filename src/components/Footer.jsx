import { weddingData } from '../data/weddingData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal py-12 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="mb-4 font-script text-2xl text-gold-light">
          {weddingData.footerMessage}
        </p>
        <div className="mx-auto mb-6 h-px w-24 bg-gold/40" />
        <p className="font-display text-lg text-white/80">
          {weddingData.displayName}
        </p>
        <p className="mt-6 text-sm text-white/40">
          © {year} جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
