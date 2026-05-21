/* eslint-env serviceworker */

// Cloudflare Worker entry point for serving static SPA assets
export default {
  async fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
    const assets = env.ASSETS as { fetch: (req: Request) => Promise<Response> };
    return assets.fetch(request);
  },
};
