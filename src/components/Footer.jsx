import { weddingData } from '../data/weddingData';

const DEVELOPER_WHATSAPP = '201094976357';

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
        <p className="mt-4 text-sm text-white/50">
          تم التصميم والتطوير بواسطة{' '}
          <a
            href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold-light transition-colors hover:text-gold hover:underline"
          >
            محمد فتحي
          </a>
        </p>
      </div>
    </footer>
  );
}
