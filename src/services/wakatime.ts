/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import querystring from 'querystring';

import prisma from '@/common/libs/prisma';

const CLIENT_ID = process.env.WAKATIME_CLIENT_ID;
const CLIENT_SECRET = process.env.WAKATIME_CLIENT_SECRET;
const ENV_REFRESH_TOKEN = process.env.WAKATIME_CLIENT_REFRESH_TOKEN;
const PROVIDER = 'wakatime';

const STATS_ENDPOINT = 'https://wakatime.com/api/v1/users/current/stats';
const ALL_TIME_SINCE_TODAY =
  'https://wakatime.com/api/v1/users/current/all_time_since_today';
const TOKEN_ENDPOINT = 'https://wakatime.com/oauth/token';

type TokenResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

const getStoredRefreshToken = async (): Promise<string | null> => {
  const record = await prisma.integrationToken.findUnique({
    where: { provider: PROVIDER },
  });
  return record?.refreshToken ?? null;
};

const upsertToken = async (
  tokenData: TokenResponse,
  refreshTokenUsed: string
) => {
  const expiresAt = tokenData.expiresIn
    ? new Date(Date.now() + tokenData.expiresIn * 1000)
    : null;

  await prisma.integrationToken.upsert({
    where: { provider: PROVIDER },
    update: {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken || refreshTokenUsed,
      expiresAt: expiresAt,
    },
    create: {
      provider: PROVIDER,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken || refreshTokenUsed,
      expiresAt: expiresAt,
    },
  });
};

export const getAccessToken = async (): Promise<TokenResponse> => {
  const storedRefreshToken = await getStoredRefreshToken();
  const refreshTokenToUse = storedRefreshToken || ENV_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !refreshTokenToUse) {
    throw new Error('Wakatime client or refresh token is missing.');
  }

  const response = await axios.post(
    TOKEN_ENDPOINT,
    querystring.stringify({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshTokenToUse,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const tokenData: TokenResponse = response.data;

  await upsertToken(tokenData, refreshTokenToUse);

  return tokenData;
};

export const getReadStats = async (): Promise<{
  status: number;
  data: any;
}> => {
  const { accessToken } = await getAccessToken();

  const response = await axios.get(`${STATS_ENDPOINT}/last_7_days`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const status = response.status;
  // eslint-disable-next-line no-console
  console.log('chopwood ~ getReadStats ~ status : ', status);

  if (status >= 400) return { status, data: [] };

  const getData = response.data;

  const last_update = getData?.data?.modified_at;

  const categories = getData?.data?.categories;

  const best_day = {
    date: getData?.data?.best_day?.date,
    text: getData?.data?.best_day?.text,
  };
  const human_readable_daily_average =
    getData?.data?.human_readable_daily_average_including_other_language;
  const human_readable_total =
    getData?.data?.human_readable_total_including_other_language;

  const languages = getData?.data?.languages?.slice(0, 3);
  const editors = getData?.data?.editors;

  return {
    status,
    data: {
      last_update,
      categories,
      best_day,
      human_readable_daily_average,
      human_readable_total,
      languages,
      editors,
    },
  };
};

export const getALLTimeSinceToday = async (): Promise<{
  status: number;
  data: any;
}> => {
  const { accessToken } = await getAccessToken();

  const response = await axios.get(ALL_TIME_SINCE_TODAY, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const status = response.status;

  if (status >= 400) return { status, data: {} };

  const getData = response.data;

  const data = {
    text: getData?.data?.text,
    total_seconds: getData?.data?.total_seconds,
    start_date: getData?.data?.range?.start_date,
    end_date: getData?.data?.range?.end_date,
  };

  return {
    status,
    data,
  };
};
