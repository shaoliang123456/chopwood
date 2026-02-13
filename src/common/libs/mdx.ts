import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';

import { calculateReadingTime, formatExcerpt } from '@/common/helpers';
import { getTimestamp } from '@/common/helpers';

export interface MdxFileProps {
  slug: string;
  filePath?: string; // Added to store the full path to the MDX file
  frontMatter: Record<string, unknown>;
  content?: string;
  props?: {
    readingTimeMinutes: number;
    description: string;
  };
}

// 缓存接口
interface CacheEntry {
  data: MdxFileProps[];
  timestamp: number;
  withContent: boolean;
}

const isMdxDebugEnabled =
  process.env.MDX_DEBUG === 'true' || process.env.MDX_DEBUG === '1';

const debugLog = (...args: unknown[]) => {
  if (isMdxDebugEnabled) {
    console.log(...args);
  }
};

const debugWarn = (...args: unknown[]) => {
  if (isMdxDebugEnabled) {
    console.warn(...args);
  }
};

// 内存缓存
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 5; // 5分钟缓存

// 文件修改时间缓存，用于检测文件变化
const fileStatsCache = new Map<string, number>();

// 检查目录是否有文件变化
const hasDirectoryChanged = (dirPath: string): boolean => {
  try {
    const files = fs.readdirSync(dirPath, { recursive: true });
    const mdxFiles = (files as string[]).filter(
      (file) => file.endsWith('.mdx') || file.endsWith('.md')
    );

    let hasChanges = false;

    for (const file of mdxFiles) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      const lastModified = stats.mtime.getTime();
      const cachedTime = fileStatsCache.get(filePath);

      if (!cachedTime) {
        // 第一次检查，记录时间但不认为是变化
        fileStatsCache.set(filePath, lastModified);
      } else if (cachedTime !== lastModified) {
        // 文件确实有变化
        fileStatsCache.set(filePath, lastModified);
        hasChanges = true;
      }
    }

    return hasChanges;
  } catch (error) {
    console.error('Error checking directory changes:', error);
    return true; // 出错时假设有变化
  }
};

// 获取缓存键
const getCacheKey = (dirPath: string, withContent: boolean): string => {
  return `${dirPath}:${withContent}`;
};

// 检查缓存是否有效
const isCacheValid = (cacheEntry: CacheEntry): boolean => {
  const now = Date.now();
  return now - cacheEntry.timestamp < CACHE_TTL;
};

export const _loadMdxFiles = (
  dirPath: string,
  withContent = true
): MdxFileProps[] => {
  try {
    debugLog(`Loading MDX files from: ${dirPath}`);
    if (!fs.existsSync(dirPath)) {
      debugWarn(`Directory does not exist: ${dirPath}`);
      return [];
    }

    const files = fs.readdirSync(dirPath, { recursive: true });
    debugLog(`Found ${files.length} total files in directory`);

    const mdxFiles = (files as string[]).filter((file) => {
      // 同时允许 md 和 mdx 文件
      return file.endsWith('.mdx') || file.endsWith('.md');
    });

    debugLog(`Found ${mdxFiles.length} MDX/MD files`);

    const contents = mdxFiles.map((file) => {
      try {
        const filePath = path.join(dirPath, file);
        // console.log(`Processing file: ${filePath}`);

        const source = fs.readFileSync(filePath, 'utf-8');
        const { content, data } = matter(source);

        const filename = file.endsWith('.mdx')
          ? file.replace('.mdx', '')
          : file.replace('.md', '');

        if (!data.featured_image_url) {
          const randomSrc = `/images/bg/bg${Math.floor(
            Math.random() * 15
          )}.svg`;
          data.featured_image_url = randomSrc;
        }

        // 基础数据结构
        const baseData = {
          slug: data.slug || filename,
          filePath: filePath, // Added: store the full file path
          frontMatter: data,
        };

        // 只有需要内容时才进行 MDX 编译
        if (withContent) {
          const mdxCompiler = remark()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkMdx);
          const mdxContent = mdxCompiler.processSync(content).toString();

          return {
            ...baseData,
            content: mdxContent,
            props: {
              readingTimeMinutes: calculateReadingTime(mdxContent) ?? 0,
              description: formatExcerpt(mdxContent) || '',
            },
          };
        } else {
          // 不需要内容时，只返回基础信息
          return {
            ...baseData,
            content: '',
            props: {
              readingTimeMinutes: 0,
              description: data.description || data.summary || '',
            },
          };
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        // Return a minimal valid object to avoid breaking the entire collection
        return {
          slug: file,
          frontMatter: {
            title: `Error loading ${file}`,
            date: new Date().toISOString(),
            tags: ['error'],
            featured_image_url: '/images/bg/bg0.svg',
          },
          content: '',
          props: {
            readingTimeMinutes: 0,
            description: 'Error loading this file',
          },
        };
      }
    });

    debugLog(`Successfully processed ${contents.length} MDX files`);
    return contents;
  } catch (error) {
    console.error(`Error in _loadMdxFiles:`, error);
    return [];
  }
};

