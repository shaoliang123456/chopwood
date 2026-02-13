import { format, getTime, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { siteMetadata } from '@/contents/siteMetadata';

export const formatBlogSlug = (slug: string) => slug?.slice(0, -5);

export const formatDate = (date: string, type = 'MMMM dd, yyyy') => {
  if (!date) {
    return '';
  }

  const formattedDate = format(
    utcToZonedTime(parseISO(date), siteMetadata.timeZone),
    type
  );
  return formattedDate;
};

export const getTimestamp = (date: string) => {
  const [y, m, d] = formatDate(date, 'yyyy MM dd')
    .split(' ')
    .map((i) => Number.parseInt(i));
  return getTime(new Date(y, m, d));
};

export const removeHtmlTags = (html: string) => {
  if (!html) return '';

  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } else {
    return html.replace(/<[^>]*>/g, ' ');
  }
};

export const formatExcerpt = (content: string, maxLength = 100) => {
  const cleanedContent = removeHtmlTags(content);

  if (cleanedContent.length <= maxLength) {
    return cleanedContent;
  }

  const trimmed = cleanedContent.substring(0, maxLength).replace(/\s+\S*$/, '');

  return trimmed + (cleanedContent.length > maxLength ? '...' : '');
};

const normalizeForReadingTime = (content: string) => {
  return removeHtmlTags(
    content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/(^|\s)#{1,6}\s+/gm, ' ')
      .replace(/(^|\s)[>*-]\s+/gm, ' ')
      .replace(/(\*\*|__|\*|_|~~)/g, ' ')
      .replace(/<\/?[^>]+(>|$)/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
};

export const calculateReadingTime = (content: string, wordsPerMinute = 250) => {
  const cleanedContent = normalizeForReadingTime(content);
  if (!cleanedContent) return 1;

  const cjkCount = (cleanedContent.match(/[\u4e00-\u9fff]/g) || []).length;
  const nonCjkContent = cleanedContent.replace(/[\u4e00-\u9fff]/g, ' ');
  const wordCount =
    nonCjkContent.split(/\s+/).filter(Boolean).length + cjkCount;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTimeMinutes);
};
