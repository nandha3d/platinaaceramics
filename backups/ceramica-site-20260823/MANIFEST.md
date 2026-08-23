# Backup of animazon.in/ceramica — 2026-08-23

## THIS BACKUP IS INCOMPLETE. Do not deploy over the live site using it.

The site is a built Vite SPA: `index.html` loads a single 1.47 MB JavaScript
bundle that contains the entire application. Without that bundle the site is a
blank page, so the files captured here are NOT sufficient to restore it.

### Captured (text files, via the Hostinger API)
| file | size | status |
|---|---|---|
| index.html | 1,319 B | complete |
| assets/index-BZZfMlBy.css | 3,954 B | complete |

### NOT captured — and required for a restore
| file | size | why not |
|---|---|---|
| assets/index-B--aQ42u.js | 1,474,740 B | too large for the file-content API |
| assets/index-DO8K4CU7.js | 1,474,731 B | too large for the file-content API |
| concrete.png | 805,752 B | binary; API returns text only |
| favicon.svg | 9,522 B | API rejects the type |
| icons.svg | 5,031 B | API rejects the type |

The Hostinger MCP tools expose no server-side copy, move or archive operation,
and this environment has no outbound network access, so the remaining files
cannot be pulled down here.

## To take a real backup
Either of these produces a complete copy in a couple of minutes:

1. hPanel -> Files -> File Manager -> `domains/animazon.in/public_html/`
   -> right-click `ceramica` -> Compress -> download the archive.
2. Or over SSH from a machine that can reach the host:
   `ssh -p 65002 u362580417@217.21.74.44 "cd domains/animazon.in/public_html && tar czf ~/ceramica-backup.tgz ceramica"`
   then download `ceramica-backup.tgz`.

## What the site is
"ceramica. | High-Density Grinding Media & Lining Bricks" — Yttria/Ceria
Zirconia beads, 99% alumina grinding balls, alumina lining bricks. A different
brand from Platinaa's inert bed-support media. Its source is not present on this
machine; the deployed bundle is minified and is the only copy found.

## Why this site matters beyond being a backup

It reportedly has a working 3D hero — the thing the Platinaa hero is currently
failing at. Probing the bundle established one useful fact:

- line 5310 of `index-B--aQ42u.js` is **N8AO shader source** (`#define HALFRES`,
  `#define ORTHO`). So the working site runs the same screen-space AO library
  that was suspected of breaking the Platinaa hero. N8AO is therefore not
  inherently the problem; the difference is in how it is configured or mounted.

The bundle is minified and 1.47 MB. It can be paged through the file-content API
but reconstructing and reverse-engineering it is far more expensive and less
reliable than reading the original source, which is not on this machine.

**Do not deploy over /ceramica until this is backed up.** Doing so destroys the
only copy of a working reference implementation.
