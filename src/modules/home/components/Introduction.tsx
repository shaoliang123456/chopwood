'use client';

import { author, siteMetadata } from '@/contents/siteMetadata';

const Introduction = () => {
  return (
    <section className='bg-cover bg-no-repeat '>
      <div className='space-y-3'>
        <div className='flex gap-2 text-2xl lg:text-3xl font-medium font-sora'>
          <h1>{author.greetings}</h1>{' '}
        </div>
        <div className='space-y-4'>
          <h2>{author.position}</h2>
        </div>
      </div>

      <p className='leading-[1.8] md:leading-loose mt-6 text-neutral-800 dark:text-neutral-300'>
        {siteMetadata.siteDescription}
      </p>
    </section>
  );
};

export default Introduction;
