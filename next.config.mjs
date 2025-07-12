/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Make sure this is enabled for App Router
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Add this line
}

export default nextConfig;
