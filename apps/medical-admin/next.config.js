/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
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
