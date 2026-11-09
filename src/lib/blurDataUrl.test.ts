import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { getBlurDataUrl } from './blurDataUrl';

let publicDir: string;

beforeEach(async () => {
  publicDir = await mkdtemp(path.join(tmpdir(), 'public-'));
  await sharp({ create: { width: 320, height: 200, channels: 3, background: '#201f33' } })
    .jpeg()
    .toFile(path.join(publicDir, 'cover.jpg'));
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

test('returns a tiny webp data URL that keeps the aspect ratio', async () => {
  const dataUrl = await getBlurDataUrl('/cover.jpg', publicDir);

  expect(dataUrl).toMatch(/^data:image\/webp;base64,/);
  const image = Buffer.from(dataUrl.split(',')[1], 'base64');
  expect(await sharp(image).metadata()).toMatchObject({ width: 16, height: 10 });
});

test('names the image when it cannot be read', async () => {
  await expect(getBlurDataUrl('/missing.jpg', publicDir)).rejects.toThrow(/missing\.jpg/);
});

test('refuses paths outside public/', async () => {
  await expect(getBlurDataUrl('/../secret.jpg', publicDir)).rejects.toThrow(/outside public/);
});
