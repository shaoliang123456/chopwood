import clsx from 'clsx';

import { SOCIAL_MEDIA } from '@/contents/menu';

const SocialMediaList = () => {
  return (
    <div className='space-y-5 pb-2'>
      <h3 className='text-lg font-medium'>Find me on social media</h3>
      <div className='flex flex-col md:flex-row justify-start gap-3'>
        {SOCIAL_MEDIA?.map((item) => {
          const isMailTo = item?.href?.startsWith('mailto:');

          return (
            <a
              href={item?.href}
              key={item?.href}
              target={isMailTo ? undefined : '_blank'}
              rel={isMailTo ? undefined : 'noopener noreferrer'}
              className={clsx(
                'w-full md:w-1/5 flex gap-2 items-center justify-center text-neutral-50 py-2 px-4 rounded-lg transition-all duration-300 text-[15px] font-sora hover:scale-105',
                item?.className
              )}
              data-umami-event={item?.eventName}
            >
              {item?.icon}
              <span>{item?.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaList;
