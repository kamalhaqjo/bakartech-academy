// New pieces for lesson 15 (choosing a safe broker, the scam signs), on top of the lesson 13 kit and the lesson 14 platform kit:
// Coin, Vault, Building, Certificate, Magnifier, Phone, Bubble, Shatter, GiftBox, Chains, Stopwatch, ClockArc, CountryMap, ProfileMock, ChannelBar,
// RedAlert (the warning mode of the scam section). All pure functions of the shot time t; nothing carries a real company's name or logo.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FA, NUM, clamp, ease, prog, pop, glass } from './kit.jsx';
import MAP from './map15.json';

export const center = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
export const txt = (size, weight = 700, color = C.ink, extra = {}) => ({ fontFamily: FA, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', ...extra });
export const num = (size, color = C.ink, weight = 600) => ({ fontFamily: NUM, fontWeight: weight, fontSize: size, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });
const GOLD = 'linear-gradient(135deg,#FFF1B0 0%,#E8C96A 35%,#D4AF37 65%,#8B6B1E 100%)';

// a gold coin (dollar sign), the money of the lesson
export const Coin = ({ x, y, s = 1, o = 1, rot = 0 }) => <div style={{ position: 'absolute', left: x - 48 * s, top: y - 48 * s, width: 96 * s, height: 96 * s, borderRadius: '50%', background: GOLD, border: `${4 * s}px solid #8B6B1E`,
  boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.5), inset 0 0 ${12 * s}px rgba(255,255,255,0.5)`, ...center, ...num(52 * s, '#5A400A', 800), opacity: o, transform: `rotate(${rot}deg)` }}>$</div>;
// a vault: steel door, gold edge, a dial that turns; `open` swings the door, `crack` draws red fractures, `glow` lights it green
export function Vault({ x, y, w = 360, label, tone = C.gold, open = 0, crack = 0, glow = 0, t = 0, children }) {
  const h = w * 1.02;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h + 70 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 28, background: 'linear-gradient(160deg,#2C3342,#141924)', border: `4px solid ${tone}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * glow}px ${C.green}` }}>
      <div style={{ position: 'absolute', inset: 24, borderRadius: 18, background: '#0B0F17', overflow: 'hidden' }}>{children}</div>
      <div style={{ position: 'absolute', inset: 24, borderRadius: 18, background: 'linear-gradient(150deg,#3A4253,#1C2230)', border: '3px solid #4A5366', transformOrigin: '0% 50%', transform: `perspective(1400px) rotateY(${-78 * open}deg)`, ...center }}>
        <svg width={w * 0.5} height={w * 0.5} viewBox="0 0 200 200"><circle cx={100} cy={100} r={84} fill="#232A38" stroke={C.gold2} strokeWidth={6} />
          <g transform={`rotate(${t * 40} 100 100)`}>{Array.from({ length: 12 }, (_, i) => <line key={i} x1={100} y1={26} x2={100} y2={40} stroke="#C9CED8" strokeWidth={4} transform={`rotate(${i * 30} 100 100)`} />)}
            {[0, 120, 240].map(a => <line key={a} x1={100} y1={100} x2={100} y2={44} stroke={C.gold2} strokeWidth={10} strokeLinecap="round" transform={`rotate(${a} 100 100)`} />)}</g>
          <circle cx={100} cy={100} r={18} fill={C.gold} /></svg>
      </div>
      {crack > 0 && <svg style={{ position: 'absolute', left: 0, top: 0 }} width={w} height={h} viewBox="0 0 360 367"><path d="M40 20 L120 120 L90 190 L170 250 L150 340 M120 120 L210 150 L260 90 M170 250 L280 280 L330 350" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - crack)} style={{ filter: 'drop-shadow(0 0 8px rgba(230,50,18,0.8))' }} /></svg>}
    </div>
    {label && <div style={{ position: 'absolute', left: 0, right: 0, top: h + 16, textAlign: 'center', ...txt(40, 900, tone === C.gold ? C.gold2 : tone) }}>{label}</div>}
  </div>;
}
// an unbranded broker building: a pediment, four columns, the money door
export const Building = ({ x, y, s = 1, tone = C.gold2, o = 1, label = null, q = 0 }) => <div style={{ position: 'absolute', left: x, top: y, width: 300 * s, height: 330 * s, opacity: o }}>
  <svg width={300 * s} height={300 * s} viewBox="0 0 300 300"><path d="M20 90 L150 20 L280 90 Z" fill="rgba(212,175,55,0.15)" stroke={tone} strokeWidth={6} strokeLinejoin="round" />
    <rect x={30} y={96} width={240} height={16} fill={tone} opacity={0.8} />{[55, 115, 175, 235].map(cx => <rect key={cx} x={cx - 12} y={120} width={24} height={130} rx={4} fill="rgba(237,230,214,0.12)" stroke={tone} strokeWidth={3} />)}
    <rect x={20} y={256} width={260} height={22} rx={4} fill={tone} opacity={0.8} /></svg>
  {q > 0 && <div style={{ position: 'absolute', left: 0, right: 0, top: 40 * s, textAlign: 'center', ...txt(110 * s, 900, C.gold2), opacity: q }}>؟</div>}
  {label && <div style={{ position: 'absolute', left: 0, right: 0, top: 296 * s, textAlign: 'center', ...txt(34 * s, 900, C.ink) }}>{label}</div>}
</div>;
// the licence: a cream certificate with a seal; `stamp` presses the gold wax seal, the number line is typed
export function Certificate({ x, y, w = 620, t, stamp = 1e9, num: n = 'FSA-0000', check = null }) {
  const k = prog(t, stamp, 0.35), h = w * 0.72;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, background: 'linear-gradient(180deg,#F7F0DE,#E9DFC6)', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', border: '10px double #B8963E', direction: 'rtl' }}>
    <div style={{ textAlign: 'center', marginTop: 34, ...txt(w * 0.075, 900, '#5A400A') }}>مجوز فعالیت</div>
    <div style={{ margin: '18px auto 0', width: '70%', height: 4, background: '#B8963E', opacity: 0.6 }} />
    {[0.8, 0.66, 0.74].map((f, i) => <div key={i} style={{ margin: '22px auto 0', width: `${70 * f}%`, height: 10, borderRadius: 5, background: '#6B5A3A', opacity: 0.25 }} />)}
    <div style={{ position: 'absolute', right: 50, bottom: 46, display: 'flex', gap: 14, alignItems: 'center' }}><span style={txt(w * 0.045, 700, '#5A400A')}>شماره:</span>
      <span style={{ ...num(w * 0.05, '#1C2541', 700), direction: 'ltr', padding: '2px 12px', borderRadius: 8, background: check ? `rgba(212,175,55,${0.35 * check})` : 'transparent' }}>{n}</span></div>
    <div style={{ position: 'absolute', left: 46, bottom: 30, width: 150, height: 150, transform: `scale(${2.2 - 1.2 * k}) rotate(${-14 * k}deg)`, opacity: clamp(k * 2) }}>
      <svg width={150} height={150} viewBox="0 0 150 150"><path d="M75 6 C95 14 120 10 132 30 C148 50 140 72 144 90 C140 112 122 126 104 136 C84 146 62 146 44 138 C24 128 8 110 8 88 C6 66 4 44 20 28 C34 12 56 4 75 6 Z" fill="#B3261E" />
        <circle cx={75} cy={75} r={46} fill="none" stroke="#7E120C" strokeWidth={5} /><path d="M52 76 L68 92 L100 58" fill="none" stroke="#F3D9A0" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg></div>
  </div>;
}
// a gold magnifier; the lens shows a 1.8x copy of what is under it when given children
export const Magnifier = ({ x, y, r = 110, o = 1, rot = -35 }) => <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: o, pointerEvents: 'none' }}>
  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${r * 0.12}px solid ${C.gold2}`, background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0.04) 60%)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
  <div style={{ position: 'absolute', left: r - r * 0.13, top: r * 1.9, width: r * 0.26, height: r * 1.1, borderRadius: r * 0.13, background: GOLD, transformOrigin: `${r * 0.13}px ${-r * 0.9}px`, transform: `rotate(${rot}deg)` }} />
