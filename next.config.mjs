/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "satnaing.dev",
      "avatars.githubusercontent.com",
    ],
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
