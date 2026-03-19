import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naturals AI',
    short_name: 'Naturals',
    description: 'AI-Powered Hair Studio',
    start_url: '/',
    display: 'standalone',
    background_color: '#8E3E96',
    theme_color: '#8E3E96',
  }
}
