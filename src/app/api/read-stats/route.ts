import { getALLTimeSinceToday, getReadStats } from '@/services/wakatime';

export async function GET(): Promise<Response> {
  try {
    const readStateResponse = await getReadStats();
    const allTimeSinceTodayResponse = await getALLTimeSinceToday();
    const data = {
      ...readStateResponse.data,
      all_time_since_today: allTimeSinceTodayResponse.data,
    };
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=30', // 缓存300秒，过期后30秒内可使用旧数据
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch read stats' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
