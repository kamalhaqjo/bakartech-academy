// Renders level 3, lesson 9 from DIRECTOR.md with Remotion. --sheet: one still per shot (62% into the shot, after its elements are in) -> out/stills/,
// then contact_sheet.py puts them in a grid (out/contact_sheet.png). Without --sheet: the full video out/l3_lesson09_raw.mp4 + out/timing.json.
// usage: node render.mjs [--sheet] [--shots S01,S05]   (REMOTION_BROWSER=<chrome path> to use a local Chromium)
// Long renders can crash Chromium ("Page crashed!" at 50-65%). --parts N renders the video in N pieces without audio, each in a fresh
// browser (a failed piece is tried again, finished pieces are kept if the run is restarted), then joins them and adds public/mix.wav.
import { bundle } from '@remotion/bundler';
import { openBrowser, renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const data = JSON.parse(fs.readFileSync(path.join(HERE, 'src', 'shots.json'), 'utf8'));
const browserExecutable = process.env.REMOTION_BROWSER || null;
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'out', 'timing.json'), JSON.stringify({ fps: data.fps, duration: data.duration, shots: data.shots.map(s => ({ id: s.id, type: s.type, from: s.from, to: s.to, spoken: s.spoken })) }, null, 1));
const serveUrl = await bundle({ entryPoint: path.join(HERE, 'src', 'index.jsx'), publicDir: path.join(HERE, 'public') });
if (args.includes('--sheet')) {
  const want = opt('--shots', null)?.split(','), comp = await selectComposition({ serveUrl, id: 'L3Lesson9', inputProps: { audio: false }, browserExecutable });
  const browser = await openBrowser('chrome', { browserExecutable }); fs.mkdirSync(path.join(HERE, 'out', 'stills'), { recursive: true });
  for (const s of data.shots) {
    if (want && !want.includes(s.id)) continue;
    const at = Number(opt('--at', 0.62)), frame = Math.round((s.from + (s.to - s.from) * at) * data.fps), t0 = Date.now();
    await renderStill({ composition: comp, serveUrl, frame, inputProps: { audio: false }, output: path.join(HERE, 'out', 'stills', opt('--at', null) ? `${s.id}@${opt('--at', null)}.png` : `${s.id}.png`), puppeteerInstance: browser, scale: 0.5 });
    console.log(`${s.id} frame ${frame}: ${Date.now() - t0} ms`);
  }
  await browser.close({ silent: true });
} else {
  const parts = Number(opt('--parts', 1)), audio = parts === 1 && !args.includes('--test'), raw = path.join(HERE, 'out', 'l3_lesson09_raw.mp4');
  const comp = await selectComposition({ serveUrl, id: 'L3Lesson9', inputProps: { audio }, browserExecutable }), N = comp.durationInFrames;
  const piece = k => path.join(HERE, 'out', `piece${k + 1}.mp4`), test = opt('--test', null)?.split('-').map(x => Math.round(Number(x) * data.fps));
  for (let k = 0; k < parts; k++) {   // --test A-B (seconds): only that stretch, without audio, -> out/test.mp4 (for checking a fix)
    const range = test || [Math.floor(N * k / parts), Math.floor(N * (k + 1) / parts) - 1], out = test ? path.join(HERE, 'out', 'test.mp4') : parts === 1 ? raw : piece(k);
    if (test && k > 0) break;
    if (parts > 1 && fs.existsSync(out)) { console.log(`piece ${k + 1} already rendered`); continue; }
    for (let tries = 1; ; tries++) {
      let last = -1;
      try {
        await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 18, pixelFormat: 'yuv420p', concurrency: Number(opt('--concurrency', 4)), browserExecutable,
          ...(audio ? { audioCodec: 'aac', audioBitrate: '192k' } : { muted: true, frameRange: range }), inputProps: { audio }, outputLocation: out + '.tmp.mp4',
          onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p >= last + 10) { last = p; console.log(`render ${parts > 1 ? `piece ${k + 1}/${parts} ` : ''}${p}%`); } } });
        fs.renameSync(out + '.tmp.mp4', out); break;
      } catch (e) { console.log(`piece ${k + 1} try ${tries} failed: ${e.message}`); fs.rmSync(out + '.tmp.mp4', { force: true }); if (tries >= 3) throw e; }
    }
  }
  if (parts > 1 && !test) {
    const list = path.join(HERE, 'out', 'pieces.txt');
    fs.writeFileSync(list, Array.from({ length: parts }, (_, k) => `file '${piece(k)}'`).join('\n') + '\n');
    const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', path.join(HERE, 'public', 'mix.wav'),
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', String(N / data.fps), '-movflags', '+faststart', raw], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error('joining the pieces failed');
    for (let k = 0; k < parts; k++) fs.rmSync(piece(k)); fs.rmSync(list);
  }
  console.log('done');
}
