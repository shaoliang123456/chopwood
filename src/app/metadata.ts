import { Metadata } from 'next';

import { siteMetadata } from '@/contents/siteMetadata';

function toOpenGraphLocale(locale: string): string {
  // e.g. "en-US" -> "en_US"
  return locale.replace('-', '_');
}

export const metadata: Metadata = {
  title: {
    template: `%s - ${siteMetadata.author}`,
    default: `${siteMetadata.author} - ${siteMetadata.siteTitle}`,
  },
  description: siteMetadata.siteDescription,
  keywords: [
    siteMetadata.author,
    siteMetadata.siteShortTitle,
    'portfolio',
    'blog',
  ],
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  openGraph: {
    title: siteMetadata.siteTitle,
    description: siteMetadata.siteDescription,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.author,
    locale: toOpenGraphLocale(siteMetadata.locale),
    type: 'website',
  },
};
