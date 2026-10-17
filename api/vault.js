// Serves the Doom page only to visitors who passed the PIN gate.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hasSession } from './_doom.js';

const page = readFileSync(join(process.cwd(), 'private', 'doom.html'), 'utf8');

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!hasSession(req)) return res.redirect(302, '/');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(page);
}
