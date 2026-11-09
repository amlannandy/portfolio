import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import type { Blog, ImageInfo } from '@portfolio/types/post';

/** Public path every blog image lives under (`public/images/blogs/<blog>/<slug>/`). */
export const BLOG_IMAGES_PATH = '/images/blogs/';

// Wide enough to keep the image's colors, small enough to inline in the HTML.
const BLUR_WIDTH = 16;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

// Paths are joined from literal folder names so the build bundles only public/images/blogs with
// the server code. It needs them when it renders a post on request, e.g. for an unknown slug.
const resolveBlogImage = (src: string): string => {
  if (!src.startsWith(BLOG_IMAGES_PATH)) {
    throw new Error(`Image "${src}" must be under public${BLOG_IMAGES_PATH}.`);
  }
  const relative = src.slice(BLOG_IMAGES_PATH.length);
  const file = path.join(process.cwd(), 'public', 'images', 'blogs', relative);
  if (!file.startsWith(path.join(process.cwd(), 'public', 'images', 'blogs') + path.sep)) {
    throw new Error(`Image path "${src}" points outside public${BLOG_IMAGES_PATH}.`);
  }
  return file;
};

/** Size and blur placeholder of a blog image, given its public path. */
export const getImageInfo = async (src: string): Promise<ImageInfo> => {
  const file = resolveBlogImage(src);
  try {
    const image = sharp(file);
    const { width, height, pageHeight, pages } = await image.metadata();
    const blur = await image.resize(BLUR_WIDTH).webp({ quality: 40 }).toBuffer();
    return {
      src,
      width,
      // Animated images report every frame stacked; use one frame's height.
      height: pageHeight ?? height,
      blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
      isAnimated: (pages ?? 1) > 1,
    };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read image "${src}" in public/: ${reason}`);
  }
};

/** Every image in a blog's folder, keyed by public path, for rendering post bodies. */
export const getBlogImages = async (blog: Blog): Promise<Record<string, ImageInfo>> => {
  let files: string[];
  try {
    files = await readdir(path.join(process.cwd(), 'public', 'images', 'blogs', blog), {
      recursive: true,
    });
  } catch (error: unknown) {
    // A blog with no posts has no image folder yet.
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return {};
    throw error;
  }

  const images = await Promise.all(
    files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map((file) => getImageInfo(`${BLOG_IMAGES_PATH}${blog}/${file.split(path.sep).join('/')}`))
  );
  return Object.fromEntries(images.map((image) => [image.src, image]));
};
