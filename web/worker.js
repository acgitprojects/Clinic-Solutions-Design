// Cloudflare Worker — strips /fbhk/clinic-solutions-config prefix before
// serving static assets, and falls back to index.html for SPA navigation.
const BASE = '/fbhk/clinic-solutions-config';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Strip the mount-point prefix
    if (path.startsWith(BASE)) {
      path = path.slice(BASE.length) || '/';
    }
    if (path === '') path = '/';

    // Try the exact asset first
    const assetReq = new Request(new URL(path + url.search, url.origin), {
      method: 'GET',
      headers: request.headers,
    });

    let res = await env.ASSETS.fetch(assetReq);

    // SPA fallback: any 404 that isn't a static asset → serve index.html
    if (res.status === 404 && !path.match(/\.[a-z0-9]+$/i)) {
      res = await env.ASSETS.fetch(
        new Request(new URL('/index.html', url.origin), { headers: request.headers })
      );
    }

    return res;
  },
};
