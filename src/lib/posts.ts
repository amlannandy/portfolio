import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

import { getBlurDataUrl } from '@portfolio/lib/blurDataUrl';
import type { Blog, PostFrontmatter, PostSummary } from '@portfolio/types/post';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const MDX_STATEMENT_PATTERN = /^(?:import|export)\s.*$/gm;
const WORDS_PER_MINUTE = 200;

interface ParsedPost {
  slug: string;
  frontmatter: PostFrontmatter;
  readingMinutes: number;
}

interface LoadPostsOptions {
  /** Folder holding one `<slug>.mdx` file per post. */
  directory: string;
  /** Drafts are listed in development only. */
  shouldIncludeDrafts: boolean;
  /** Where cover image paths resolve; defaults to the project's `public/`. */
  publicDir?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const invalidPost = (file: string, problem: string): Error =>
  new Error(`Invalid post ${file}: ${problem}`);

/** Splits an MDX source into its raw YAML frontmatter and its body. */
export const splitFrontmatter = (source: string, file: string): { yaml: string; body: string } => {
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) throw invalidPost(file, 'it must start with a `---` frontmatter block.');
  return { yaml: match[1], body: source.slice(match[0].length) };
};

/** Checks parsed YAML against the frontmatter contract, so bad content fails the build. */
export const parseFrontmatter = (data: unknown, file: string): PostFrontmatter => {
  if (!isRecord(data)) throw invalidPost(file, 'frontmatter must be a YAML mapping.');
  const { title, date, summary, tags, draft, cover } = data;

  if (typeof title !== 'string' || title.trim() === '') {
    throw invalidPost(file, '`title` is required.');
  }
  if (
    typeof date !== 'string' ||
    !DATE_PATTERN.test(date) ||
    Number.isNaN(Date.parse(`${date}T00:00:00Z`))
  ) {
    throw invalidPost(file, "`date` is required as a quoted 'YYYY-MM-DD' string.");
  }
  if (summary !== undefined && typeof summary !== 'string') {
    throw invalidPost(file, '`summary` must be a string.');
  }
  if (
    tags !== undefined &&
    !(Array.isArray(tags) && tags.every((tag): tag is string => typeof tag === 'string'))
  ) {
    throw invalidPost(file, '`tags` must be a list of strings.');
  }
  if (draft !== undefined && typeof draft !== 'boolean') {
    throw invalidPost(file, '`draft` must be true or false.');
  }
  if (cover !== undefined && (typeof cover !== 'string' || !cover.startsWith('/'))) {
    throw invalidPost(file, '`cover` must be a path under public/, starting with `/`.');
  }

  return {
    title,
    date,
    ...(summary !== undefined && { summary }),
    ...(tags !== undefined && { tags }),
    ...(draft !== undefined && { draft }),
    ...(cover !== undefined && { cover }),
  };
};

/** Estimated minutes to read a post body, ignoring MDX import/export lines. Never below 1. */
export const getReadingMinutes = (body: string): number => {
  const words = body.replace(MDX_STATEMENT_PATTERN, '').match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

/** Drops drafts unless asked to keep them, then orders newest first (ties by title). */
export const selectListedPosts = (
  posts: ParsedPost[],
  shouldIncludeDrafts: boolean
): ParsedPost[] =>
  posts
    .filter((post) => shouldIncludeDrafts || !post.frontmatter.draft)
    .sort(
      (a, b) =>
        b.frontmatter.date.localeCompare(a.frontmatter.date) ||
        a.frontmatter.title.localeCompare(b.frontmatter.title)
    );

const readPostFiles = async (directory: string): Promise<string[]> => {
  try {
    const files = await readdir(directory);
    return files.filter((file) => file.endsWith('.mdx'));
  } catch (error: unknown) {
    // A blog with no posts yet has no folder (git doesn't keep empty ones).
    if (isRecord(error) && error.code === 'ENOENT') return [];
    throw error;
  }
};

const parsePostFile = async (directory: string, file: string): Promise<ParsedPost> => {
  const slug = file.slice(0, -'.mdx'.length);
  if (!SLUG_PATTERN.test(slug)) {
    throw invalidPost(file, 'the filename must be a lowercase kebab-case slug.');
  }

  const source = await readFile(path.join(directory, file), 'utf8');
  const { yaml, body } = splitFrontmatter(source, file);
  return {
    slug,
    frontmatter: parseFrontmatter(parseYaml(yaml), file),
    readingMinutes: getReadingMinutes(body),
  };
};

/** Reads every post in a folder and returns what its listing shows, newest first. */
export const loadPosts = async ({
  directory,
  shouldIncludeDrafts,
  publicDir,
}: LoadPostsOptions): Promise<PostSummary[]> => {
  const files = await readPostFiles(directory);
  const posts = await Promise.all(files.map((file) => parsePostFile(directory, file)));

  return Promise.all(
    selectListedPosts(posts, shouldIncludeDrafts).map(
      async ({ slug, frontmatter, readingMinutes }) => ({
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        ...(frontmatter.summary && { summary: frontmatter.summary }),
        readingMinutes,
        ...(frontmatter.cover && {
          cover: {
            src: frontmatter.cover,
            blurDataUrl: await getBlurDataUrl(frontmatter.cover, publicDir),
          },
        }),
      })
    )
  );
};

/** A blog's listed posts. Call it at module scope so the files are read once, at build time. */
export const getPosts = async (blog: Blog): Promise<PostSummary[]> =>
  loadPosts({
    directory: path.join(CONTENT_DIR, blog),
    shouldIncludeDrafts: process.env.NODE_ENV !== 'production',
  });
