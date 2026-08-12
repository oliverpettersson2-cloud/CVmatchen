// ESM: @sparticuz/chromium v120+ och puppeteer-core v23+ är ESM-only —
// require() av dem kraschar i Vercels lambda-runtime (ERR_REQUIRE_ESM).
// Hela filen är därför ESM, samma modell som api/chat.js.
import _chromiumMod from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import path from 'path';
import * as Sentry from '@sentry/node';
const chromium = _chromiumMod.default || _chromiumMod;
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.VERCEL_ENV || 'development' });

const ALLOWED_ORIGINS = ['https://cvmatchen.com', 'https://www.cvmatchen.com'];

// KOSTNADSSKYDD: varje anrop startar en Chromium-instans (dyraste lambdan).
// Rate limit per IP (per-instans, samma mönster som chat.js) + origin-spärr.
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 6;           // PDF:er per IP per minut — legitimt är 1-2
const rateBuckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateBuckets.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateBuckets.set(ip, hits);
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) rateBuckets.delete(k);
    }
  }
  return hits.length > RATE_LIMIT;
}
function originAllowed(origin) {
  if (!origin) return true; // curl/appar — fångas av rate limit
  try {
    const host = new URL(origin).hostname;
    return host === 'cvmatchen.com'
      || host.endsWith('.cvmatchen.com')
      || host.endsWith('.vercel.app')
      || host === 'localhost' || host === '127.0.0.1';
  } catch (_) { return false; }
}

export default async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!originAllowed(origin)) {
    return res.status(403).json({ error: 'Otillåten origin' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'För många PDF-förfrågningar — vänta en stund' });
  }

  const { html, filename = 'CV.pdf' } = req.body || {};
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid html parameter' });
  }
  if (html.length > 5_000_000) {
    return res.status(413).json({ error: 'HTML too large (max 5MB)' });
  }

  let browser = null;
  try {
    const executablePath = await chromium.executablePath();
    const libPath = path.dirname(executablePath);

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
      defaultViewport: { width: 1280, height: 800 },
      executablePath,
      headless: true,
      env: {
        ...process.env,
        LD_LIBRARY_PATH: libPath + ':' + (process.env.LD_LIBRARY_PATH || ''),
      },
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'media', 'websocket'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 500));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    const safeFilename = filename.replace(/[^a-zA-Z0-9._\-åäöÅÄÖ ]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(safeFilename)}`);
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(Buffer.from(pdf));

  } catch (error) {
    Sentry.captureException(error);
    console.error('[pdf.js] error:', error.message);
    res.status(500).json({ error: 'PDF generation failed' });
  } finally {
    if (browser) {
      try { await browser.close(); } catch (e) { }
    }
  }
};
