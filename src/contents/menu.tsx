import { BiRocket as ContactIcon } from 'react-icons/bi';
import {
  BsEnvelopeAtFill as EmailIcon,
  BsGithub as GithubIcon,
  BsInstagram as InstagramIcon,
  BsLinkedin as LinkedinIcon,
  BsTwitter as TwitterIcon,
} from 'react-icons/bs';
import {
  FiCoffee as ProjectIcon,
  FiPieChart as AnalyticsIcon,
  FiPocket as HomeIcon,
  FiRss as BlogIcon,
  FiUser as ProfileIcon,
} from 'react-icons/fi';
// import { PiChatCircleDotsBold as ChatIcon } from 'react-icons/pi';

import { MenuItemProps } from '@/common/types/menu';
import { siteMetadata, socialAccounts } from '@/contents/siteMetadata';

const iconSize = 20;

export const MENU_ITEMS: MenuItemProps[] = [
  {
    title: 'Home',
    href: '/',
    icon: <HomeIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Home',
    type: 'Pages',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: <ProjectIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Projects',
    type: 'Pages',
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: <BlogIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Blog',
    type: 'Pages',
  },
  {
    title: 'About',
    href: '/about',
    icon: <ProfileIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: About',
    type: 'Pages',
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: <ContactIcon size={iconSize} />,
    isShow: true,
    isExternal: false,
    eventName: 'Pages: Contact',
    type: 'Pages',
  },
];

export const SOCIAL_MEDIA: MenuItemProps[] = [
  {
    title: 'Email',
    href: `mailto:${socialAccounts.email}`,
    icon: <EmailIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Contact: Email',
    className: 'bg-green-600! border border dark:border-neutral-700',
    type: 'Link',
  },

  {
    title: 'Linkedin',
    href: socialAccounts.linkedin,
    icon: <LinkedinIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Linkedin',
    className: 'bg-blue-500! border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Twitter',
    href: socialAccounts.x,
    icon: <TwitterIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Twitter',
    className: 'bg-sky-500! border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Instagram',
    href: socialAccounts.instagram,
    icon: <InstagramIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Instagram',
    className: 'bg-orange-700! border border dark:border-neutral-700',
    type: 'Link',
  },
  {
    title: 'Github',
    href: socialAccounts.github,
    icon: <GithubIcon size={iconSize} />,
    isShow: true,
    isExternal: true,
    eventName: 'Social: Github',
    className: 'bg-black! border border dark:border-neutral-700',
    type: 'Link',
  },
].filter((item) => {
  return !!item.href;
});

export const EXTERNAL_LINKS: MenuItemProps[] = [
  {
    title: 'Analytics',
    href: siteMetadata.analytics.analyticsURL,
    icon: <AnalyticsIcon size={iconSize} />,
    isShow: !!siteMetadata.analytics.analyticsURL,
    isExternal: true,
    eventName: 'External Link: Analytics',
    type: 'Link',
  },
];