</div>;
// a phone (frame, notch, screen); the screen content is the children
export const Phone = ({ x, y, w = 420, h = 820, o = 1, children, tilt = 0 }) => <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 56, background: '#0A0D13', border: '10px solid #2A3040', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', opacity: o, transform: `rotate(${tilt}deg)`, overflow: 'hidden' }}>
  <div style={{ position: 'absolute', inset: 0, borderRadius: 44, overflow: 'hidden' }}>{children}</div>
  <div style={{ position: 'absolute', left: '50%', top: 14, width: 120, height: 30, marginLeft: -60, borderRadius: 15, background: '#000' }} />
</div>;
// a chat bubble; `side` 'in' (left, grey) or 'out' (right, gold); typing dots before it lands
export function Bubble({ t, at, text, side = 'in', tone = null, w = 560, size = 34, typing = 0.8 }) {
  const k = pop(t, at), ty = t > at - typing && t < at, col = tone || (side === 'out' ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.08)');
  return <div style={{ display: 'flex', justifyContent: side === 'out' ? 'flex-end' : 'flex-start', margin: '14px 0', direction: 'ltr' }}>
    {ty && <div style={{ padding: '18px 26px', borderRadius: 26, background: 'rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.mute, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i)) }} />)}</div>}
    {t >= at && <div style={{ maxWidth: w, padding: '16px 26px 20px', borderRadius: side === 'out' ? '26px 26px 6px 26px' : '26px 26px 26px 6px', background: col, border: `2px solid ${tone ? tone : side === 'out' ? C.gold : 'rgba(255,255,255,0.12)'}`,
      ...txt(size, 700, C.ink, { whiteSpace: 'normal', lineHeight: 1.45 }), direction: 'rtl', opacity: k, transform: `translateY(${(1 - k) * 16}px) scale(${0.94 + 0.06 * k})`, transformOrigin: side === 'out' ? '100% 100%' : '0% 100%' }}>{text}</div>}
  </div>;
}
// glass shatter: the children are cut into shards that fly apart after `at`
const SHARDS = [[[0, 0], [45, 0], [30, 40], [0, 30]], [[45, 0], [100, 0], [100, 25], [60, 45], [30, 40]], [[0, 30], [30, 40], [20, 100], [0, 100]], [[30, 40], [60, 45], [70, 100], [20, 100]], [[60, 45], [100, 25], [100, 70], [75, 70]], [[75, 70], [100, 70], [100, 100], [70, 100]], [[60, 45], [75, 70], [70, 100]]];
export function Shatter({ t, at, w, h, children, x = 0, y = 0 }) {
  const k = clamp((t - at) / 0.9);
  if (k <= 0) return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>{children}</div>;
  return <>{SHARDS.map((pts, i) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length - 50, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length - 50, e = ease(k);
    return <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, clipPath: `polygon(${pts.map(p => `${p[0]}% ${p[1]}%`).join(',')})`, opacity: 1 - k,
      transform: `translate(${cx * 6 * e}px, ${cy * 5 * e + 220 * k * k}px) rotate(${(i % 2 ? 1 : -1) * 28 * e}deg)` }}>{children}</div>; })}
    {k < 0.4 && <svg style={{ position: 'absolute', left: x, top: y }} width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M45 0 L30 40 L0 30 M30 40 L60 45 L100 25 M60 45 L75 70 L100 70 M75 70 L70 100 M30 40 L20 100" fill="none" stroke="#fff" strokeWidth={0.6} opacity={1 - k * 2.5} /></svg>}</>;
}
// a gift box (the bonus): the lid lifts on `open`, gold chains spill out and wrap the coin
export function GiftBox({ x, y, t, open = 1e9, chains = 1e9, label = 'بونس ۲۰۰٪' }) {
  const lid = prog(t, open, 0.8), ch = prog(t, chains, 1.2);
  return <div style={{ position: 'absolute', left: x, top: y, width: 420, height: 420 }}>
    <svg style={{ position: 'absolute', left: -200, top: -220 }} width={820} height={700} viewBox="-200 -220 820 700">
      {[0, 1, 2].map(i => { const d = `M210 ${170 - 10 * i} C ${120 - 90 * i} ${40 - 30 * i}, ${-60 - 40 * i} ${120 + 40 * i}, ${-120 + 20 * i} ${300 - 30 * i}`, dr = `M210 ${170 - 10 * i} C ${300 + 90 * i} ${40 - 30 * i}, ${480 + 40 * i} ${120 + 40 * i}, ${540 - 20 * i} ${300 - 30 * i}`;
        return <g key={i}><path d={d} fill="none" stroke="#9AA1AE" strokeWidth={16} strokeDasharray="26 12" strokeDashoffset={0} pathLength={1000} style={{ strokeDasharray: `${1000 * ch} 1000` }} strokeLinecap="round" />
          <path d={dr} fill="none" stroke="#9AA1AE" strokeWidth={16} pathLength={1000} style={{ strokeDasharray: `${1000 * ch} 1000` }} strokeLinecap="round" /></g>; })}
    </svg>
    <div style={{ position: 'absolute', left: 30, top: 170, width: 360, height: 240, borderRadius: 18, background: 'linear-gradient(160deg,#B3261E,#7E120C)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
      <div style={{ position: 'absolute', left: 160, top: 0, width: 40, height: 240, background: GOLD }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', ...txt(44, 900, '#FFF1D0'), textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{label}</div></div>
    <div style={{ position: 'absolute', left: 10, top: 120, width: 400, height: 70, borderRadius: 14, background: 'linear-gradient(160deg,#C9332A,#8E1A12)', transformOrigin: '0% 100%', transform: `translate(${-30 * lid}px, ${-60 * lid}px) rotate(${-16 * lid}deg)`, boxShadow: '0 16px 40px rgba(0,0,0,0.45)' }}>
      <div style={{ position: 'absolute', left: 180, top: 0, width: 40, height: 70, background: GOLD }} /></div>
  </div>;
}
// a stopwatch: the hand sweeps `secs` seconds over the shot time, the readout shows them
export const Stopwatch = ({ x, y, r = 150, t, at = 0, secs = 0.05, dur = 0.6, tone = C.green, label }) => { const k = clamp((t - at) / dur), a = 360 * k * Math.min(1, secs / 1.2);
  return <div style={{ position: 'absolute', left: x - r, top: y - r - 40, width: r * 2, height: r * 2 + 120 }}>
    <svg width={r * 2} height={r * 2 + 40} viewBox="-150 -190 300 340"><rect x={-24} y={-186} width={48} height={30} rx={8} fill={C.gold2} /><circle cx={0} cy={0} r={142} fill="#141924" stroke={tone} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-118} x2={0} y2={-132} stroke="#7D8592" strokeWidth={5} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-112} stroke={tone} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} /><circle cx={0} cy={0} r={12} fill={tone} /></svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: r * 2 + 30, textAlign: 'center', ...num(46, tone, 700) }}>{(secs * k).toFixed(secs < 1 ? 2 : 0)}<span style={txt(30, 700, C.mute)}> ثانیه</span></div>
    {label && <div style={{ position: 'absolute', left: 0, right: 0, top: r * 2 + 90, textAlign: 'center', ...txt(36, 900, C.ink) }}>{label}</div>}
  </div>; };
