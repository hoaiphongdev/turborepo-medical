/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  swcMinify: true,
  reactStrictMode: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  optimizeFonts: true,
};

module.exports = nextConfig;
