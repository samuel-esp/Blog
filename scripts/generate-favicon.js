const Jimp = require('jimp');
const path = require('path');

(async function generate() {
  try {
    const src = path.join(__dirname, '..', 'static', 'img', 'profile.jpg');
    const out256 = path.join(__dirname, '..', 'static', 'img', 'favicon-256.png');
    const out32 = path.join(__dirname, '..', 'static', 'img', 'favicon-32x32.png');

    const image = await Jimp.read(src);

    // Create a centered square 256x256 and make it circular (transparent corners)
    const circ = image.clone().cover(256, 256, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).circle();

    // Optionally add a subtle white ring for contrast by compositing a slightly larger white circle behind
    const ring = new Jimp(256, 256, 0x00000000);
    // create a white filled circle slightly larger than the avatar and then composite the avatar on top
    const whiteBg = new Jimp(256, 256, 0xffffffff).circle();
    // make whiteBg slightly smaller transparent center by compositing a transparent circle onto it to create a ring
    // (we'll just use the white circle as an outer ring behind the avatar for subtle contrast)

    // Composite white ring behind (lower opacity) then avatar on top
    whiteBg.opacity(0.15);
    ring.composite(whiteBg, 0, 0);
    const final = ring.composite(circ, 0, 0);

    await final.writeAsync(out256);
    await final.clone().resize(32, 32).writeAsync(out32);

    console.log('Generated', out256, 'and', out32);
  } catch (err) {
    console.error('Failed to generate favicon images:', err);
    process.exit(1);
  }
})();

