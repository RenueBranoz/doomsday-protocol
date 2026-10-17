// PIN gate: a correct PIN sets the session cookie and opens /vault.
import { COOKIE, keyMatches, sessionToken, sleep } from './_doom.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.redirect(303, '/');

  const pin = req.body && req.body.pin;
  if (!keyMatches(pin)) {
    await sleep(1500); // slow down guessing
    return res.redirect(303, '/?denied=1');
  }

  res.setHeader('Set-Cookie',
    `${COOKIE}=${sessionToken()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=60`);
  return res.redirect(303, '/vault');
}
