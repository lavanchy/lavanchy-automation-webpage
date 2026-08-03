import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Aktuell nur "de". Für fr/en: analoge Collections mit base './src/content/fr/...'
// bzw. './src/content/en/...' ergänzen, siehe README.

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, legal, blog };
