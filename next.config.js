/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ids-africa-selfcare-portal-api-j5yr.onrender.com",
        // ↑↑↑ CHANGE THIS to your actual Render backend URL
      },
    ];
  },
};

module.exports = nextConfig;
