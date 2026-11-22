// A vertical Short / Reel (1080x1920) cut from the finished special: the hook title on top, the 16:9 video in the middle (cropped above its
// own small subtitles), the narration as large word-synced subtitles under it, the KH logo and @kamalhaqjo, and a 2.5 s end card
// («ویدیوی کامل در یوتیوب»). public/main.mp4 is the finished YouTube file; its sound (voice, music, effects) plays with the clip.
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import data from './shots.json';
import { C, FA, NUM, FPS, clamp, pop, prog, fontCss } from './kit.jsx';

export const END = 2.5, CROP = 870;                    // the end card; the frame rows kept from the top of the 1920x1080 picture
const W = 1080, VH = Math.round(CROP * W / 1920);
const txt = (size, w = 900, color = C.ink) => ({ fontFamily: FA, fontWeight: w, fontSize: size, color, direction: 'rtl' });
function Subs({ s }) {
  const line = data.lines.find(l => s >= l.start - 0.05 && s < l.end + 0.15); if (!line) return null;
  const k = clamp((s - line.start + 0.05) / 0.15);
  return <div style={{ position: 'absolute', left: 60, right: 60, top: 1270, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', opacity: k, ...txt(66, 900), lineHeight: 1.45, textShadow: '0 4px 18px rgba(0,0,0,0.8)' }}>
    {line.words.map((w, i) => <span key={i} style={{ color: s >= w.s - 0.02 ? (s < w.e + 0.1 ? C.gold2 : C.ink) : 'rgba(237,230,214,0.45)' }}>{w.t}</span>)}</div>;
}
export const Short = ({ from, to, title, sub = null }) => {
  const f = useCurrentFrame(), t = f / FPS, s = from + t, dur = to - from, end = t > dur, k = pop(t, 0.1);
  return <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a2030 0%, #0D1117 60%, #07090d 100%)' }}>
    <style>{fontCss}</style>
    {!end && <>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
        <div style={{ ...txt(30, 900, '#1b1203'), padding: '6px 26px 10px', borderRadius: 16, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)' }}>پراپ‌فرم برای افغان‌ها</div>
        <div style={{ ...txt(title.length > 26 ? 66 : 76, 900, C.ink), textAlign: 'center', lineHeight: 1.35, textShadow: '0 6px 24px rgba(0,0,0,0.7)' }}>{title}</div>
        {sub && <div style={{ ...txt(38, 800, C.gold2), textAlign: 'center' }}>{sub}</div>}</div>
      <div style={{ position: 'absolute', left: 0, top: 700, width: W, height: VH, overflow: 'hidden', borderTop: `3px solid ${C.gold}`, borderBottom: `3px solid ${C.gold}`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <OffthreadVideo src={staticFile('main.mp4')} startFrom={Math.round(from * FPS)} endAt={Math.round(to * FPS)} style={{ width: W, height: W * 1080 / 1920 }} /></div>
      <Subs s={s} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1700, height: 10, background: 'rgba(255,255,255,0.08)' }}><div style={{ width: `${100 * clamp(t / dur)}%`, height: '100%', background: C.gold2 }} /></div>
    </>}
    {end && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, opacity: clamp((t - dur) / 0.3) }}>
      <Img src={staticFile('kamal_logo.png')} style={{ height: 300 }} />
      <div style={{ ...txt(64, 900, C.ink), textAlign: 'center', lineHeight: 1.4 }}>ویدیوی کامل در یوتیوب</div>
      <div style={{ fontFamily: NUM, fontWeight: 800, fontSize: 60, color: C.gold2 }}>Bakartech · @kamalhaqjo</div></AbsoluteFill>}
    <Img src={staticFile('kamal_logo.png')} style={{ position: 'absolute', left: 40, top: 60, height: 130, opacity: end ? 0 : 1 }} />
    <div style={{ position: 'absolute', right: 50, top: 100, fontFamily: NUM, fontWeight: 800, fontSize: 40, color: 'rgba(237,230,214,0.8)', opacity: end ? 0 : 1 }}>@kamalhaqjo</div>
  </AbsoluteFill>;
};
