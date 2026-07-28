'use client';

import { FeatureCard } from '@/components/ui/FeatureCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { FEATURES } from '@/lib/constants';

export function Features() {
  return (
    <section id="features" className="relative bg-ink px-6 py-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <AnimatedText
            as="h2"
            text="The details you feel."
            className="font-display text-fluid-md leading-[0.95] text-sand"
          />
          <p className="max-w-sm text-dune">
            Nothing here is decorative. Every choice earns its place on your foot.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} index={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
