import { Metadata } from 'next';

import AnimatedContainer from '@/common/components/elements/AnimatedContainer';
import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import { getCollection } from '@/common/libs/mdx';
import { ProjectItemProps } from '@/common/types/projects';
import { siteMetadata } from '@/contents/siteMetadata';

import ProjectsClient from './client';

const PAGE_TITLE = 'Projects';
const PAGE_DESCRIPTION =
  'Several projects that I have worked on, both private and open source.';

function asString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (v == null) return fallback;
  return String(v);
}

function asBoolean(v: unknown, fallback = false): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v === 'true' || v === '1';
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === 'string') return [v].filter(Boolean);
  return [];
}

function asProjectType(v: unknown): ProjectItemProps['type'] {
  const s = asString(v, 'self');
  return s === 'work' || s === 'self' ? s : 'self';
}

// 客户端组件不能使用 metadata 导出
// export const metadata: Metadata = {
//   title: `${PAGE_TITLE} - ${siteMetadata.author}`,
//   description: PAGE_DESCRIPTION,
// };

// 创建一个服务器组件来处理 metadata
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `${PAGE_TITLE} - ${siteMetadata.author}`,
    description: PAGE_DESCRIPTION,
  };
};

// 获取项目数据
async function getProjects() {
  const collection = getCollection('project', false);
  const list: ProjectItemProps[] = collection.map((item) => {
    const fm = item.frontMatter as Record<string, unknown>;

    return {
      type: asProjectType(fm.type),
      title: asString(fm.title),
      slug: asString(fm.slug, item.slug),
      description: asString(fm.description),
      image: asString(fm.image),
      link_demo: asString(fm.link_demo) || undefined,
      link_github: asString(fm.link_github) || undefined,
      stacks: asStringArray(fm.stacks),
      is_show: asBoolean(fm.is_show),
      is_featured: asBoolean(fm.is_featured),
      updated_at: asString(fm.updated_at),
      state:
        typeof fm.state === 'string'
          ? (fm.state as ProjectItemProps['state'])
          : undefined,
      demo: Array.isArray(fm.demo)
        ? fm.demo
            .map((d) => d as Record<string, unknown>)
            .map((d) => ({
              name: asString(d.name),
              link_demo: asString(d.link_demo),
            }))
            .filter((d) => d.name && d.link_demo)
        : undefined,
    };
  });

  return list.filter((p) => p.is_show);
}

export default async function ProjectsPage() {
  // 在服务器组件中获取数据
  const projects = await getProjects();

  // 客户端状态和逻辑
  return (
    <AnimatedContainer>
      <Container>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <ProjectsClient initialProjects={projects} />
      </Container>
    </AnimatedContainer>
  );
}
