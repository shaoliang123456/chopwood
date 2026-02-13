import {
  SiAntdesign,
  SiDocker,
  SiFastapi,
  SiFlutter,
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiSpring,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';

export type stacksProps = {
  [key: string]: JSX.Element;
};

const iconSize = 24;
const iconClass = 'text-neutral-700 dark:text-neutral-300';

export const STACKS: stacksProps = {
  'React.js': <SiReact size={iconSize} className={iconClass} />,
  Vue: <SiVuedotjs size={iconSize} className={iconClass} />,
  'Next.js': <SiNextdotjs size={iconSize} className={iconClass} />,
  TypeScript: <SiTypescript size={iconSize} className={iconClass} />,
  'Node.js': <SiNodedotjs size={iconSize} className={iconClass} />,
  JavaScript: <SiJavascript size={iconSize} className={iconClass} />,
  TailwindCSS: <SiTailwindcss size={iconSize} className={iconClass} />,
  'Ant Design': <SiAntdesign size={iconSize} className={iconClass} />,
  Prisma: <SiPrisma size={iconSize} className={iconClass} />,
  'Nest.js': <SiNestjs size={iconSize} className={iconClass} />,
  Postgres: <SiPostgresql size={iconSize} className={iconClass} />,
  Spring: <SiSpring size={iconSize} className={iconClass} />,
  Redis: <SiRedis size={iconSize} className={iconClass} />,
  Flutter: <SiFlutter size={iconSize} className={iconClass} />,
  Python: <SiPython size={iconSize} className={iconClass} />,
  FastAPI: <SiFastapi size={iconSize} className={iconClass} />,
  Docker: <SiDocker size={iconSize} className={iconClass} />,
};