export const getCollectionCount = (endpointer: string): number => {
  const dirPath = path.join(process.cwd(), 'src/contents', endpointer);
  const files = fs.readdirSync(dirPath);
  const mdxFiles = files.filter(
    (file) => file.endsWith('.mdx') || file.endsWith('.md')
  );
  return mdxFiles.length;
};

export const getCollection = (
  endpointer: string,
  withContent = false
): MdxFileProps[] => {
  try {
    const dirPath = path.join(process.cwd(), 'src/contents', endpointer);

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      debugWarn(`Directory does not exist: ${dirPath}`);
      return [];
    }

    // 检查缓存
    const cacheKey = getCacheKey(dirPath, withContent);
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry) {
      const isValid = isCacheValid(cachedEntry);
      const hasChanged = hasDirectoryChanged(dirPath);

      if (isValid && !hasChanged) {
        debugLog(
          `✅ Using cached data for ${endpointer} (${cachedEntry.data.length} items, withContent: ${withContent})`
        );
        return cachedEntry.data;
      } else {
        debugLog(
          `🔄 Cache invalid for ${endpointer} - reloading (valid: ${isValid}, changed: ${hasChanged})`
        );
      }
    } else {
      debugLog(
        `🆕 Loading fresh data for ${endpointer} (withContent: ${withContent})`
      );
    }

    // 加载文件，传递 withContent 参数
    const files = _loadMdxFiles(dirPath, withContent);
    debugLog(`Loaded ${files.length} files from ${endpointer}`);

    // 排序
    files.sort((a, b) => {
      return getTimestamp(a.frontMatter.date as string) <
        getTimestamp(b.frontMatter.date as string)
        ? 1
        : -1;
    });

    // 缓存结果
    const cacheEntry = {
      data: files,
      timestamp: Date.now(),
      withContent,
    };
    cache.set(cacheKey, cacheEntry);
    debugLog(
      `💾 Cached ${files.length} files for ${endpointer} (withContent: ${withContent})`
    );
    debugLog(`📊 Total cache entries: ${cache.size}`);

    return files;
  } catch (error) {
    console.error(`Error in getCollection(${endpointer}):`, error);
    return [];
  }
};

