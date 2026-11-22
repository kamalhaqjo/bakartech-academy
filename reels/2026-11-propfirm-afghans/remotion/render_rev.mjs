// Helper for a long render: renders the pieces of `node render.mjs --parts N` from the last one backwards in a second browser, so two
// browsers work at once. It stops at the first piece that is finished or that render.mjs has started (its .tmp.mp4 exists); it writes
// to its own temporary name, so if both happen to render the same piece, each file is complete. render.mjs still joins the pieces.
// usage: node render_rev.mjs --parts 12 [--concurrency 3]
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const parts = Number(opt('--parts', 12)), browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.join(HERE, 'src', 'index.jsx'), publicDir: path.join(HERE, 'public') });
const comp = await selectComposition({ serveUrl, id: 'PropFirmAfghans', inputProps: { audio: false }, browserExecutable }), N = comp.durationInFrames;
for (let k = parts - 1; k >= 0; k--) {
  const out = path.join(HERE, 'out', `piece${k + 1}.mp4`), range = [Math.floor(N * k / parts), Math.floor(N * (k + 1) / parts) - 1];
  if (fs.existsSync(out) || fs.existsSync(out + '.tmp.mp4')) { console.log(`piece ${k + 1} taken: stop`); break; }
  let last = -1;
  await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 18, pixelFormat: 'yuv420p', concurrency: Number(opt('--concurrency', 3)), browserExecutable, muted: true, frameRange: range,
    inputProps: { audio: false }, outputLocation: out + '.rev.tmp.mp4', onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p >= last + 25) { last = p; console.log(`rev piece ${k + 1}/${parts} ${p}%`); } } });
  fs.renameSync(out + '.rev.tmp.mp4', out); console.log(`rev piece ${k + 1} done`);
}
