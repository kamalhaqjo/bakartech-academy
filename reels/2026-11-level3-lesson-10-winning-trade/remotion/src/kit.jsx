// Reusable pieces for the Bakartech lesson renders (DIRECTOR.md, section 2): colours, easing, the glass card, kinetic titles, stamps, checklists,
// counters, the balance scale, the realistic chart shots (clips from tools/chart), hand-writing, the desk calendar, the brand outro, SFX cues.
// Every piece is a pure function of the shot's local time t (seconds from the shot's cut), so any frame renders on its own.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Img, OffthreadVideo, spring, staticFile, useCurrentFrame } from 'remotion';

export const FPS = 30;
export const C = { bg: '#0D1117', gold: '#D4AF37', gold2: '#E8C96A', red: '#E63212', green: '#26A69A', ink: '#EDE6D6', mute: 'rgba(237,230,214,0.55)', blue: '#5B8DEF' };
export const FA = "'Vazirmatn', sans-serif", NUM = "'Inter', 'Vazirmatn', sans-serif";
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };   // easeInOutCubic
export const prog = (t, t0, d = 0.6) => ease((t - t0) / d);
export const pop = (t, t0) => spring({ frame: Math.round((t - t0) * FPS), fps: FPS, config: { damping: 200, mass: 0.7, stiffness: 120 } });   // high damping: no wobble
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
export const faNum = fa;

// the shot's local time: the Sequence starts `lead` seconds before the cut (cross-fade), so t = 0 sits on the cut
export const ShotCtx = createContext({ lead: 0, dur: 1, shot: null });
export const useT = () => { const f = useCurrentFrame(); const { lead } = useContext(ShotCtx); return f / FPS - lead; };
export const useShot = () => useContext(ShotCtx);

export const glass = (tone = C.gold) => ({
  background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',
  border: `1.5px solid ${tone === C.gold ? 'rgba(232,201,106,0.55)' : tone}`, borderRadius: 28,
  boxShadow: '0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)'
});
const center = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

