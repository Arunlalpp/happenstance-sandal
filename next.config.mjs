/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM in some subpaths; let Next transpile it.
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    // Allow importing .glb/.hdr/.mp4 as static assets if you add local ones.
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|mp4|webm)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
