import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Wide enough to keep the image's colors, small enough to inline in the HTML.
const BLUR_WIDTH = 16;

/**
 * Builds a tiny base64 version of an image in `public/`, for `next/image`'s `blurDataURL`.
 * `src` is the image's public path, e.g. `/images/blogs/tech/my-post/cover.jpg`.
 */
export const getBlurDataUrl = async (src: string, publicDir = PUBLIC_DIR): Promise<string> => {
  // Runs only at build time (posts are read at module scope), so don't trace public/ into the
  // server bundle.
  const file = path.join(/* turbopackIgnore: true */ publicDir, src);
  if (!file.startsWith(`${publicDir}${path.sep}`)) {
    throw new Error(`Image path "${src}" points outside public/.`);
  }

  try {
    const buffer = await sharp(file).resize(BLUR_WIDTH).webp({ quality: 40 }).toBuffer();
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read image "${src}" in public/: ${reason}`);
  }
};
