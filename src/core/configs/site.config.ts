import { envConfig } from '@/core/configs/env.config'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
    title: 'JujuBlue - Your Ultimate AI Companion',
    description:
        'Experience the power of AI with JujuBlue, your ultimate companion for creativity, productivity, and fun. Explore a world of possibilities with our cutting-edge AI technology.',
    keywords: ['Keyword1', 'Keyword2'],
    url: envConfig.APP_URL,
    ogImage: `${envConfig.APP_URL + '/imgs/og-image.jpg'}`,
}
