/**
 * Central content model for the Happenstance Sandal page.
 * Keeping copy + asset paths here means components stay presentational
 * and you can re-skin the whole site from one file.
 */

export const SITE = {
    name: 'Happenstance',
    product: 'The Happenstance Sandal',
    tagline: 'Made for the walk you did not plan.',
    email: 'hello@happenstance.studio',
} as const;

export type NavItem = { label: string; href: string };
export const NAV: NavItem[] = [
    { label: 'The Sandal', href: '#story' },
    { label: 'Craft', href: '#showcase' },
    { label: 'In Motion', href: '#scene' },
    { label: 'Details', href: '#features' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#loved' },
];

/**
 * VIDEO ASSETS
 * Drop your MP4s into /public/videos and keep these filenames,
 * or rename here. `poster` shows before the video loads (fast LCP).
 */
export const VIDEOS = {
    hero: { src: '/videos/hero.mp4', poster: '/images/hero-poster.jpg' },
    story: {
        src: '/videos/story.mp4',
        poster: '/images/story-poster.jpg',
        mobileSrc: '/videos/story-mobile.mp4',
        mobilePoster: '/images/story-poster-mobile.jpg',
    },
    loved: { src: '/videos/loved.mp4', poster: '/images/loved-poster.jpg' },
    packaging: {
        src: '/videos/packaging.mp4',
        poster: '/images/packaging-poster.jpg',
        mobileSrc: '/videos/packaging-mobile.mp4',
        mobilePoster: '/images/packaging-poster-mobile.jpg',
    },
    scene: {
        src: '/videos/scene3.mp4',
        poster: '/images/scene-poster.jpg',
        mobileSrc: '/videos/scene3-mobile.mp4',
        mobilePoster: '/images/scene-poster-mobile.jpg',
    },
} as const;

/**
 * Packaging detail beats (components/sections/Packaging.tsx). Revealed one
 * at a time against a sticky video as the section scrolls, mirroring the
 * STORY_BEATS treatment above.
 */
export const PACKAGING_DETAILS = [
    {
        index: '01',
        title: 'Foil-stamped by hand',
        body: 'Each box is press-stamped with the Happenstance mark before a single stitch is sewn.',
    },
    {
        index: '02',
        title: 'FSC-certified stock',
        body: 'Every box comes from a responsibly managed forest, printed with soy-based ink.',
    },
    {
        index: '03',
        title: 'A tray, not a bag',
        body: 'Your pair sits in a fitted pulp tray — no tissue paper built to be thrown away.',
    },
    {
        index: '04',
        title: 'Room to grow old',
        body: 'A spare eyelet, a tin of wax, and a care card ride along in every box.',
    },
    {
        index: '05',
        title: 'Zero single-use plastic',
        body: 'Nothing inside is shrink-wrapped. What arrives is what you keep.',
    },
] as const;

export const STORY_BEATS = [
    {
        index: '01',
        title: 'A sole with memory',
        body: 'Cork and natural latex that take the shape of your foot in a week, then keep it for a decade.',
    },
    {
        index: '02',
        title: 'One piece of leather',
        body: 'Each strap is cut from a single hide, vegetable-tanned, and burnished by hand until it glows.',
    },
    {
        index: '03',
        title: 'Nothing you throw away',
        body: 'Resole it, restrap it, re-oil it. The Happenstance is built to be repaired, not replaced.',
    },
] as const;

export const FEATURES = [
    {
        title: 'Contour cork',
        body: 'A footbed that remembers where you have been.',
        tag: 'Comfort',
    },
    {
        title: 'Vegetable tan',
        body: 'Leather cured with bark, not chemicals. It ages, it does not wear out.',
        tag: 'Material',
    },
    {
        title: 'Blake stitch',
        body: 'A resolable construction borrowed from heritage shoemaking.',
        tag: 'Build',
    },
    {
        title: 'Grip lug outsole',
        body: 'Natural rubber that holds wet stone and warm sand alike.',
        tag: 'Traction',
    },
    {
        title: 'Adjustable throat',
        body: 'A single brass buckle dials the fit from loose to locked.',
        tag: 'Fit',
    },
    {
        title: 'Carbon neutral',
        body: 'Every pair offsets its own footprint, twice over.',
        tag: 'Planet',
    },
] as const;

export const STATS = [
    { value: 40, suffix: 'hrs', label: 'Hand-work per pair' },
    { value: 10, suffix: 'yr', label: 'Designed lifespan' },
    { value: 1, suffix: '', label: 'Hide per sandal' },
    { value: 92, suffix: '%', label: 'Biodegradable by mass' },
] as const;

/**
 * GALLERY IMAGES
 * Drop stills into /public/images and reference them here.
 * Aspect ratios are mixed on purpose for an editorial grid.
 */
export const GALLERY = [
    { src: '/images/gallery-1.jpg', alt: 'Buckle straps in profile, floating', span: 'tall' },
    { src: '/images/gallery-2.jpg', alt: 'Midsole seam under a warm sensor line', span: 'wide' },
    { src: '/images/gallery-3.jpg', alt: 'Outsole tread pattern, top down', span: 'square' },
    { src: '/images/gallery-4.jpg', alt: 'Strap and midsole foam, close up', span: 'square' },
    { src: '/images/gallery-5.jpg', alt: 'Full construction, exploded view', span: 'tall' },
    { src: '/images/gallery-6.jpg', alt: 'Outsole tread pattern, alternate build', span: 'wide' },
] as const;

/**
 * REVIEWS
 * "People love the Happenstance" section (components/sections/Loved.tsx).
 * `highlight` is matched against `quote` and rendered in the accent color —
 * it must appear verbatim in the quote text.
 */
export const REVIEW_SUMMARY = { count: 214, rating: 4.8 } as const;

export const REVIEWS = [
    {
        rating: 5,
        quote: 'The cork bed molded to my foot in about a week. I forgot I was breaking anything in.',
        highlight: 'molded to my foot',
        name: 'Maren S.',
        role: 'Landscape architect',
        image: '/images/loved/loved-01.jpg',
    },
    {
        rating: 5,
        quote: 'Resoled mine after two summers of daily wear. Same pair, new decade.',
        highlight: 'Resoled mine',
        name: 'Tobias H.',
        role: 'Furniture maker',
        image: '/images/loved/loved-02.jpg',
    },
    {
        rating: 4.5,
        quote: 'Heavier than I expected out of the box, then I understood why. It holds a wet trail like nothing else I own.',
        highlight: 'holds a wet trail',
        name: 'Priya N.',
        role: 'Trail guide',
        image: '/images/loved/loved-03.jpg',
    },
    {
        rating: 5,
        quote: 'One buckle, dialed in once, and it has not moved since. Small detail, big difference.',
        highlight: 'has not moved since',
        name: 'Callum D.',
        role: 'Architect',
        image: '/images/loved/loved-04.jpg',
    },
    {
        rating: 5,
        quote: "I've bought three pairs for people I love. That's the whole review.",
        highlight: 'three pairs',
        name: 'Elin R.',
        role: 'Ceramicist',
        image: '/images/loved/loved-05.jpg',
    },
] as const;
