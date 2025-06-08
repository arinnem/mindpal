/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com'], // Add other image domains as needed
  },
  i18n: {
    locales: ['vi'],
    defaultLocale: 'vi',
  },
}

module.exports = nextConfig 