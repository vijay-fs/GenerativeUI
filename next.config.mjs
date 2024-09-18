/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com'
      },
      {
        protocol: 'https',
        hostname: 'www.nanalyze.com'
      },
      {
        protocol: 'https',
        hostname: 'aiindies.com'
      }
    ]
  }
}

export default nextConfig
