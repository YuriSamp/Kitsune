import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';
import {remarkReadingTime} from './plugin/remark-read-time';

export default defineConfig({
  site: 'https://yurisamp.dev/',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
