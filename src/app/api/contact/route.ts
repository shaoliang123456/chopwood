import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitRecord>();

const parsePayload = (body: unknown): ContactPayload => {
  if (!body || typeof body !== 'object') return {};
  const raw = body as { formData?: ContactPayload } & ContactPayload;
  return raw.formData ?? raw;
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const getClientIp = (request: Request) => {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  return 'unknown';
};

const checkRateLimit = (ip: string) => {
  const now = Date.now();

  // Opportunistic cleanup to prevent unbounded in-memory growth.
  rateLimitStore.forEach((record, key) => {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  });

  const current = rateLimitStore.get(ip);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  rateLimitStore.set(ip, current);
  return { allowed: true, retryAfterSeconds: 0 };
};

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const payload = parsePayload(body);
  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const message = (payload.message || '').trim();
  const website = (payload.website || '').trim();

  if (website) {
    // Honeypot field: silently accept bot submissions.
    return NextResponse.json(
      { message: 'Message sent successfully.' },
      { status: 200 }
    );
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: 'name, email and message are required.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: 'Invalid email address.' },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    return NextResponse.json(
      { message: 'Contact service is not configured yet.' },
      { status: 500 }
    );
  }

  const subject = `[Portfolio] New message from ${name}`;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div>
      <h2>New message from portfolio</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage.replace(/\n/g, '<br />')}</p>
    </div>
  `;

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!resendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to send message. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 502 }
    );
  }
}
