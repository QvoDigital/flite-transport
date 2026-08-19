/**
 * Throwaway inspection helper: tiles selected frames into one image so a whole sequence can be
 * eyeballed in a single look instead of opening frames one at a time.
 *
 *   node scripts/contact-sheet.mjs <clip> <out.jpg> [frame numbers...]
 */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const [clip, out, ...picked] = process.argv.slice(2);
const dir = join(process.cwd(), 'public', 'seq', clip, 'wide');

const all = (await readdir(dir)).filter((f) => f.endsWith('.webp')).sort();
const frames = picked.length
  ? picked.map((n) => `${String(Number(n)).padStart(4, '0')}.webp`)
  : all.filter((_, i) => i % Math.ceil(all.length / 12) === 0);

const COLS = 4;
const W = 400;
const H = Math.round((W * 9) / 16);

const tiles = await Promise.all(
  frames.map(async (f, i) => ({
    input: await sharp(join(dir, f))
      .resize(W, H, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${W}" height="28"><rect width="${W}" height="28" fill="rgba(0,0,0,0.65)"/><text x="8" y="20" font-family="monospace" font-size="16" fill="#fff">${f.replace('.webp', '')}</text></svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer(),
    top: Math.floor(i / COLS) * H,
    left: (i % COLS) * W,
  }))
);

await sharp({
  create: {
    width: COLS * W,
    height: Math.ceil(frames.length / COLS) * H,
    channels: 3,
    background: '#111',
  },
})
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile(out);

console.log(`wrote ${out} (${frames.length} frames of ${all.length})`);
