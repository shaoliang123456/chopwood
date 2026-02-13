'use client';

import { MENU_ITEMS } from '@/contents/menu';

import Menu from './Menu';

const Navigation = () => {
  const filterdMenu = MENU_ITEMS?.filter((item) => item?.isShow);

  return (
    <div>
      <Menu list={filterdMenu} />
    </div>
  );
};

export default Navigation;
