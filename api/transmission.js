// Raw feed: returns the base64-encoded transmission only to a request carrying the right key.
// DOOM_KEY and FLAG live in Vercel environment variables, never in the repo.
import { keyMatches, sleep } from './_doom.js';

const SEALED = `
 ================================================================
   LATVERIAN COMMAND NETWORK // CHANNEL 616
 ================================================================
   TRANSMISSION SEALED.
   Doom speaks only to the one who holds the key.

     curl -H "X-Doom-Key: <PIN>" <this-site>/api/transmission
 ================================================================
`;

const DENIED = `
 ================================================================
   ACCESS DENIED.
   That is not the key, Avenger. Doom has noted your attempt.
 ================================================================
`;

const granted = flag => {
  const payload = Buffer.from(`CONGRATS Worrier here.....   ${flag}\n`).toString('base64');
  return `
 ================================================================
   KEY ACCEPTED. RAW TRANSMISSION FOLLOWS.
 ================================================================

        ${payload}

                                                       - DOOM
 ================================================================
`;
};

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const { DOOM_KEY, FLAG } = process.env;
  if (!DOOM_KEY || !FLAG) return res.status(503).send('\n   CHANNEL OFFLINE.\n');

  const given = req.headers['x-doom-key'];
  if (!given) return res.status(401).send(SEALED);

  if (!keyMatches(given)) {
    await sleep(1500); // slow down guessing
    return res.status(403).send(DENIED);
  }
  return res.status(200).send(granted(FLAG));
}
