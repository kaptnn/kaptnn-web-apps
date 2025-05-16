import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons']
  }
}

export default withBundleAnalyzer({
  enabled: process.env.NEXT_ANALYZE === 'true'
})(nextConfig)
