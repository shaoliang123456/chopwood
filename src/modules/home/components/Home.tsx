'use client';

import Breakline from '@/common/components/elements/Breakline';
import { BlogItemProps } from '@/common/types/blog';

import BlogPreview from './BlogPreview';
import Introduction from './Introduction';

const Home = ({ blogList }: { blogList: BlogItemProps[] }) => {
  return (
    <>
      <Introduction />
      <Breakline className='mt-8 mb-7' />
      <BlogPreview blogList={blogList} />
    </>
  );
};

export default Home;
