import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { getBlogImages, getImageInfo } from './images';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'images-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  const postDir = path.join(root, 'public', 'images', 'blogs', 'tech', 'hello');
  await mkdir(postDir, { recursive: true });
  await sharp({ create: { width: 320, height: 200, channels: 3, background: '#201f33' } })
    .jpeg()
    .toFile(path.join(postDir, 'cover.jpg'));
  await writeFile(path.join(postDir, 'notes.txt'), 'Not an image.');
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

test('returns the size and a tiny webp blur placeholder that keeps the aspect ratio', async () => {
  const info = await getImageInfo('/images/blogs/tech/hello/cover.jpg');

  expect(info).toMatchObject({
    src: '/images/blogs/tech/hello/cover.jpg',
    width: 320,
    height: 200,
    isAnimated: false,
  });
  expect(info.blurDataUrl).toMatch(/^data:image\/webp;base64,/);
  const blur = Buffer.from(info.blurDataUrl.split(',')[1], 'base64');
  expect(await sharp(blur).metadata()).toMatchObject({ width: 16, height: 10 });
});

test('detects animated images and reports the height of one frame', async () => {
  const frame = (background: string) =>
    sharp({ create: { width: 40, height: 30, channels: 3, background } })
      .png()
      .toBuffer();
  await sharp([await frame('#ff6101'), await frame('#201f33')], { join: { animated: true } })
    .gif()
    .toFile(path.join(root, 'public', 'images', 'blogs', 'tech', 'hello', 'demo.gif'));

  expect(await getImageInfo('/images/blogs/tech/hello/demo.gif')).toMatchObject({
    width: 40,
    height: 30,
    isAnimated: true,
  });
});

test('names the image when it cannot be read', async () => {
  await expect(getImageInfo('/images/blogs/tech/missing.jpg')).rejects.toThrow(/missing\.jpg/);
});

test('refuses images outside the blog images folder', async () => {
  await expect(getImageInfo('/images/other.jpg')).rejects.toThrow(/must be under/);
  await expect(getImageInfo('/images/blogs/../../secret.jpg')).rejects.toThrow(/outside/);
});

test('lists every image in a blog folder by public path, skipping other files', async () => {
  const images = await getBlogImages('tech');

  expect(Object.keys(images)).toEqual(['/images/blogs/tech/hello/cover.jpg']);
  expect(images['/images/blogs/tech/hello/cover.jpg'].isAnimated).toBe(false);
  expect(await getBlogImages('travel')).toEqual({});
});
