'use client';

import { VideoSection } from '@/components/ui/VideoSection';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE, VIDEOS } from '@/lib/constants';

export function FinalCTA() {
    return (
        <section
            id="cta"
            className="relative flex min-h-[90svh] items-center overflow-hidden bg-ink px-6 md:px-10"
        >
            {/* ambient video wash behind the CTA */}
            <div className="absolute inset-0 opacity-40">
                <VideoSection
                    src={VIDEOS.story.src}
                    poster={VIDEOS.story.poster}
                    mode="autoplay"
                    rounded={false}
                    className="h-full w-full"
                />
            </div>
            <div className="absolute inset-0 bg-ink/60" />

            <div className="relative z-10 mx-auto max-w-[1600px]">
                <p className="font-mono text-xs uppercase tracking-label text-bronze">
                    Limited first run
                </p>
                <AnimatedText
                    as="h2"
                    text="Experience premium comfort."
                    splitBy="word"
                    className="mt-6 max-w-4xl font-display text-fluid-md leading-[0.95] text-sand"
                />
                <p className="mt-8 max-w-md text-lg text-dune">
                    The first {SITE.name} run is 300 pairs, made to order. Reserve yours and we will
                    fit you when the bench opens.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                    <MagneticButton href="#">Shop now — $240</MagneticButton>
                    <MagneticButton href="#story" variant="ghost">
                        Read the story
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
