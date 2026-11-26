#!/usr/bin/env node
// Submits the sitemap to Google Search Console when a deploy changed it, so Google reads it again.
//
//   node tools/google-sitemap.mjs <previous sitemap> <new sitemap> [--dry]
//
// A change is a page added or removed, or a new <lastmod>. Without a previous sitemap the
// sitemap is submitted anyway: a submission that changes nothing does no harm.
//
// Google retired the anonymous sitemap ping in 2023 and takes no IndexNow, so this goes through
// the Search Console API. GOOGLE_SERVICE_ACCOUNT holds a service account's JSON key (a repository
// secret), and that account must be an owner of PROPERTY in Search Console. Without the key the
// step is skipped, and the deploy carries on.
import crypto from 'node:crypto';
import fs from 'node:fs';

// The domain property covers every kubai.design subdomain, icons included.
const PROPERTY = 'sc-domain:kubai.design';
const SITEMAP = 'https://icons.kubai.design/sitemap.xml';
const SCOPE = 'https://www.googleapis.com/auth/webmasters';

const [previous, next] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const dry = process.argv.includes('--dry');

// The sitemap's pages, as a Map of URL to <lastmod> (or '').
const pages = (file) => {
  const map = new Map();
  if (!file || !fs.existsSync(file)) return map;
  for (const [, block] of fs.readFileSync(file, 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (loc) map.set(loc, block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '');
  }
  return map;
};

const before = pages(previous);
const after = pages(next);
if (!after.size) {
  console.error(`No pages in ${next ?? 'the new sitemap'}.`);
  process.exit(1);
}
if (before.size) {
  const added = [...after.keys()].filter((url) => !before.has(url)).length;
  const removed = [...before.keys()].filter((url) => !after.has(url)).length;
  const redated = [...after].filter(([url, date]) => before.has(url) && before.get(url) !== date).length;
  if (!added && !removed && !redated) {
    console.log('The sitemap did not change: nothing to submit to Google.');
    process.exit(0);
  }
  console.log(`The sitemap changed: ${added} added, ${removed} removed, ${redated} with a new date.`);
} else {
  console.log('No previous sitemap to compare with: submitting anyway.');
}

if (dry) {
  console.log(`Would submit ${SITEMAP} to ${PROPERTY}.`);
  process.exit(0);
}
const raw = process.env.GOOGLE_SERVICE_ACCOUNT;
if (!raw) {
  console.log('GOOGLE_SERVICE_ACCOUNT is not set: the sitemap was not submitted to Google.');
  process.exit(0);
}

// An access token for the service account, from a JWT it signs itself.
const key = JSON.parse(raw);
const now = Math.floor(Date.now() / 1000);
const base64url = (data) => Buffer.from(data).toString('base64url');
const head = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const claims = base64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: key.token_uri, iat: now, exp: now + 3600 }));
const signature = crypto.createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key.private_key, 'base64url');
const tokenRes = await fetch(key.token_uri, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${signature}` }),
});
const token = await tokenRes.json();
if (!tokenRes.ok) {
  console.error(`Google token: ${tokenRes.status} ${token.error_description ?? token.error ?? ''}`);
  process.exit(1);
}

const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps/${encodeURIComponent(SITEMAP)}`;
const res = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${token.access_token}` } });
if (!res.ok) {
  console.error(`Google answered ${res.status}: ${await res.text()}`);
  process.exit(1);
}
console.log(`Submitted ${SITEMAP} to ${PROPERTY}.`);
