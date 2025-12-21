import { getGithubUser } from '@/services/github';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return new Response(JSON.stringify({ error: 'Missing type parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const githubResponse = await getGithubUser(type);

    return new Response(JSON.stringify(githubResponse.data), {
      status: githubResponse.status || 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch GitHub contribution data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