export const getEntry = (
  endpointer: string,
  slug: string
): MdxFileProps | null => {
  debugLog(`🔍 Getting entry: ${endpointer}/${slug}`);

  // 首先尝试从缓存中获取不包含内容的集合
  const collection = getCollection(endpointer, false);
  const entry = collection.find((item) => item.slug === slug);

  if (!entry) {
    debugLog(`❌ Entry not found: ${slug}`);
    return null;
  }

  // 如果找到了条目但没有内容，则尝试单独加载该文件，或者回退到加载整个集合
  if (!entry.content) {
    debugLog(
      `📄 Entry [${slug}] found without content. Attempting to load single file.`
    );
    if (entry.filePath) {
      const singleFileEntryData = loadSingleMdxFile(entry.filePath, true);
      if (singleFileEntryData) {
        debugLog(
          `✅ Successfully loaded single file content for: ${slug} from ${entry.filePath}`
        );
        // Merge content and props into the existing entry metadata
        const finalEntry = {
          ...entry,
          content: singleFileEntryData.content,
          props: singleFileEntryData.props,
        };
        // The main cache for the full collection (withContent=true) will be populated
        // if getCollection(endpointer, true) is called elsewhere or if this path fails.
        return finalEntry;
      } else {
        debugWarn(
          `⚠️ Failed to load single file content for: ${slug} from path: ${entry.filePath}. Falling back.`
        );
      }
    } else {
      debugWarn(
        `⚠️ FilePath not available for entry: ${slug}. Falling back to full collection load.`
      );
    }

    // Fallback: Load the entire collection with content if single load fails or filePath is missing
    debugLog(
      `🔄 Falling back to loading full collection with content for: ${endpointer} to find ${slug}`
    );
    const fullCollection = getCollection(endpointer, true);
    const fullEntry = fullCollection.find((item) => item.slug === slug);
    if (fullEntry) {
      debugLog(`✅ Found entry [${slug}] in full collection.`);
      return fullEntry;
    } else {
      // This case should ideally not be reached if entry was found in the metadata-only collection.
      // As a safeguard, return the original entry (which lacks content).
      console.error(
        `❌ Entry [${slug}] not found in full collection after being found in metadata-only collection. Returning metadata only.`
      );
      return entry;
    }
  }

  debugLog(`✅ Entry found with content: ${slug}`);
  return entry;
};

// 单独加载单个文件的优化函数
export const loadSingleMdxFile = (
  filePath: string,
  withContent = true
): MdxFileProps | null => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const source = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(source);

    const filename = path.basename(filePath).replace(/\.(mdx|md)$/, '');

    if (!data.featured_image_url) {
      const randomSrc = `/images/bg/bg${Math.floor(Math.random() * 15)}.svg`;
      data.featured_image_url = randomSrc;
    }

    const baseData = {
      slug: data.slug || filename,
      frontMatter: data,
    };

    if (withContent) {
      const mdxCompiler = remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMdx);
      const mdxContent = mdxCompiler.processSync(content).toString();

      return {
        ...baseData,
        content: mdxContent,
        props: {
          readingTimeMinutes: calculateReadingTime(mdxContent) ?? 0,
          description: formatExcerpt(mdxContent) || '',
        },
      };
    } else {
      return {
        ...baseData,
        content: '',
        props: {
          readingTimeMinutes: 0,
          description: data.description || data.summary || '',
        },
      };
    }
  } catch (error) {
    console.error(`Error loading single MDX file ${filePath}:`, error);
    return null;
  }
};

// 缓存管理函数
export const clearCache = (): void => {
  cache.clear();
  fileStatsCache.clear();
  debugLog('MDX cache cleared');
};

export const getCacheStats = () => {
  return {
    cacheSize: cache.size,
    fileStatsSize: fileStatsCache.size,
    cacheEntries: Array.from(cache.keys()),
  };
};

// 清理过期缓存
export const cleanupExpiredCache = (): void => {
  const keysToDelete: string[] = [];
  cache.forEach((entry, key) => {
    if (!isCacheValid(entry)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => cache.delete(key));
};

/**
 * 读取站点设置文件内容
 * 用于服务器组件中获取设置
 */
export const readSettingsFile = async (): Promise<string> => {
  try {
    const filePath = path.join(process.cwd(), 'src/contents/siteMetadata.ts');
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading settings file:', error);
    return '';
  }
};
