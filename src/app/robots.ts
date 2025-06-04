import { seo_data } from '@/utils/constants/seo_data'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard',
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/dashboard',
        crawlDelay: 1
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/dashboard'],
        crawlDelay: 1
      }
    ],
    sitemap: seo_data.baseUrl.dev + '/sitemap.xml',
    host: seo_data.baseUrl.dev
  }
}
