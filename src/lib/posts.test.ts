import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PostFrontmatter } from '@portfolio/types/post';

import {
  getReadingMinutes,
  loadPosts,
  parseFrontmatter,
  selectListedPosts,
  splitFrontmatter,
} from './posts';

describe('splitFrontmatter', () => {
  test('separates the YAML block from the body', () => {
    expect(splitFrontmatter("---\ntitle: 'Hi'\n---\n\nBody text", 'hi.mdx')).toEqual({
      yaml: "title: 'Hi'",
      body: '\nBody text',
    });
  });

  test('rejects a file without frontmatter', () => {
    expect(() => splitFrontmatter('# Just a heading', 'hi.mdx')).toThrow(/hi\.mdx/);
  });
});

describe('parseFrontmatter', () => {
  test('keeps the fields a post sets', () => {
    const data = {
      title: 'Hello',
      date: '2026-01-31',
      summary: 'A summary.',
      tags: ['nextjs'],
      draft: false,
      cover: '/images/blogs/tech/hello/cover.jpg',
    };
    expect(parseFrontmatter(data, 'hello.mdx')).toEqual(data);
  });

  test('leaves out optional fields a post does not set', () => {
    expect(parseFrontmatter({ title: 'Hello', date: '2026-01-31' }, 'hello.mdx')).toEqual({
      title: 'Hello',
      date: '2026-01-31',
    });
  });

  test.each([
    ['a missing title', { date: '2026-01-31' }, /title/],
    ['an unquoted date', { title: 'Hi', date: new Date('2026-01-31') }, /date/],
    ['an impossible date', { title: 'Hi', date: '2026-13-45' }, /date/],
    ['non-string tags', { title: 'Hi', date: '2026-01-31', tags: [1] }, /tags/],
    [
      'a cover outside the blog images',
      { title: 'Hi', date: '2026-01-31', cover: '/cover.jpg' },
      /cover/,
    ],
  ])('rejects %s', (_, data, problem) => {
    expect(() => parseFrontmatter(data, 'hi.mdx')).toThrow(problem);
  });
});

describe('getReadingMinutes', () => {
  test('rounds up at 200 words a minute', () => {
    expect(getReadingMinutes('word '.repeat(201))).toBe(2);
  });

  test('is at least one minute and ignores MDX import lines', () => {
    expect(getReadingMinutes("import Chart from './Chart';\n\nShort.")).toBe(1);
  });
});

describe('selectListedPosts', () => {
  const post = (slug: string, frontmatter: Partial<PostFrontmatter>) => ({
    slug,
    frontmatter: { title: slug, date: '2026-01-01', ...frontmatter },
    readingMinutes: 1,
  });
  const posts = [
    post('older', { date: '2025-06-01' }),
    post('draft', { date: '2026-03-01', draft: true }),
    post('newer', { date: '2026-02-01' }),
  ];

  test('orders newest first and hides drafts', () => {
    expect(selectListedPosts(posts, false).map((entry) => entry.slug)).toEqual(['newer', 'older']);
  });

  test('keeps drafts when asked to', () => {
    expect(selectListedPosts(posts, true).map((entry) => entry.slug)).toEqual([
      'draft',
      'newer',
      'older',
    ]);
  });
});

describe('loadPosts', () => {
  let root: string;
  let directory: string;
  let imageDir: string;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'posts-'));
    // Image paths resolve from the project root, so point it at the temporary folder.
    vi.spyOn(process, 'cwd').mockReturnValue(root);
    directory = path.join(root, 'content');
    imageDir = path.join(root, 'public', 'images', 'blogs', 'tech', 'hello-world');
    await mkdir(directory);
    await mkdir(imageDir, { recursive: true });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(root, { recursive: true, force: true });
  });

  test('returns nothing for a blog without a content folder', async () => {
    const options = { directory: path.join(root, 'missing'), shouldIncludeDrafts: false };
    expect(await loadPosts(options)).toEqual([]);
  });

  test('summarizes each post, with a blur placeholder for its cover', async () => {
    await sharp({ create: { width: 64, height: 40, channels: 3, background: '#ff6101' } })
      .png()
      .toFile(path.join(imageDir, 'cover.png'));
    await writeFile(
      path.join(directory, 'hello-world.mdx'),
      "---\ntitle: 'Hello world'\ndate: '2026-01-31'\nsummary: 'First post.'\ncover: '/images/blogs/tech/hello-world/cover.png'\n---\n\nHi there."
    );
    await writeFile(path.join(directory, 'notes.txt'), 'Not a post.');
    await writeFile(path.join(directory, '_template.mdx'), "---\ntitle: 'Template'\n---\n");

    const [summary, ...rest] = await loadPosts({ directory, shouldIncludeDrafts: false });

    expect(rest).toEqual([]);
    expect(summary).toMatchObject({
      slug: 'hello-world',
      title: 'Hello world',
      date: '2026-01-31',
      summary: 'First post.',
      readingMinutes: 1,
      cover: { src: '/images/blogs/tech/hello-world/cover.png', width: 64, height: 40 },
    });
    expect(summary.cover?.blurDataUrl).toMatch(/^data:image\/webp;base64,/);
  });

  test('fails on a filename that is not a kebab-case slug', async () => {
    await writeFile(path.join(directory, 'Hello World.mdx'), "---\ntitle: 'Hi'\n---\n");
    await expect(loadPosts({ directory, shouldIncludeDrafts: false })).rejects.toThrow(/slug/);
  });

  test('fails when a cover image is missing', async () => {
    await writeFile(
      path.join(directory, 'hello.mdx'),
      "---\ntitle: 'Hi'\ndate: '2026-01-31'\ncover: '/images/blogs/tech/missing.jpg'\n---\n"
    );
    await expect(loadPosts({ directory, shouldIncludeDrafts: false })).rejects.toThrow(
      /missing\.jpg/
    );
  });
});

// Checks the posts committed to the repo, so broken content fails the tests, not just the build.
describe.each(['tech', 'travel'] as const)('committed %s posts', (blog) => {
  const directory = path.join(process.cwd(), 'src', 'content', blog);

  test('load, with valid frontmatter and cover images', async () => {
    await expect(loadPosts({ directory, shouldIncludeDrafts: true })).resolves.toBeDefined();
  });

  test('link only to posts and images that exist', async () => {
    const files = (await readdir(directory)).filter((file) => !file.startsWith('_'));
    const slugs = new Set(files.map((file) => file.replace(/\.mdx$/, '')));

    for (const file of files) {
      const source = await readFile(path.join(directory, file), 'utf8');
      for (const [, slug] of source.matchAll(
        new RegExp(`\\]\\(/blogs/${blog}/([a-z0-9-]+)\\)`, 'g')
      )) {
        expect(slugs, `${file} links to a missing post "${slug}"`).toContain(slug);
      }
      for (const [, src] of source.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
        await expect(
          readFile(path.join(process.cwd(), 'public', src)),
          `${file}: ${src}`
        ).resolves.toBeDefined();
      }
    }
  });
});
