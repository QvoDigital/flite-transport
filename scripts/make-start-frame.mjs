/**
 * Builds the start frame for regenerating the dock shot with the livery already on the van.
 *
 * Compositing a logo onto finished footage frame by frame can only ever approximate what the
 * doors are doing, because a flat overlay has no idea the panel is rotating away from camera.
 * Painting it onto a single still and handing that to an image-to-video model instead means the
 * model treats the livery as part of the vehicle from the first frame, and carries it through the
 * motion with the perspective it already understands.
 *
 * Geometry is the frame-1 measurement from scripts/measure-doors.mjs: doors span x 371..896 with
 * the seam at 633.
 *
 *   node scripts/make-start-frame.mjs <pristineFrame.webp> <out.png>
 */
import sharp from 'sharp';

const [input, out] = process.argv.slice(2);
if (!input || !out) {
  console.error('usage: node scripts/make-start-frame.mjs <frame> <out.png>');
  process.exit(1);
}

const DOOR_L = 371;
const DOOR_R = 896;
const SEAM = (DOOR_L + DOOR_R) / 2;

/**
 * Sized against the doors rather than the frame. Roughly 60% of the door width is what real
 * courier livery occupies: readable at distance without covering the panel.
 */
const WIDTH = Math.round((DOOR_R - DOOR_L) * 0.6);
const CY = 214;

const logo = await sharp('public/brand/logo-dark-text.png').metadata();
const height = Math.round(WIDTH * (logo.height / logo.width));

const mark = await sharp('public/brand/logo-dark-text.png')
  .resize(WIDTH, height, { fit: 'inside' })
  .toBuffer();

await sharp(input)
  .composite([
    {
      input: mark,
      left: Math.round(SEAM - WIDTH / 2),
      top: Math.round(CY - height / 2),
      // Multiply so the panel's shading and the low sun across the doors read through the vinyl,
      // which is what stops it looking like a sticker laid on top of a photograph.
      blend: 'multiply',
    },
  ])
  .png()
  .toFile(out);

console.log(`wrote ${out} - mark ${WIDTH}x${height} centred at ${SEAM},${CY}`);
