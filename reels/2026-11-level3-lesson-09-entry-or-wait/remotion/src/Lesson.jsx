// Level 3, lesson 9 assembled from DIRECTOR.md: one Sequence per shot (0.3 s cross-fades centred on the cuts, a slow, even camera move and float inside each shot),
// the backdrop, the seven-steps bar over the checklist, the owner's logo with the «سطح ۳» badge and
// Bakartech mark, word-synced subtitles and the mixed sound (narration + score + SFX library cues).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import data from './shots.json';
import * as SC from './scenes.jsx';
import { FPS, C, ShotCtx, Backdrop, BrandLayer, Subtitles, fontCss, clamp, ease, prog } from './kit.jsx';
import { StepProgress } from './kit14.jsx';

const X = 0.15;                                     // half of the cross-fade
function ShotFrame({ shot, lead, children }) {
  // the camera moves at an even speed (an eased move stood still at both ends of the long shots: freezedetect found 3-6 s holds) and floats
  // a few pixels on a slow figure-of-eight in absolute time, so both shots of a cross-fade float together and no stretch is ever still
  const t = useCurrentFrame() / FPS - lead, dur = shot.to - shot.from, p = clamp(t / dur), a = shot.from + t;
  const fin = lead === 0 ? 1 : clamp((t + X) / (2 * X)), fout = shot.to >= data.duration - 0.01 ? 1 : clamp((dur + X - t) / (2 * X));
  const fl = `translate(${(7 * Math.sin(2 * Math.PI * a / 9)).toFixed(2)}px, ${(5 * Math.sin(2 * Math.PI * a / 6.5 + 1.3)).toFixed(2)}px) `;
  const cam = shot.cam === 'push' ? `scale(${1 + 0.045 * p})` : shot.cam === 'pan' ? `translateX(${34 - 68 * p}px) scale(1.035)` : `translateY(${14 - 28 * p}px) scale(${1.02 + 0.025 * p})`;
  return <AbsoluteFill style={{ opacity: Math.min(fin, fout), transform: fl + cam }}>{children}</AbsoluteFill>;
}
const STEPS = ['جهت', 'ناحیه', 'نقدینگی', 'زمان', 'تأیید', 'خبر', 'سود به ضرر'];
// a bar shown over a run of shots: `field` is the shot field holding the current item (1..n), the line grows into each new item
function Bar({ s, cur, field, labels, tone }) {
  const on = data.shots.filter(x => x[field] > 0); if (!on.length) return null;
  const t0 = on[0].from, t1 = on[on.length - 1].to; if (s < t0 - X || s > t1 + 0.5) return null;
  const n = labels.length, step = cur && cur[field] ? cur[field] : s < t0 ? 1 : n, first = data.shots.find(x => x[field] === step).from;
  const k = prog(s, t0, 0.6) * (1 - prog(s, t1 - 0.2, 0.5)), fill = step === 1 ? 0 : (step - 2 + prog(s, first + 0.1, 0.8)) / (n - 1);
  return <StepProgress step={step} fill={fill} y={14} scale={1} opacity={k} band labels={labels} tone={tone} />;
}
export const Lesson = ({ audio = true }) => {
  const s = useCurrentFrame() / FPS, cur = data.shots.find(x => s >= x.from && s < x.to);
  return <AbsoluteFill style={{ background: '#0D1117' }}>
    <style>{fontCss}</style>
    <Backdrop />
    {data.shots.map((shot, i) => {
      const lead = i === 0 ? 0 : X, last = i === data.shots.length - 1, Comp = SC[shot.comp];
      return <Sequence key={shot.id} name={shot.id} from={Math.round((shot.from - lead) * FPS)} durationInFrames={Math.round((shot.to - shot.from + lead + (last ? 0 : X)) * FPS)}>
        <ShotCtx.Provider value={{ lead, dur: shot.to - shot.from, shot }}><ShotFrame shot={shot} lead={lead}><Comp shot={shot} /></ShotFrame></ShotCtx.Provider>
      </Sequence>;
    })}
    <Bar s={s} cur={cur} field="step" labels={STEPS} tone={C.gold} />
    <BrandLayer hideMark={!!cur && cur.type === 'brand'} badge={cur && cur.type === 'brand' ? null : 'سطح ۳'} />
    <Subtitles lines={data.lines} />
    {audio && <Audio src={staticFile('mix.wav')} />}
  </AbsoluteFill>;
};
