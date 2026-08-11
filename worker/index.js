/**
 * Cloudflare Worker entry — serves brain/ and relays Apex's questions.
 * Deploy with wrangler; see "Hosting Apex" in the repository README.
 * The request handling itself lives in apex.js, shared with the Pages build.
 */

import { handleApi } from './apex.js';

export default {
  async fetch(request, env) {
    const handled = await handleApi(request, env);
    return handled || env.ASSETS.fetch(request);
  },
};
