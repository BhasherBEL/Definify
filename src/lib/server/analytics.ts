import { Analytics } from '@bhasher/svelte-analytics';

import { env } from '$env/dynamic/private';

const analytics = new Analytics(env.ANALYTICS_ID, env.ANALYTICS_URL);

export default analytics;
