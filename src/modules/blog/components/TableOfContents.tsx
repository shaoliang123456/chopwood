'use client';

import { useEffect, useState } from 'react';
import { generateHeadingIdFromMarkdown } from '@/common/utils/generateHeadingId';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 解析 markdown 内容中的标题
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const rawText = match[2].trim();

      // 使用共享的 ID 生成函数，确保与 MDXComponent 一致
      const id = generateHeadingIdFromMarkdown(rawText);

      // 清理显示文本（移除 markdown 格式）
      const displayText = rawText
        .replace(/`([^`]+)`/g, '$1') // 代码块
        .replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
        .replace(/\*([^*]+)\*/g, '$1') // 斜体
        .replace(/~~([^~]+)~~/g, '$1') // 删除线
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // 链接

      items.push({
        id,
        text: displayText,
        level,
      });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // 监听滚动事件，高亮当前可见的标题
    const handleScroll = () => {
      const headings = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (headings.length === 0) return;

      // 找到当前可见的标题
      let currentActiveId = '';

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading) {
          const rect = heading.getBoundingClientRect();
          // 当标题在视口上方 100px 内时，认为它是当前活跃的标题
          if (rect.top <= 100) {
            currentActiveId = heading.id;
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    // 使用 throttle 优化性能
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // 偏移量，避免标题被固定头部遮挡
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className='sticky top-8'>
      <div className='p-5 border shadow-lg bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-xl border-neutral-200 dark:border-neutral-700'>
        <h3 className='flex items-center mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 10h16M4 14h16M4 18h16'
            />
          </svg>
          Contents
        </h3>
        <nav className='space-y-1 overflow-y-auto max-h-96'>
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`
                block w-full text-left text-sm transition-all duration-200 py-2 px-3 rounded-lg
                ${item.level === 2 ? 'pl-3' : 'pl-6'}
                ${
                  activeId === item.id
                    ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 border-l-2 border-indigo-500'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                }
              `}
            >
              <span className='block overflow-hidden text-ellipsis'>
                {item.text}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
