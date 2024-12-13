import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },

    async rewrites() {
        return [
          {
            source: '/core/api/:path*',
            destination: 'http://localhost:8081/core/api/:path*',
          },
        ]
      },
};

export default withNextIntl(nextConfig);
