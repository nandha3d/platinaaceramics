/*
 * Rewrites dist/.htaccess for the deploy target.
 *
 * public/.htaccess is copied verbatim by Vite, but RewriteBase and the fallback
 * target are location-dependent: under /ceramica/ a `RewriteBase /` sends every
 * deep link to the domain root's index.html, which is a different site. Vite has
 * no hook for this, so it runs as a build step rather than being something a
 * person has to remember at deploy time.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const base = process.env.DEPLOY_BASE || '/';
const file = 'dist/.htaccess';

if (!existsSync(file)) {
  console.error('fix-htaccess: dist/.htaccess missing — did the build run?');
  process.exit(1);
}

/*
 * Only RewriteBase changes. The fallback target stays RELATIVE.
 *
 * Rewriting it to an absolute `/ceramica/index.html` as well was wrong and
 * produced a 403 on every deep link: the rule target is already resolved
 * against RewriteBase, so the absolute form resolved to
 * /ceramica/ceramica/index.html.
 */
let s = readFileSync(file, 'utf8');
s = s.replace(/RewriteBase\s+\S+/, `RewriteBase ${base}`);
writeFileSync(file, s);

console.log(`fix-htaccess: RewriteBase ${base}`);
