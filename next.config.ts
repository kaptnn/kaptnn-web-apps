import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const isProd = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.NEXT_ANALYZE === 'true'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

const baseConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: [],
  turbopack: {
    resolveAlias: {
      underscore: 'lodash'
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json']
  },
  experimental: {
    optimizeCss: false,
    optimisticClientCache: true,
    optimizeServerReact: true,
    optimizePackageImports: ['antd', '@ant-design/icons'],
    serverMinification: true
  },
  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: `${API_URL}/:path*`
      },
      {
        source: `/docs`,
        destination: `${API_URL}/v1/docs`
      }
    ]
  }
}

let nextConfig: NextConfig = baseConfig

if (isProd) {
  nextConfig = {
    ...baseConfig,
    output: 'standalone'
  }
}

export default withBundleAnalyzer({
  enabled: isAnalyze
})(nextConfig)
