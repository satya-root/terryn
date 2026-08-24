/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000', '192.168.0.153:3000', '*.vercel.app', '*.s23.in']
    },
  },
}
export default nextConfig;
