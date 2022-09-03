/** @type {import('next').NextConfig} */

const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin());
    return config;
  },
};

module.exports = nextConfig;
