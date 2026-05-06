/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      { protocol: 'https', hostname: 'api.mapbox.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap', '@react-three/fiber', '@react-three/drei'],
  },
  webpack: (config) => {
    // mapbox-gl uses browser globals; prevent SSR bundling issues
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false }
    return config
  },
}

export default nextConfig
