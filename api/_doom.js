// Shared helpers. Files starting with "_" are not exposed as Vercel functions.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const digest = s => createHash('sha256').update(String(s).trim().toUpperCase()).digest();

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const keyMatches = given =>
  Boolean(given && process.env.DOOM_KEY) && timingSafeEqual(digest(given), digest(process.env.DOOM_KEY));

// Session cookie value; rotates automatically whenever DOOM_KEY changes.
export const sessionToken = () =>
  createHmac('sha256', process.env.DOOM_KEY).update('doom-vault-session').digest('hex');

export const COOKIE = 'doom_session';

export function hasSession(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)doom_session=([0-9a-f]{64})/);
  return Boolean(m && process.env.DOOM_KEY) &&
    timingSafeEqual(Buffer.from(m[1]), Buffer.from(sessionToken()));
}
