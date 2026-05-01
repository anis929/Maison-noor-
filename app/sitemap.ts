import type { MetadataRoute } from 'next'
import { products } from '@/data/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://maisonnoor.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,               lastModified: new Date(), priority: 1.0,  changeFrequency: 'weekly' },
    { url: `${base}/atelier`,  lastModified: new Date(), priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${base}/collection`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/maison`,   lastModified: new Date(), priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${base}/rendez-vous`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/contact`,  lastModified: new Date(), priority: 0.6,  changeFrequency: 'yearly' },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url:              `${base}/collection/${p.slug}`,
    lastModified:     new Date(),
    priority:         0.8,
    changeFrequency:  'monthly',
  }))

  return [...staticRoutes, ...productRoutes]
}
