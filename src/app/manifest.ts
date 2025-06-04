import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KAP TNN Datatrail Website',
    short_name: 'KAP TNN Datatrail',
    description: 'Datatrail website of Kantor Akuntan Publik Tambunan & Nasafi',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ]
  }
}
