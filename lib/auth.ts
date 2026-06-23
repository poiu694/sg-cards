import crypto from 'crypto';

function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'admin';
  return crypto.createHash('sha256').update(`sg-admin-${password}`).digest('hex').slice(0, 32);
}

export function createAuthCookie(): string {
  const token = getExpectedToken();
  return `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
}

export function validatePassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD ?? 'admin');
}

export function validateCookieHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  return match?.[1] === getExpectedToken();
}

export function getExpectedTokenValue(): string {
  return getExpectedToken();
}
