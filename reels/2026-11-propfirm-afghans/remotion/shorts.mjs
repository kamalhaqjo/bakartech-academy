// Renders the six vertical Shorts / Reels (1080x1920) of the prop-firm special from the finished YouTube file (public/main.mp4, copied by
// tools/finish.sh), each clip one stretch of shots, then re-encodes them to standard TV-range BT.709 (like tools/finish.sh)
// -> ../out/propfirm_short1..6_1080x1920.mp4.  usage: node shorts.mjs [--only 3]   (REMOTION_BROWSER=<chrome path> for a local Chromium)
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), args = process.argv.slice(2), only = args.includes('--only') ? Number(args[args.indexOf('--only') + 1]) : null;
const data = JSON.parse(fs.readFileSync(path.join(HERE, 'src', 'shots.json'), 'utf8')), F = id => data.shots.find(s => s.id === id).from;
export const CLIPS = [
  ['P14', 'P19', 'افغان‌ها از پراپ‌فرم برداشت می‌گیرند؟', 'بخش ۲'],
  ['P21', 'P24', '⛔ این کار را نکن: آدرس جعلی', 'هشدار بخش ۲'],
  ['P26', 'P32', '۵ معیار انتخاب پراپ‌فرم', 'بخش ۳'],
  ['P47', 'P50', 'برداشت با تتر: این اشتباه پولت را گم می‌کند', 'شبکه اشتباه'],
  ['P50', 'P56', '۴ دام پراپ‌فرم', 'بخش ۶'],
  ['P56', 'P62', 'استراتژی قبولی من در آزمون', 'بخش ۷'],
];
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.join(HERE, 'src', 'index.jsx'), publicDir: path.join(HERE, 'public') });
fs.mkdirSync(path.join(HERE, '..', 'out'), { recursive: true });
for (const [k, [a, b, title, sub]] of CLIPS.entries()) {
  if (only && only !== k + 1) continue;
  const inputProps = { from: Math.round((F(a) + 0.15) * 1000) / 1000, to: Math.round((F(b) - 0.15) * 1000) / 1000, title, sub };
  const comp = await selectComposition({ serveUrl, id: 'Short', inputProps, browserExecutable }), tmp = path.join(HERE, 'out', `short${k + 1}.tmp.mp4`), out = path.join(HERE, '..', 'out', `propfirm_short${k + 1}_1080x1920.mp4`);
  let last = -1;
  await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 18, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k', concurrency: Number(args[args.indexOf('--concurrency') + 1]) || 3, browserExecutable, inputProps, outputLocation: tmp,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p >= last + 20) { last = p; console.log(`short ${k + 1} ${p}%`); } } });
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-vf', 'scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high', '-level:v', '4.2', '-r', '30', '-g', '60', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', out], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('encoding short ' + (k + 1) + ' failed');
  fs.rmSync(tmp); console.log(`short ${k + 1}: ${out} (${(inputProps.to - inputProps.from).toFixed(1)} s + end card)`);
}
