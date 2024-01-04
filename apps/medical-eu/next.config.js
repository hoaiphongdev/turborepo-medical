/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  output: 'export',
  swcMinify: true,
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, '../../node_modules/apexcharts-clevision')
    }

    return config
  },
  optimizeFonts: true
}

module.exports = nextConfig
