import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROVIDER = 'wakatime';
const REFRESH_TOKEN = process.env.WAKATIME_CLIENT_REFRESH_TOKEN;

async function main() {
  if (!REFRESH_TOKEN) {
    console.error('WAKATIME_CLIENT_REFRESH_TOKEN is missing; seed aborted.');
    process.exit(1);
  }

  const existing = await prisma.integrationToken.findUnique({
    where: { provider: PROVIDER },
  });

  if (existing) {
    console.log('Seed skipped: token already exists for provider:', PROVIDER);
    return;
  }

  await prisma.integrationToken.create({
    data: {
      provider: PROVIDER,
      refresh_token: REFRESH_TOKEN,
    },
  });

  console.log('Seeded refresh token for provider:', PROVIDER);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