// a frosted-glass card that settles in (spring, from slightly below and smaller)
export function GlassCard({ at = 0, x, y, w, h, tone = C.gold, children, style = {} }) {
  const t = useT(), k = pop(t, at);
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...glass(tone), ...center, flexDirection: 'column', direction: 'rtl',
    opacity: k, transform: `translateY(${(1 - k) * 28}px) scale(${0.94 + 0.06 * k})`, ...style }}>{children}</div>;
}
// the card text that heads most shots (<= 5 words), top centre
export function Headline({ text, at = 0.15, tone = C.gold, y = 118 }) {
  const t = useT(), k = pop(t, at);
  return <div style={{ position: 'absolute', top: y, left: 0, right: 0, ...center, opacity: k, transform: `translateY(${(1 - k) * -18}px)` }}>
    <div style={{ ...glass(tone), padding: '18px 46px 22px', fontFamily: FA, fontWeight: 900, fontSize: 52, color: tone === C.gold ? C.gold2 : tone, direction: 'rtl', whiteSpace: 'nowrap' }}>{text}</div>
  </div>;
}
// cinematic title: each word rises out of a soft blur, the gold line gets an underline drawn from the right
export function KineticTitle({ lines }) {
  const t = useT();
  return <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 34, direction: 'rtl' }}>
    {lines.map((l, i) => {
      const words = l.text.split(' '), later = lines[i + 1] && t > lines[i + 1].at ? 0.45 + 0.55 * (1 - prog(t, lines[i + 1].at, 0.5)) : 1;
      return <div key={i} style={{ position: 'relative', opacity: later }}>
        <div style={{ display: 'flex', gap: 26, fontFamily: FA, fontWeight: 900, fontSize: l.size || (l.gold ? 132 : 104), color: l.gold ? C.gold2 : C.ink, whiteSpace: 'nowrap',
          textShadow: l.gold ? '0 0 50px rgba(212,175,55,0.35)' : '0 8px 30px rgba(0,0,0,0.5)' }}>
          {words.map((w, j) => { const k = prog(t, l.at + j * 0.09, 0.55); return <span key={j} style={{ opacity: k, transform: `translateY(${(1 - k) * 46}px)`, filter: `blur(${(1 - k) * 10}px)`, display: 'inline-block' }}>{w}</span>; })}
        </div>
        {l.gold && <div style={{ position: 'absolute', right: 0, bottom: -18, height: 7, borderRadius: 4, background: `linear-gradient(270deg, ${C.gold2}, ${C.gold})`, width: `${100 * prog(t, l.at + 0.35, 0.8)}%` }} />}
      </div>;
    })}
  </AbsoluteFill>;
}
// rubber stamp: comes down from above, slightly turned, settles with a short press
export function StampLabel({ text, tone = C.green, at = 0, x = 960, y = 520, size = 92, rot = -8 }) {
  const t = useT(), k = pop(t, at), press = t > at ? Math.exp(-((t - at - 0.28) ** 2) / 0.004) * 0.05 : 0;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.3 - 1.3 * k - press})`, opacity: clamp(k * 1.4),
    border: `7px double ${tone}`, borderRadius: 22, padding: '10px 44px 16px', fontFamily: FA, fontWeight: 900, fontSize: size, color: tone, direction: 'rtl', whiteSpace: 'nowrap',
    background: 'rgba(13,17,23,0.55)', textShadow: `0 0 26px ${tone}55` }}>{text}</div>;
}
// checklist rows that tick at their word times
export function ChecklistTick({ items, x, y, w, row = 86, size = 40 }) {
  const t = useT();
  return <div style={{ position: 'absolute', left: x, top: y, width: w, direction: 'rtl' }}>
    {items.map((it, i) => {
      const k = pop(t, it.at - 0.6), on = prog(t, it.at, 0.35);
      return <div key={i} style={{ height: row, display: 'flex', alignItems: 'center', gap: 26, opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
        <svg width={56} height={56} viewBox="0 0 56 56"><rect x={3} y={3} width={50} height={50} rx={14} fill={on > 0.5 ? C.green : 'rgba(255,255,255,0.06)'} stroke={on > 0.5 ? C.green : 'rgba(232,201,106,0.6)'} strokeWidth={3} />
          <path d="M15 29 L25 39 L42 18" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={44} strokeDashoffset={44 * (1 - on)} /></svg>
        <span style={{ fontFamily: FA, fontWeight: 700, fontSize: size, color: on > 0.5 ? C.ink : C.mute, whiteSpace: 'nowrap' }}>{it.text}</span>
      </div>;
    })}
  </div>;
}
// a number that counts up (Inter digits)
export function Counter({ to, at = 0, dur = 1.6, suffix = '', style = {} }) {
  const t = useT(), v = Math.round(to * prog(t, at, dur));
  return <span style={{ fontFamily: NUM, fontWeight: 600, fontVariantNumeric: 'tabular-nums', ...style }}>{v}{suffix}</span>;
}
// the golden balance scale: 'unknown' (sways, a question on each pan) or 'ratio' (1 risk against 2 reward, tilts to the reward)
export function ScaleBalance({ variant, x = 960, y = 560 }) {
  const t = useT(), { dur } = useShot();
  const ang = variant === 'ratio' ? -11 * prog(t, 1.0, 1.4) : variant === 'level' ? 1.2 * Math.sin(t * 1.4) * (1 - prog(t, 0.6, 1.2)) : 9 * Math.sin(t * 2.1) * (1 - 0.35 * clamp(t / dur));
  const rad = ang * Math.PI / 180, arm = 330;
  const pan = s => ({ x: s * arm * Math.cos(rad), y: s * arm * Math.sin(rad) });
  const R = pan(1), Lp = pan(-1);
  const weights = (n, col, lab) => <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={-34 - (n - 1) * 38 + i * 76} y={-70} width={68} height={58} rx={10} fill={col} opacity={0.92} />)}
    <text x={0} y={-90} textAnchor="middle" fontFamily={FA} fontWeight={900} fontSize={42} fill={col}>{lab}</text></g>;
  const q = <text x={0} y={-34} textAnchor="middle" fontFamily={FA} fontWeight={900} fontSize={86} fill={C.gold2}>؟</text>;
  return <svg style={{ position: 'absolute', left: x - 520, top: y - 330 }} width={1040} height={660} viewBox="-520 -330 1040 660">
    <defs><linearGradient id="gd" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.gold2} /><stop offset="1" stopColor={C.gold} /></linearGradient></defs>
    <rect x={-10} y={-200} width={20} height={430} rx={8} fill="url(#gd)" /><rect x={-150} y={226} width={300} height={22} rx={11} fill="url(#gd)" />
    <circle cx={0} cy={-200} r={22} fill="url(#gd)" />
    <line x1={Lp.x} y1={Lp.y - 200} x2={R.x} y2={R.y - 200} stroke="url(#gd)" strokeWidth={14} strokeLinecap="round" />
    {[[R, 1], [Lp, -1]].map(([p, s], i) => <g key={i} transform={`translate(${p.x},${p.y - 200})`}>
      <line x1={0} y1={0} x2={-110} y2={190} stroke={C.gold} strokeWidth={3} /><line x1={0} y1={0} x2={110} y2={190} stroke={C.gold} strokeWidth={3} />
      <path d="M-150 190 Q0 260 150 190 Z" fill="rgba(212,175,55,0.22)" stroke={C.gold2} strokeWidth={4} />
      <g transform="translate(0,190)">{variant === 'ratio' ? (s === 1 ? weights(2, C.green, 'سود ۲') : weights(1, C.red, 'ریسک ۱')) : variant === 'level' ? (s === 1 ? <g><circle cx={0} cy={-46} r={40} fill="url(#gd)" stroke="#8B6B1E" strokeWidth={4} /><text x={0} y={-32} textAnchor="middle" fontFamily={NUM} fontWeight={600} fontSize={40} fill="#5A400A">$</text></g> : <text x={0} y={-30} textAnchor="middle" fontFamily={FA} fontWeight={900} fontSize={84} fill={C.green}>۰</text>) : q}</g>
    </g>)}
  </svg>;
}
// a realistic chart shot from the lesson's chart engine (tools/chart), cut to this slot so it stays on the narration
export function PremiumChart({ clip }) {
  const { lead } = useShot();
  return <AbsoluteFill><OffthreadVideo src={staticFile(clip.file)} startFrom={Math.max(0, Math.round((clip.start - lead) * FPS))} muted style={{ width: '100%', height: '100%' }} /></AbsoluteFill>;
}
// hand-writing: the Persian line appears right to left behind a pen nib
export function HandWrite({ text, at = 0, dur = 1.6, x, y, w, size = 64, color = '#1C2541' }) {
  const t = useT(), p = prog(t, at, dur);
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: size * 1.6 }}>
    <div style={{ position: 'absolute', inset: 0, direction: 'rtl', fontFamily: FA, fontWeight: 500, fontSize: size, color, whiteSpace: 'nowrap', clipPath: `inset(0 0 0 ${100 - 100 * p}%)` }}>{text}</div>
    {p > 0 && p < 1 && <svg style={{ position: 'absolute', left: `${100 - 100 * p}%`, top: -size * 0.9, transform: 'translateX(-14px)' }} width={60} height={size * 2} viewBox="0 0 60 120">
      <path d="M8 110 L22 70 L52 6 L58 10 L30 74 Z" fill="#2B2F3A" /><path d="M8 110 L22 70 L30 74 Z" fill={C.gold} /></svg>}
  </div>;
}
// desk calendar: the top page flips over to the new day
export function CalendarFlip({ from, to, at = 0.6, x = 760, y = 300 }) {
  const t = useT(), p = prog(t, at, 0.9);
  const page = (d, z) => <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: 'linear-gradient(180deg,#F4EBDA,#E8DCC2)', ...center, flexDirection: 'column', zIndex: z, direction: 'rtl' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 92, borderRadius: '26px 26px 0 0', background: C.red, ...center, fontFamily: FA, fontWeight: 900, fontSize: 46, color: '#fff' }}>{d.top}</div>
    <div style={{ fontFamily: NUM, fontWeight: 600, fontSize: 170, color: '#1C2541', marginTop: 60 }}>{d.num}</div>
    <div style={{ fontFamily: FA, fontWeight: 700, fontSize: 48, color: '#1C2541' }}>{d.day}</div></div>;
  return <div style={{ position: 'absolute', left: x, top: y, width: 400, height: 440, perspective: 1600 }}>
    {page(to, 1)}
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${-180 * p}deg)`, backfaceVisibility: 'hidden', zIndex: 2, opacity: p > 0.98 ? 0 : 1 }}>{page(from, 2)}</div>
    {[90, 200, 310].map(cx => <div key={cx} style={{ position: 'absolute', left: cx - 10, top: -22, width: 20, height: 52, borderRadius: 10, background: '#9AA3B2', zIndex: 3 }} />)}
  </div>;
}
// the brand end: photo in the gold circle, the ring drawn, name and Bakartech
export function BrandOutro({ course = 'دوره صفر تا پرایس اکشن', badge = null }) {
  const t = useT(), ring = prog(t, 0.2, 1.4), k1 = pop(t, 0.5), k2 = pop(t, 1.1), k3 = pop(t, 1.7);
  return <AbsoluteFill style={{ ...center, flexDirection: 'column', direction: 'rtl', paddingBottom: 190 }}>
    <div style={{ position: 'relative', width: 360, height: 360, opacity: pop(t, 0.1), transform: `scale(${0.9 + 0.1 * pop(t, 0.1)})` }}>
      <Img src={staticFile('kamal.jpg')} style={{ position: 'absolute', left: 22, top: 22, width: 316, height: 316, borderRadius: '50%', objectFit: 'cover' }} />
      <svg style={{ position: 'absolute', inset: 0 }} width={360} height={360} viewBox="0 0 360 360"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE48A" /><stop offset=".55" stopColor={C.gold} /><stop offset="1" stopColor="#B8860B" /></linearGradient></defs>
        <circle cx={180} cy={180} r={168} fill="none" stroke="url(#rg)" strokeWidth={10} strokeDasharray={1056} strokeDashoffset={1056 * (1 - ring)} transform="rotate(-90 180 180)" strokeLinecap="round" /></svg>
    </div>
    <div style={{ marginTop: 34, fontFamily: FA, fontWeight: 900, fontSize: 70, color: C.ink, opacity: k1, transform: `translateY(${(1 - k1) * 20}px)` }}>کمال حقجو</div>
    <div style={{ marginTop: 6, fontFamily: FA, fontWeight: 500, fontSize: 38, color: C.mute, opacity: k2 }}>مربی و تحلیل‌گر بازارهای مالی</div>
    {badge && <div style={{ marginTop: 22, padding: '4px 22px 8px', borderRadius: 14, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', fontFamily: FA, fontWeight: 900, fontSize: 30, color: '#1b1203', opacity: k2 }}>{badge}</div>}
    <div style={{ marginTop: 18, fontFamily: NUM, fontWeight: 600, fontSize: 64, letterSpacing: 1, color: C.gold2, opacity: k3, transform: `translateY(${(1 - k3) * 16}px)` }}>Bakartech</div>
    <div style={{ marginTop: 4, fontFamily: FA, fontWeight: 500, fontSize: 32, color: C.mute, opacity: k3 }}>{course}</div>
  </AbsoluteFill>;
}
// sound cues are mixed offline (remotion/audio/timing/timeline.json -> tools/sound.py: ducked under the voice, peak-guarded); this marker only documents a cue
export const SfxCue = () => null;

// ---- layers that stay on through the whole lesson ----
const rnd = s => { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
const R0 = rnd(1313), DUST = Array.from({ length: 70 }, () => ({ x: R0() * 1920, y: R0() * 1080, r: 0.8 + R0() * 2.4, v: 6 + R0() * 18, a: 0.15 + R0() * 0.45, ph: R0() * 6.28 }));
export function Backdrop() {
  const f = useCurrentFrame(), s = f / FPS;
  return <AbsoluteFill style={{ background: `radial-gradient(1100px 700px at 30% 35%, rgba(212,175,55,0.10), rgba(13,17,23,0) 70%), radial-gradient(900px 600px at 80% 80%, rgba(38,166,154,0.07), rgba(13,17,23,0) 70%), ${C.bg}` }}>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
      {Array.from({ length: 25 }, (_, i) => <line key={'v' + i} x1={i * 80} y1={0} x2={i * 80} y2={1080} stroke="rgba(232,201,106,0.05)" />)}
      {Array.from({ length: 14 }, (_, i) => <line key={'h' + i} x1={0} y1={i * 80} x2={1920} y2={i * 80} stroke="rgba(232,201,106,0.05)" />)}
      {DUST.map((d, i) => <circle key={i} cx={(d.x + Math.sin(s * 0.3 + d.ph) * 30) % 1920} cy={(d.y - s * d.v + 1080 * 4) % 1080} r={d.r} fill={C.gold2} opacity={d.a * (0.6 + 0.4 * Math.sin(s + d.ph))} />)}
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>;
}
export function BrandLayer({ hideMark, badge = null, mark = 'Bakartech' }) {
  const f = useCurrentFrame(), s = f / FPS, glint = Math.exp(-(((s % 10) - 1.2) ** 2) / 0.05);
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <Img src={staticFile('kamal_logo.png')} style={{ position: 'absolute', left: 34, top: 18, height: 150, filter: `drop-shadow(0 6px 16px rgba(0,0,0,0.55)) brightness(${1 + 0.35 * glint})`, opacity: clamp(s / 0.8) }} />
    {badge && <div style={{ position: 'absolute', left: 190, top: 66, padding: '4px 18px 8px', borderRadius: 14, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', fontFamily: FA, fontWeight: 900, fontSize: 26, color: '#1b1203', direction: 'rtl', boxShadow: '0 6px 16px rgba(0,0,0,0.45)', opacity: clamp((s - 0.3) / 0.8) }}>{badge}</div>}
    {!hideMark && <div style={{ position: 'absolute', left: 40, bottom: 26, fontFamily: NUM, fontWeight: 600, fontSize: 28, color: 'rgba(237,230,214,0.6)', letterSpacing: 0.5 }}>{mark}</div>}
  </AbsoluteFill>;
}
// word-synced subtitles in a glass pill (the spoken word turns gold)
export function Subtitles({ lines }) {
  const s = useCurrentFrame() / FPS;
  const l = lines.find(x => s >= x.start - 0.05 && s <= x.end + 0.25);
  if (!l) return null;
  const k = clamp((s - l.start + 0.05) / 0.15) * clamp((l.end + 0.25 - s) / 0.15);
  return <div style={{ position: 'absolute', left: 0, right: 0, top: 880, ...center, opacity: k }}>
    <div style={{ background: 'rgba(13,17,23,0.78)', border: '1.5px solid rgba(255,255,255,0.14)', borderRadius: 24, padding: '10px 34px 14px', direction: 'rtl', display: 'flex', gap: 16,
      fontFamily: FA, fontWeight: 700, fontSize: 50, whiteSpace: 'nowrap', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}>
      {l.words.map((w, i) => <span key={i} style={{ color: s >= w.s ? C.gold2 : C.ink }}>{w.t}</span>)}
    </div>
  </div>;
}
export const fontCss = `
@font-face{font-family:'Vazirmatn';font-weight:400;src:url(${staticFile('fonts/vazirmatn-arabic-400-normal.woff2')}) format('woff2');unicode-range:U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC}
@font-face{font-family:'Vazirmatn';font-weight:500;src:url(${staticFile('fonts/vazirmatn-arabic-400-normal.woff2')}) format('woff2');unicode-range:U+0600-06FF,U+200C-200E,U+FB50-FDFF,U+FE80-FEFC}
@font-face{font-family:'Vazirmatn';font-weight:700;src:url(${staticFile('fonts/vazirmatn-arabic-700-normal.woff2')}) format('woff2');unicode-range:U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC}
@font-face{font-family:'Vazirmatn';font-weight:900;src:url(${staticFile('fonts/vazirmatn-arabic-900-normal.woff2')}) format('woff2');unicode-range:U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC}
@font-face{font-family:'Vazirmatn';font-weight:400 500;src:url(${staticFile('fonts/vazirmatn-latin-400-normal.woff2')}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:'Vazirmatn';font-weight:700;src:url(${staticFile('fonts/vazirmatn-latin-700-normal.woff2')}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:'Vazirmatn';font-weight:900;src:url(${staticFile('fonts/vazirmatn-latin-900-normal.woff2')}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:'Inter';font-weight:400;src:url(${staticFile('fonts/inter-latin-Regular.woff2')}) format('woff2')}
@font-face{font-family:'Inter';font-weight:500;src:url(${staticFile('fonts/inter-latin-Medium.woff2')}) format('woff2')}
@font-face{font-family:'Inter';font-weight:600 900;src:url(${staticFile('fonts/inter-latin-SemiBold.woff2')}) format('woff2')}
`;
