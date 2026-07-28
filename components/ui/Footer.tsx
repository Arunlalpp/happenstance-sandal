'use client';

import { FiInstagram, FiTwitter, FiArrowUpRight } from 'react-icons/fi';
import { AnimatedText } from './AnimatedText';
import { SITE, NAV } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-sand/10 bg-ink px-6 pb-10 pt-24 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <AnimatedText
          as="h2"
          text="Walk into it."
          className="font-display text-fluid-lg leading-[0.9] text-sand"
        />

        <div className="mt-16 flex flex-col justify-between gap-10 border-t border-sand/10 pt-10 md:flex-row">
          <div className="max-w-sm">
            <p className="font-mono text-xs uppercase tracking-label text-bronze">
              The Happenstance Club
            </p>
            <p className="mt-3 text-dune">
              New colorways, restocks, and repair clinics. No noise.
            </p>
            <form className="mt-6 flex items-center gap-2 border-b border-sand/20 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full bg-transparent text-sand placeholder:text-dune/60 focus:outline-none"
              />
              <button aria-label="Subscribe" className="text-bronze transition hover:text-sand">
                <FiArrowUpRight size={22} />
              </button>
            </form>
          </div>

          <nav className="flex gap-16">
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sand/80 transition hover:text-bronze">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              <li><a href={`mailto:${SITE.email}`} className="text-sand/80 transition hover:text-bronze">Contact</a></li>
              <li><a href="#" className="text-sand/80 transition hover:text-bronze">Repairs</a></li>
              <li><a href="#" className="text-sand/80 transition hover:text-bronze">Sizing</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-sand/10 pt-8 md:flex-row md:items-center">
          <span className="font-mono text-xs text-dune">
            © {new Date().getFullYear()} {SITE.name} Studio. Made for the walk you did not plan.
          </span>
          <div className="flex gap-4 text-sand">
            <a href="#" aria-label="Instagram" className="transition hover:text-bronze"><FiInstagram size={20} /></a>
            <a href="#" aria-label="Twitter" className="transition hover:text-bronze"><FiTwitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
