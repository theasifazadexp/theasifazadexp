# asifazad.com

Personal site of Asif Bin Azad. Static pages plus one small serverless function, deployed on Vercel from this GitHub repository.

## What is in this repository

```
public/          The website. Vercel serves this folder.
  index.html, about-me/, experience/, digital-sage/, features/, space/, 404.html
  assets/        Styles, scripts, images, fonts, share cards (/assets/og/)
  robots.txt, sitemap.xml
api/latest.js    Live feed for "Watch, read, listen" and /features (YouTube, Substack, podcast)
vercel.json      Output folder, redirects, security and cache headers
package.json     Marks api/ as modern JavaScript modules. No dependencies, nothing to install
```

There is no build step. Vercel serves `public/` as it is and runs `api/latest.js` as a function.

## Deploy (first time)

1. **Replace the repository contents.** Delete the old Netlify files (`netlify.toml`, the `netlify/` folder) and everything else from the previous upload. Add everything from this folder, keeping the structure above. Commit to the production branch (usually `main`).
2. **Import the project.** In Vercel: Add New, Project, then pick this GitHub repository.
3. **Check the settings.** Framework Preset: Other. Root Directory: the repository root. Build command and install command: leave empty. Output Directory: `public` (already set in `vercel.json`). No environment variables are needed. Click Deploy.
4. **Open the preview address** Vercel gives you (`something.vercel.app`) and run the checklist below before pointing the domain.

## Connect asifazad.com

1. In the project, go to Settings, Domains, and add `asifazad.com`. Add `www.asifazad.com` when Vercel offers it, and set `www` to redirect to `asifazad.com` (the site's canonical address is the version without `www`).
2. Vercel shows the exact DNS records on the domain card. Use those values. Typically the apex (`@`) is an A record to `76.76.21.21`, and `www` is a CNAME to the target shown on the card.
3. At your domain registrar, delete the old Netlify records for `@` and `www` (A, ALIAS or CNAME pointing at Netlify) and remove any AAAA record on the apex. **Leave MX and TXT records alone**: they run your email (hi@asifazad.com). Do not switch the domain's nameservers to Vercel unless you first copy every existing record across.
4. Wait for Vercel to show Valid Configuration. HTTPS is issued automatically, usually within minutes of DNS propagating.

## Checklist after each deploy

| Check | Expected |
|---|---|
| `/` , `/about-me/` , `/experience/` , `/digital-sage/` , `/features/` , `/space/` | Each page loads, light and dark mode both work |
| `/about` and `/about/` | Both redirect to `/about-me/` (the only About address) |
| `/work/mana-bay/` | Redirects to `/experience/mana-bay/` |
| `/services/digital-strategy/` | Redirects to `/digital-sage/digital-strategy/` |
| `/api/latest?src=features` | JSON with a list of `items` |
| `/api/latest?src=youtube` | JSON with up to four `items` |
| `/robots.txt`, `/sitemap.xml` | Load, and the sitemap lists all 15 pages |
| `/this-page-does-not-exist` | The custom 404 page |
| Booking, email and social buttons | Open cal.com/asifazad/disco, a new email to hi@asifazad.com, and the right profiles |

If `/api/latest` ever fails, the pages keep working: the live sections show their saved list instead.

## After the domain is live

- **Search Console:** add the `asifazad.com` domain property and submit `https://asifazad.com/sitemap.xml`. The old `/work/` and `/services/` addresses redirect permanently, so existing links and rankings carry over.
- **Share previews:** run the home page through Facebook's Sharing Debugger (Scrape Again) and LinkedIn's Post Inspector so the new share card replaces any cached one. WhatsApp refreshes by itself.
- **Analytics:** Google Analytics 4 is set up with Measurement ID `G-B2QGFDW302` in `public/assets/analytics.js`, and every page loads that file. Visitors see a one-line choice the first time; the tag only loads, and nothing is sent to Google, for people who click Accept. To check it, open the site, click Accept, then look for yourself in Google Analytics under Reports, Realtime. In GA, mark `book_call_click` as a key event so booking clicks count as conversions.

## Making changes

Every push to the production branch deploys automatically. Pushes to any other branch, and pull requests, get their own preview address, so you can check a change before it goes live.

The site is generated, not hand-written, so ask Claude for content or design changes rather than editing the HTML by hand. Claude produces an updated copy of `public/`; replace the folder's contents and commit.

## Live feed

`api/latest.js` reads the public YouTube channel feed, the Features playlist feed, the Digital Sage Substack and the podcast feed. It needs no keys. Vercel's CDN caches each answer for 15 minutes and serves the previous copy for up to an hour while it refreshes, so the feeds are never hit on every page view. To change a source, edit the `FEEDS` list at the top of the file.

## Facts to keep in sync

Canonical figures, links and contact details live in the generated pages. If one changes (a campaign figure, the booking link, an email address), change it everywhere in one pass rather than page by page.
