import { Hero } from '@/components/sections/Hero';
import { StorySection } from '@/components/sections/StorySection';
import { VideoShowcase } from '@/components/sections/VideoShowcase';
import { SceneSection } from '@/components/sections/SceneSection';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Gallery } from '@/components/sections/Gallery';
import { Loved } from '@/components/sections/Loved';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/ui/Footer';

/**
 * Home — server component that composes the client sections.
 * Section order mirrors the storytelling brief:
 * Hero → Story → Showcase → 3D Scene → Features → Stats → Gallery → Loved → CTA → Footer
 */
export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      {/* <VideoShowcase /> */}
      {/* <SceneSection /> */}
      <Features />
      <Stats />
      <Gallery />
      <Loved />
      <FinalCTA />
      <Footer />
    </>
  );
}