// a 24-hour day ring: the gold working-hours arc (from 9 to 21) is drawn on `at`, a sun / moon mark at each end
export function DayRing({ x, y, r = 210, t, at = 0, h0 = 9, h1 = 21 }) {
  const k = prog(t, at, 1.6), A = h => h / 24 * 360, rad = d => (d - 90) * Math.PI / 180, P = (d, rr) => [rr * Math.cos(rad(d)), rr * Math.sin(rad(d))];
  const a0 = A(h0), a1 = a0 + (A(h1) - a0) * k, [x0, y0] = P(a0, 168), [x1, y1] = P(a1, 168), [hx, hy] = P(a1, 120);
  return <svg style={{ position: 'absolute', left: x - r, top: y - r }} width={r * 2} height={r * 2} viewBox="-210 -210 420 420">
    <circle cx={0} cy={0} r={200} fill="#141924" stroke="rgba(232,201,106,0.45)" strokeWidth={4} />
    <circle cx={0} cy={0} r={168} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={26} />
    {k > 0.01 && <path d={`M ${x0.toFixed(1)} ${y0.toFixed(1)} A 168 168 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke={C.gold2} strokeWidth={26} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 12px rgba(232,201,106,0.6))' }} />}
    {Array.from({ length: 24 }, (_, i) => { const [a, b] = P(A(i), 196), [c, d] = P(A(i), i % 6 ? 186 : 178); return <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#7D8592" strokeWidth={i % 6 ? 2 : 4} />; })}
    {[0, 6, 12, 18].map(h => { const [a, b] = P(A(h), 128); return <text key={h} x={a} y={b} textAnchor="middle" dominantBaseline="central" style={num(26, '#7D8592', 700)}>{h}</text>; })}
    <line x1={0} y1={0} x2={hx} y2={hy} stroke={C.gold2} strokeWidth={8} strokeLinecap="round" /><circle cx={0} cy={0} r={12} fill={C.gold2} />
    <text x={0} y={52} textAnchor="middle" style={num(40, C.ink, 700)}>{`${String(Math.floor(h0 + (h1 - h0) * k)).padStart(2, '0')}:00`}</text>
  </svg>;
}
// Afghanistan and Iran (Natural Earth outlines): drawn in gold on `at`, then filled; Afghanistan on the right is read first
export function CountryMap({ x, y, w = 1000, t, at = 0, fillAt = null, labels = true }) {
  const k = prog(t, at, 1.8), f = prog(t, fillAt != null ? fillAt : at + 1.4, 0.8), h = w * MAP.h / MAP.w;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
    <svg width={w} height={h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ overflow: 'visible' }}>
      {['irn', 'afg'].map((c, i) => <path key={c} d={MAP[c]} fill={`rgba(212,175,55,${0.22 * f})`} stroke={C.gold2} strokeWidth={3.5} strokeLinejoin="round" pathLength={1000} style={{ strokeDasharray: `${1000 * clamp(k * 1.15 - i * 0.15)} 1000`, filter: 'drop-shadow(0 0 10px rgba(232,201,106,0.45))' }} />)}
    </svg>
    {labels && <><div style={{ position: 'absolute', left: w * 0.74, top: h * 0.42, transform: 'translate(-50%,-50%)', ...txt(w * 0.05, 900, C.ink), opacity: f }}>افغانستان</div>
      <div style={{ position: 'absolute', left: w * 0.36, top: h * 0.5, transform: 'translate(-50%,-50%)', ...txt(w * 0.05, 900, C.ink), opacity: f }}>ایران</div></>}
  </div>;
}
// a social profile page in the phone (no network's name or logo): photo, handle, the highlights row with the «بروکر» circle ringed in gold
export function ProfileMock({ t, ring = 1e9, tap = 1e9 }) {
  const r = prog(t, ring, 0.6), hl = ['دوره', 'بروکر', 'نتایج', 'سؤال'];
  return <div style={{ position: 'absolute', inset: 0, background: '#0F131C', direction: 'rtl', padding: '70px 26px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, padding: 5, background: GOLD }}><Img src={staticFile('kamal.jpg')} style={{ width: 110, height: 110, borderRadius: 55, objectFit: 'cover' }} /></div>
      <div style={{ display: 'flex', gap: 22 }}>{['پست', 'دنبال‌کننده', 'دنبال‌شده'].map(b => <div key={b} style={{ textAlign: 'center' }}><div style={{ width: 56, height: 22, margin: '0 auto 8px', borderRadius: 6, background: 'rgba(237,230,214,0.25)' }} /><div style={txt(18, 500, C.mute)}>{b}</div></div>)}</div></div>
    <div style={{ marginTop: 18, ...num(28, C.ink, 700), direction: 'ltr', textAlign: 'right' }}>@kamalhaqjo</div>
    <div style={{ marginTop: 6, ...txt(22, 500, C.mute) }}>مربی و تحلیل‌گر بازارهای مالی · Bakartech</div>
    <div style={{ marginTop: 26, display: 'flex', gap: 20 }}>{hl.map((s, i) => { const on = i === 1, sc = on ? 1 + 0.12 * r - 0.08 * Math.exp(-((t - tap) ** 2) / 0.01) : 1;
      return <div key={s} style={{ textAlign: 'center', transform: `scale(${sc})` }}>
        <div style={{ width: 82, height: 82, borderRadius: 41, border: `${on ? 3 + 3 * r : 3}px solid ${on ? C.gold2 : '#3A4050'}`, boxShadow: on ? `0 0 ${30 * r}px rgba(232,201,106,0.8)` : 'none', background: '#1A1F2B', ...center, ...txt(30, 900, on ? C.gold2 : C.mute) }}>{['🎓', '🏦', '📈', '❓'][i]}</div>
        <div style={{ marginTop: 8, ...txt(20, on ? 900 : 500, on ? C.gold2 : C.mute) }}>{s}</div></div>; })}</div>
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 112, background: i % 2 ? '#1A1F2B' : '#151A24' }} />)}</div>
  </div>;
}
// the owner's own Instagram page (his screenshot, public/ig_profile.jpg) in the phone, the highlights row under it in the app's light style;
// the «بروکر» circle gets a gold ring on `ring` and a tap ripple on `tap`
export function IgProfile({ t, ring = 1e9, tap = 1e9, w = 540 }) {
  const r = prog(t, ring, 0.6), hl = ['آکادمی', 'بروکر', 'نتایج', 'سؤالات', 'جدید'], ic = ['🎓', '🏦', '📈', '❓', '+'], d = 84, gap = (w - 5 * d) / 6, rp = clamp((t - tap) / 0.6);
  return <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
    <Img src={staticFile('ig_profile.jpg')} style={{ position: 'absolute', left: 0, top: 34, width: w }} />
    <div style={{ position: 'absolute', left: 0, top: 34 + w * 919 / 1320 + 10, width: w, display: 'flex', gap, padding: `0 ${gap}px`, direction: 'ltr' }}>{hl.map((s, i) => { const on = i === 1, sc = on ? 1 + 0.1 * r - 0.08 * Math.exp(-((t - tap) ** 2) / 0.01) : 1;
      return <div key={s} style={{ width: d, textAlign: 'center', transform: `scale(${sc})`, position: 'relative' }}>
        <div style={{ width: d, height: d, borderRadius: d / 2, border: `${on ? 3 + 4 * r : 2}px solid ${on && r > 0 ? C.gold : '#DBDBDB'}`, boxShadow: on ? `0 0 ${34 * r}px rgba(212,175,55,0.9)` : 'none', background: '#F4F4F4', ...center, fontSize: i === 4 ? 40 : 34, color: '#262626' }}>{ic[i]}</div>
        <div style={{ marginTop: 6, ...txt(18, on ? 900 : 500, '#262626') }}>{s}</div>
        {on && rp > 0 && rp < 1 && <div style={{ position: 'absolute', left: d / 2 - 60 * rp, top: d / 2 - 60 * rp, width: 120 * rp, height: 120 * rp, borderRadius: '50%', border: `4px solid ${C.gold}`, opacity: 1 - rp }} />}</div>; })}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 34 + w * 919 / 1320 + 140, height: 2, background: '#EFEFEF' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 34 + w * 919 / 1320 + 150, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 170, background: i % 2 ? '#E9E9E9' : '#F1F1F1' }} />)}</div>
  </div>;
}
// under the owner's YouTube channel (his screenshot): like, «دنبال کردن» and the bell, each on its word
export function ChannelButtons({ t, like = 1e9, sub = 1e9, bell = 1e9, y = 760 }) {
  const lk = t > like, sb = t > sub, bl = t > bell, ring = bl ? Math.sin((t - bell) * 26) * 18 * Math.exp(-(t - bell) * 2.2) : 0, pulse = at => 1 + 0.15 * Math.exp(-((t - at - 0.15) ** 2) / 0.02);
  const round = (on, at, k, kids) => <div style={{ width: 104, height: 104, borderRadius: 52, background: on ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.06)', border: `3px solid ${on ? C.gold2 : 'rgba(255,255,255,0.2)'}`, ...center, transform: `scale(${pulse(at)})`, opacity: k }}>{kids}</div>;
  return <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36, direction: 'rtl' }}>
    {round(lk, like, pop(t, like - 0.5), <svg width={56} height={56} viewBox="0 0 120 120"><path d="M20 55 L42 55 L42 105 L20 105 Z M48 105 L48 55 L68 18 C76 18 82 26 80 36 L76 52 L102 52 C110 52 114 60 112 68 L104 98 C102 104 97 106 92 106 Z" fill={lk ? C.gold2 : 'none'} stroke={C.gold2} strokeWidth={7} strokeLinejoin="round" /></svg>)}
    <div style={{ height: 104, padding: '0 46px', borderRadius: 52, background: sb ? 'rgba(255,255,255,0.08)' : C.gold, border: `3px solid ${C.gold2}`, ...center, ...txt(42, 900, sb ? C.gold2 : '#1C1404'), transform: `scale(${pulse(sub)})`, opacity: pop(t, sub - 0.6) }}>{sb ? 'دنبال می‌کنی ✓' : 'دنبال کردن'}</div>
    {round(bl, bell, pop(t, bell - 0.5), <svg width={58} height={58} viewBox="0 0 100 100" style={{ transform: `rotate(${ring}deg)` }}><path d="M50 12 C32 12 24 26 24 42 L24 62 L14 76 L86 76 L76 62 L76 42 C76 26 68 12 50 12 Z" fill={bl ? C.gold2 : 'none'} stroke={C.gold2} strokeWidth={6} strokeLinejoin="round" /><circle cx={50} cy={86} r={8} fill={C.gold2} /></svg>)}
  </div>;
}
// the scam section's warning mode: a red tint and a slow red pulse at the frame edge
export const RedAlert = ({ k = 1, s = 0 }) => k > 0 ? <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: k,
  background: `radial-gradient(ellipse at 50% 45%, rgba(230,50,18,0) 45%, rgba(230,50,18,${0.16 + 0.08 * Math.sin(s * 2.4)}) 100%)`, boxShadow: `inset 0 0 ${120 + 40 * Math.sin(s * 2.4)}px rgba(230,50,18,0.35)` }} /> : null;
