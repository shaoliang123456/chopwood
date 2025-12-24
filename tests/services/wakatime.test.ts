import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/common/libs/prisma';

// 1. Mock Axios
vi.mock('axios');

// 2. Mock Prisma
vi.mock('@/common/libs/prisma', () => ({
  default: {
    integrationToken: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe('Wakatime Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('WAKATIME_CLIENT_ID', 'test-client-id');
    vi.stubEnv('WAKATIME_CLIENT_SECRET', 'test-client-secret');
    vi.stubEnv('WAKATIME_CLIENT_REFRESH_TOKEN', 'env-refresh-token');

    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getReadStats', () => {
    it('应该在数据库有有效 Token 时直接使用，并成功获取数据', async () => {
      const { getReadStats } = await import('@/services/wakatime');

      const mockDbToken = {
        accessToken: 'valid-db-access-token',
        refreshToken: 'valid-db-refresh-token',
        expiresAt: new Date(Date.now() + 10000),
      };
      (prisma.integrationToken.findFirst as any).mockResolvedValue(mockDbToken);

      const mockStatsResponse = {
        status: 200,
        data: {
          data: {
            modified_at: '2023-01-01',
            categories: [],
            best_day: { text: 'Good day' },
            languages: [{ name: 'TypeScript' }],
          },
        },
      };
      (axios.get as any).mockResolvedValue(mockStatsResponse);

      const result = await getReadStats();

      expect(prisma.integrationToken.findFirst).toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/stats/last_7_days'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer valid-db-access-token' },
        })
      );
      expect(result.status).toBe(200);
      expect(result.data.best_day.text).toBe('Good day');
    });

    it('当数据库 Token 过期时，应该自动刷新 Token 并更新数据库', async () => {
      const { getReadStats } = await import('@/services/wakatime');

      (prisma.integrationToken.findFirst as any).mockResolvedValue(null);

      (prisma.integrationToken.findUnique as any).mockResolvedValue({
        refreshToken: 'db-refresh-token',
      });

      const mockTokenResponse = {
        // 服务实现中会把 response.data 当成 URL-encoded 字符串用 URLSearchParams 解析
        data: 'access_token=new-access-token&refresh_token=new-refresh-token',
      };
      (axios.post as any).mockResolvedValue(mockTokenResponse);

      (axios.get as any).mockResolvedValue({ status: 200, data: { data: {} } });

      await getReadStats();

      expect(axios.post).toHaveBeenCalledWith(
        'https://wakatime.com/oauth/token',
        expect.stringContaining('grant_type=refresh_token'),
        expect.any(Object)
      );

      expect(prisma.integrationToken.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { provider: 'wakatime' },
          update: expect.objectContaining({
            accessToken: 'new-access-token',
          }),
        })
      );

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: 'Bearer new-access-token' },
        })
      );
    });
  });
});
