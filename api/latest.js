// Live feed for asifazad.com: the "Watch, read, listen" section and the /features page.
//
//   GET /api/latest?src=youtube|blog|podcast|features
//   -> { src, fetchedAt, items: [...] }
//
// Runs as a Vercel Function (Node.js runtime, Web Standard `fetch` export).
// No API keys or environment variables: it reads public RSS and Atom feeds.
// If a feed is down the endpoint returns an error and the page keeps showing its saved list.

const FEEDS = {
  youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKo7B_oGws8vtP2TWs4DXLw', // @theasifazad
  blog: 'https://digitalsage.substack.com/feed',                                         // Digital Sage
  podcast: 'https://anchor.fm/s/a43e694/podcast/rss',                                     // Experience with Asif Azad
  features: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLJcvzJB3sqWbshtMQvgz0TLXkmifLubih', // Features & collabs playlist
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

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json({ error: 'Method not allowed' }, 405, { allow: 'GET, HEAD' });
    }
    const src = new URL(request.url).searchParams.get('src');
    const feed = FEEDS[src];
    if (!feed) return json({ error: 'Unknown source' }, 400);

    try {
      const res = await fetch(feed, {
        headers: { 'user-agent': 'asifazad.com latest-feed' },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Upstream ${res.status}`);
      const xml = await res.text();
      const isYouTube = src === 'youtube' || src === 'features';
      const items = (isYouTube ? parseYouTube(xml) : parseRss(xml, src))
        .filter((i) => i.title)
        .slice(0, src === 'features' ? 50 : 4);
      return json({ src, fetchedAt: new Date().toISOString(), items }, 200, {
        // Vercel's CDN keeps this for 15 minutes, then serves the old copy for up to an hour
        // while it refreshes in the background. The visitor's browser always revalidates.
        'cache-control': 's-maxage=900, stale-while-revalidate=3600',
      });
    } catch (err) {
      return json({ error: 'Feed unavailable' }, 502, { 'cache-control': 'no-store' });
    }
  },
};
