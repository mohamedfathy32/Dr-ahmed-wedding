import { useState } from 'react';
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

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <CountdownSection />
        <StorySection />
        <DetailsSection />
        <LocationSection />
        <ScheduleSection />
        <GallerySection />
        <WishesSection />
      </main>
      <Footer />

      {!envelopeOpened && (
        <EnvelopeOverlay onOpen={() => setEnvelopeOpened(true)} />
      )}
    </div>
  );
}
