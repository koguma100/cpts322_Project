/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mickvlmfxtescdcsltme.supabase.co',
        port: '', // Leave empty if not using a specific port
        pathname: '/**', // Adjust this if you want to restrict the paths
      },
    ],
  },
};

export default nextConfig;
