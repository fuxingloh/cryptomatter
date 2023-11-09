/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_URL ?? `https://${process.env.VERCEL_URL}` ?? 'https://frontmatter.levain.tech',
  },
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
