import { Hero } from '@/components/sections/Hero';
import { StorySection } from '@/components/sections/StorySection';
import { ScrollStory } from '@/components/sections/ScrollStory';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Gallery } from '@/components/sections/Gallery';
import { Loved } from '@/components/sections/Loved';
import { Packaging } from '@/components/sections/Packaging';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
    return (
        <>
            <Hero />
            <StorySection />
            <ScrollStory />
            <Features />
            <Stats />
            <Gallery />
            <Loved />
            <Packaging />
            <FinalCTA />
            <Footer />
        </>
    );
}
