/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EnvelopeOverlay from '../components/EnvelopeOverlay';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CountdownSection from '../components/CountdownSection';
import StorySection from '../components/StorySection';
import DetailsSection from '../components/DetailsSection';
import LocationSection from '../components/LocationSection';
import ScheduleSection from '../components/ScheduleSection';
import GallerySection from '../components/GallerySection';
import WishesSection from '../components/WishesSection';
import Footer from '../components/Footer';
import { fetchInviteBySlug } from '../services/invitesService';

export default function Home() {
  const { slug } = useParams();
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(Boolean(slug));
  const [inviteNotFound, setInviteNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setGuestName('');
      setInviteLoading(false);
      setInviteNotFound(false);
      return;
    }

    let cancelled = false;

    const loadInvite = async () => {
      setInviteLoading(true);
      setInviteNotFound(false);

      try {
        const invite = await fetchInviteBySlug(decodeURIComponent(slug));
        if (cancelled) return;

        if (invite) {
          setGuestName(invite.name);
        } else {
          setGuestName('');
          setInviteNotFound(true);
        }
      } catch {
        if (!cancelled) {
          setGuestName('');
          setInviteNotFound(true);
        }
      } finally {
        if (!cancelled) setInviteLoading(false);
      }
    };

    loadInvite();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (inviteLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (inviteNotFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <p className="font-display text-2xl text-charcoal">الدعوة غير موجودة</p>
        <p className="mt-2 text-charcoal/60">تأكد من صحة الرابط أو تواصل مع صاحب الدعوة</p>
        <a
          href="/"
          className="mt-6 rounded-full bg-gold px-6 py-2 text-white transition-colors hover:bg-gold/90"
        >
          الذهاب للصفحة الرئيسية
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection guestName={guestName} />
        <CountdownSection />
        <StorySection />
        <DetailsSection />
        <LocationSection />
        <ScheduleSection />
        <GallerySection />
        <WishesSection defaultName={guestName} />
      </main>
      <Footer />

      {!envelopeOpened && (
        <EnvelopeOverlay guestName={guestName} onOpen={() => setEnvelopeOpened(true)} />
      )}
    </div>
  );
}
