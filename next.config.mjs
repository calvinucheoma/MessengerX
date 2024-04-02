/** @type {import('next').NextConfig} */
const nextConfig = {
  //   swcPlugins: [['next-superjson-plugin', {}]],
  // next-superjson-pluginsanitizes our objects so that we can safely pass them even though they have date objects
  //  and other complex properties which are not compatible when passing from server components into a client component
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },
};

export default nextConfig;
