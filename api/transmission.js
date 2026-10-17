// Sealed transmission: returns the flag only to a request carrying the right key.
// DOOM_KEY and FLAG live in Vercel environment variables, never in the repo.
import { createHash, timingSafeEqual } from 'node:crypto';

const digest = s => createHash('sha256').update(String(s).trim().toUpperCase()).digest();
const sleep = ms => new Promise(r => setTimeout(r, ms));

const SEALED = `
 ================================================================
   LATVERIAN COMMAND NETWORK // CHANNEL 616
 ================================================================
   TRANSMISSION SEALED.
   Doom speaks only to the one who holds the key.

     curl -H "X-Doom-Key: <KEY>" <this-site>/api/transmission
 ================================================================
`;

const DENIED = `
 ================================================================
   ACCESS DENIED.
   That is not the key, Avenger. Doom has noted your attempt.
 ================================================================
`;

const granted = flag => `
 ================================================================
   KEY ACCEPTED. TRANSMISSION UNSEALED.
 ================================================================

   CONGRATS Worrier here.....   ${flag}

                                                       - DOOM
 ================================================================
`;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const { DOOM_KEY, FLAG } = process.env;
  if (!DOOM_KEY || !FLAG) return res.status(503).send('\n   CHANNEL OFFLINE.\n');

  const given = req.headers['x-doom-key'];
  if (!given) return res.status(401).send(SEALED);

  if (!timingSafeEqual(digest(given), digest(DOOM_KEY))) {
    await sleep(1500); // slow down guessing
    return res.status(403).send(DENIED);
  }
  return res.status(200).send(granted(FLAG));
}
