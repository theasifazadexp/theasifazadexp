# asifazad.com — deploy folder

Built 2026-10-05. 13 pages in the sitemap, plus a 404 page.

## Pages
- `/` home (case-study pop-ups now link to their full pages; services link to their pages)
- `/about/` the full story as a real page; arriving from "About me" plays the circle reveal on top of the home page
- `/work/` + 6 case studies, each in four sections: Overview, Objectives, Role, Outcome
- `/services/` + 4 service pages
- `/api/latest` live feed function (in `vercel/functions/`)

## Deploy on Vercel
1. Deploy this folder with the Vercel CLI (`vecel deploy --prod`) or a Git-connected site. Drag-and-drop won't build the `/api/latest` function.
2. Point asifazad.com at the Netlify site.
3. Check these load: `/about/`, `/work/mana-bay/`, `/services/personal-brand/`, `/sitemap.xml`, `/api/latest?src=youtube`.

## Google Analytics 4
1. In Google Analytics, create a GA4 property with a Web data stream for https://asifazad.com and copy its Measurement ID (starts with `G-`).
2. In `assets/analytics.js`, replace `G-XXXXXXXXXX` with it and redeploy. Until then the file does nothing.
3. Visitors get an Accept / No thanks choice. GA loads only after Accept.
4. In GA, mark `book_call_click` as a key event.

Events sent: `book_call_click`, `email_click`, `community_join_click`, `about_open`, `dock_click`, `case_study_open`, `testimonial_video_play`, `content_open`, `feature_open`. Page views, scrolls and outbound clicks come from GA4's enhanced measurement. Bookings finish on cal.com, so GA records the click, not the confirmed booking.

## Google Search Console
1. Add a **Domain** property for `asifazad.com` and verify it with the DNS TXT record Google gives you (add it at your domain registrar).
2. Sitemaps: submit `sitemap.xml`.
3. URL Inspection: request indexing for `/`, `/about/`, `/work/` and `/services/`.

## Bing Webmaster Tools
Sign in and use **Import from Google Search Console**. It brings the site and sitemap across.

## Content still needed
- **Shakib Khan:** missing Outcome.
- **Bongo BOOM:** missing Overview, Objectives, Outcome. Page is set to noindex until filled.
- **Facebook:** the dock and footer now use facebook.com/asifbazad, taken from your podcast's show notes. Confirm it's current.

## Updating
These pages are generated from the design artifact by a build script. Ask Claude to rebuild after content changes so every page stays in sync.
