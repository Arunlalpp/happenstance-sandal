import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // Cool graphite-and-platinum system (grounded in the sandal's hardware and glow)
                ink: '#0A0C10', // base — cool near-black graphite
                umber: '#14171D', // raised surfaces / cards
                cocoa: '#1D2128', // hover surfaces
                sand: '#EDEFF3', // primary text — soft platinum white
                dune: '#8890A0', // muted secondary / captions — cool slate
                bronze: '#AEC2D6', // primary accent — brushed steel / platinum
                ember: '#C96B57', // rare warm accent — controlled contrast against the cool palette
            },
            fontFamily: {
                display: ['var(--font-display)', 'serif'],
                sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
            },
            letterSpacing: {
                tightest: '-0.05em',
                label: '0.28em',
            },
            fontSize: {
                // fluid display scale
                'fluid-sm': 'clamp(1.75rem, 4vw, 3rem)',
                'fluid-md': 'clamp(2.5rem, 7vw, 5.5rem)',
                'fluid-lg': 'clamp(3rem, 11vw, 10rem)',
                'fluid-xl': 'clamp(4rem, 16vw, 16rem)',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                glass: '0 8px 40px -12px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(237,239,243,0.06)',
                'glow-bronze': '0 0 60px -10px rgba(174,194,214,0.5)',
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
                shimmer: 'shimmer 3s linear infinite',
            },
        },
    },
    plugins: [],
};

export default config;
