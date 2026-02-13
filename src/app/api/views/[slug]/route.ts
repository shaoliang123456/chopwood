import prisma from '@/common/libs/prisma';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
): Promise<Response> {
  try {
    const { slug } = params;

    const content = await prisma.contentMeta.findUnique({
      where: { slug },
    });

    return new Response(JSON.stringify({ views: content?.views || 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch views' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
): Promise<Response> {
  try {
    const { slug } = params;

    const content = await prisma.contentMeta.upsert({
      where: { slug },
      create: { slug, type: 'blog', views: 1 },
      update: { views: { increment: 1 } },
    });

    return new Response(JSON.stringify({ views: content.views }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update views' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
