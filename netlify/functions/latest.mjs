// Live feed for the "How I think" section on asifazad.com.
// GET /api/latest?src=youtube|blog|podcast  ->  { src, fetchedAt, items: [...4 latest] }
// Runs on Netlify Functions. No API keys or secrets needed: it reads public RSS/Atom feeds.

const FEEDS = {
  youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKo7B_oGws8vtP2TWs4DXLw', // @theasifazad
  blog: 'https://digitalsage.substack.com/feed',                                         // Digital Sage
  podcast: 'https://anchor.fm/s/a43e694/podcast/rss',                                     // Experience with Asif Azad
};

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };
const decode = (s = '') =>
  s.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '').replace(/&(amp|lt|gt|quot|#39|apos);/g, (m) => ENT[m]).trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};
const attr = (block, name, a) => {
  const m = block.match(new RegExp(`<${name}\\b[^>]*\\s${a}="([^"]+)"`));
  return m ? decode(m[1]) : '';
};
const iso = (d) => { const t = new Date(d); return isNaN(t) ? '' : t.toISOString(); };

function parseYouTube(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const id = tag(e, 'yt:videoId');
    return { id, title: tag(e, 'title'), date: iso(tag(e, 'published')),
      url: `https://www.youtube.com/watch?v=${id}`, image: attr(e, 'media:thumbnail', 'url') };
  });
}

function parseRss(xml, kind) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, i]) => {
    const encUrl = attr(i, 'enclosure', 'url'), encType = attr(i, 'enclosure', 'type');
    return {
      title: tag(i, 'title'),
      date: iso(tag(i, 'pubDate')),
      url: tag(i, 'link'),
      audio: kind === 'podcast' && /audio/.test(encType) ? encUrl : undefined,
      duration: tag(i, 'itunes:duration') || undefined,
      image: attr(i, 'itunes:image', 'href') || (/image/.test(encType) ? encUrl : ''),
    };
  });
}

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...extra } });

export default async (req) => {
  const src = new URL(req.url).searchParams.get('src');
  const feed = FEEDS[src];
  if (!feed) return json({ error: 'Unknown source' }, 400);
  try {
    const res = await fetch(feed, { headers: { 'user-agent': 'asifazad.com latest-feed' } });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const xml = await res.text();
    const items = (src === 'youtube' ? parseYouTube(xml) : parseRss(xml, src)).filter((i) => i.title).slice(0, 4);
    return json({ src, fetchedAt: new Date().toISOString(), items }, 200, {
      // Cache at Netlify's edge for 15 min, serve stale for up to an hour while it refreshes.
      'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=900, stale-while-revalidate=3600',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    });
  } catch (err) {
    return json({ error: 'Feed unavailable' }, 502);
  }
};

export const config = { path: '/api/latest' };
