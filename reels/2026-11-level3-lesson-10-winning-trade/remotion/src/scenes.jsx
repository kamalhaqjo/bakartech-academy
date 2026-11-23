// One component per shot of DIRECTOR.md (level 3, lesson 10: the anatomy of one winning trade on gold; its components are at the end
// of this file, after the helpers and the components of the lessons before).
// Each reads its shot (text, events in seconds from the cut) and the local time t; content stays in y 100-840 (the logo and «سطح ۳» badge
// top left, the subtitles at the bottom). The seven steps: a ticked step is green, a failing one red, the current row gold; the order block
// gold, liquidity purple, the cheap half green. Example symbol XAUUSD (gold), every chart and sketch tagged «مثال فرضی». Time runs left to
// right everywhere. Helpers above the lesson block come from the earlier lessons.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FA, NUM, clamp, ease, prog, pop, useT, glass, Headline, StampLabel, ChecklistTick, BrandOutro, faNum } from './kit.jsx';
import { ChannelButtons, Building, Coin, Phone, Bubble, RedAlert } from './kit15.jsx';
import MAP from './map15.json';
import { L2, TFC, center, txt, sv, nv, makeCandles, Platform, StructChart, Zig, Ico } from './kitL2.jsx';

const rtl = { direction: 'rtl' };
const H = ({ shot, i = 0, at = 0.15, tone }) => shot.text[i] ? <Headline text={shot.text[i]} at={at} tone={tone} y={132} /> : null;
const ev = (shot, k, d) => (shot.ev[k] ?? d);
const Chip = ({ text, k = 1, x = null, y, size = 44, tone = C.gold, color = C.gold2, icon = null }) => <div style={{ position: 'absolute', top: y, ...(x == null ? { left: 0, right: 0, ...center } : { left: x }), opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
  <div style={{ ...glass(tone), padding: '12px 36px 16px', display: 'flex', alignItems: 'center', gap: 18, ...txt(size, 900, color), ...rtl }}>{icon}{text}</div></div>;
const Card = ({ x, y, w, h, k = 1, tone = C.gold, children, style = {} }) => <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...glass(tone), opacity: k, transform: `translateY(${(1 - k) * 24}px)`, ...style }}>{children}</div>;
const firstClose = (cs, from, price, dir) => { for (let i = from; i < cs.length; i++) if (cs[i] && (dir > 0 ? cs[i].c > price : cs[i].c < price)) return i; return cs.length - 1; };
const mapXY = (view, w, h) => { const [a, b, lo, hi] = view, PW = w - 110; return [i => 20 + (i - a + 0.5) * PW / (b - a + 1), p => 20 + (hi - p) / (hi - lo) * (h - 40), PW / (b - a + 1)]; };
const SVG = ({ children, style = {} }) => <svg style={{ position: 'absolute', inset: 0, ...style }} width={1920} height={1080}>{children}</svg>;
// sketch candle (frame pixels): [x, open, close, high, low]; the wick grows with the body
const SkC = ({ c, w = 34, k = 1 }) => { const [x, o, cl, hi, lo] = c, up = cl < o, col = up ? C.green : C.red, g = clamp(k);
  const cc = o + (cl - o) * g, hh = o + (hi - o) * g, ll = o + (lo - o) * g; return g > 0 && <g><line x1={x} x2={x} y1={Math.min(hh, ll, cc)} y2={Math.max(hh, ll, cc, o)} stroke={col} strokeWidth={4} /><rect x={x - w / 2} y={Math.min(o, cc)} width={w} height={Math.max(3, Math.abs(cc - o))} rx={3} fill={col} /></g>; };
// a polyline drawn segment by segment: pts = [[x, y, p], ...]; a segment starts only after the one before it is complete
const Path = ({ pts, w = 6, c = C.ink, o = 1, dash = null }) => { let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const p = pts[i][2] ?? 1; if (p <= 0) break; const [x0, y0] = pts[i - 1], x = x0 + (pts[i][0] - x0) * p, y = y0 + (pts[i][1] - y0) * p; d += ` L ${x} ${y}`; if (p < 1) break; }
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" opacity={o} strokeDasharray={dash || undefined} />; };
const seg = (p, n, i) => clamp(p * n - i);                 // the i-th of n equal parts of a progress p
const GZ = 'rgba(38,166,154,0.20)', OBF = 'rgba(212,175,55,0.15)', LQ = '#B388FF';
// OrderBlockBox: the order block (gold edge, 15% gold fill, «OB» tag); `ext` extends it right, `lock` (0-1) closes the targeting brackets,
// `crack` (0-1) cracks it like glass and splits it
const OBBox = ({ x, y, w, h, k = 1, ext = 0, label = 'OB', lock = 1, crack = 0, glow = 0, below = false }) => { if (k <= 0.01) return null; const W = w + ext, d = (1 - lock) * 70, sp = clamp((crack - 0.55) / 0.45) * 26;
  const br = (cx, cy, sx, sy) => <path d={`M ${cx + sx * d} ${cy + sy * (d + 24)} L ${cx + sx * d} ${cy + sy * d} L ${cx + sx * (d + 24)} ${cy + sy * d}`} fill="none" stroke={C.gold2} strokeWidth={4} strokeLinecap="round" opacity={lock < 1 ? 1 : 0.85} />;
  const lw = label ? (/[a-z]/i.test(label) && label.length < 4 ? label.length * 13 + 20 : label.length * 14 + 26) : 0;
  return <g opacity={k}>
    {glow > 0 && <rect x={x - 6} y={y - 6} width={W + 12} height={h + 12} rx={6} fill="none" stroke={C.gold2} strokeWidth={10} opacity={0.25 * glow} />}
    {crack > 0.55 ? <><g transform={`translate(${-sp} 0)`}><rect x={x} y={y} width={W / 2} height={h} fill={OBF} stroke={C.gold} strokeWidth={2.5} opacity={1 - 0.6 * clamp((crack - 0.55) / 0.45)} /></g>
      <g transform={`translate(${sp} ${sp * 0.6})`}><rect x={x + W / 2} y={y} width={W / 2} height={h} fill={OBF} stroke={C.gold} strokeWidth={2.5} opacity={1 - 0.6 * clamp((crack - 0.55) / 0.45)} /></g></>
      : <rect x={x} y={y} width={W} height={h} fill={OBF} stroke={C.gold} strokeWidth={2.5} />}
    {crack > 0 && <path d={`M ${x + W * 0.5} ${y} L ${x + W * 0.46} ${y + h * 0.3} L ${x + W * 0.55} ${y + h * 0.55} L ${x + W * 0.48} ${y + h} M ${x + W * 0.46} ${y + h * 0.3} L ${x + W * 0.3} ${y + h * 0.45} M ${x + W * 0.55} ${y + h * 0.55} L ${x + W * 0.72} ${y + h * 0.7}`}
      fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray={600} strokeDashoffset={600 * (1 - clamp(crack / 0.55))} opacity={0.9} />}
    {label && <g transform={`translate(${x + 6} ${below ? y + h + 34 : y - 6})`}><rect x={0} y={-28} width={lw} height={30} rx={7} fill={C.gold} />
      <text x={lw / 2} y={-6} textAnchor="middle" direction="rtl" style={sv(19, 900, '#1b1203')}>{label}</text></g>}
    {lock < 1 && <>{br(x, y, -1, -1)}{br(x + W, y, 1, -1)}{br(x, y + h, -1, 1)}{br(x + W, y + h, 1, 1)}</>}
  </g>; };
// LiquidityCluster: purple dots under a low (or above a high); `eat` (0-1) swallows them left to right
const Liq = ({ x, y, w = 220, rows = 2, k = 1, eat = 0, r = 8, n = 9 }) => <g>{Array.from({ length: n * rows }, (_, i) => { const c = i % n, rw = Math.floor(i / n), px = x + c * (w / (n - 1)) + 5 * Math.sin(i * 2.3), py = y + rw * 20 + 4 * Math.cos(i * 1.7), kk = k * (1 - clamp(eat * 1.6 - c / n));
  return kk > 0.01 && <circle key={i} cx={px} cy={py} r={r * (0.8 + 0.25 * Math.sin(i))} fill={LQ} opacity={0.8 * kk} style={{ filter: 'drop-shadow(0 0 6px rgba(179,136,255,0.7))' }} />; })}</g>;
const Cursor = ({ x, y, down = 0, k = 1 }) => <g transform={`translate(${x} ${y}) scale(${1 - 0.12 * down})`} opacity={k}><path d="M 0 0 L 0 36 L 9 27 L 16 42 L 22 39 L 15 25 L 28 25 Z" fill="#fff" stroke="#131722" strokeWidth={2.5} strokeLinejoin="round" /></g>;
const Person = ({ x, y, k = 1, s = 70, c = C.ink }) => k > 0.01 && <div style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}><Ico n="user" s={s} c={c} sw={6} /></div>;
const Arrow = ({ x1, y1, x2, y2, c = C.green, w = 8, p = 1, head = 22 }) => { if (p <= 0) return null; const x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p, a = Math.atan2(y - y1, x - x1);
  return <g stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1={x1} y1={y1} x2={x} y2={y} />{p > 0.3 && <path d={`M ${x - head * Math.cos(a - 0.5)} ${y - head * Math.sin(a - 0.5)} L ${x} ${y} L ${x - head * Math.cos(a + 0.5)} ${y - head * Math.sin(a + 0.5)}`} />}</g>; };
const XMark = ({ x, y, k = 1, r = 40 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}><circle r={r} fill="rgba(13,17,23,0.85)" stroke={C.red} strokeWidth={5} /><path d={`M-${r * 0.42} -${r * 0.42} L${r * 0.42} ${r * 0.42} M${r * 0.42} -${r * 0.42} L-${r * 0.42} ${r * 0.42}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" /></g>;
const Check = ({ x, y, k = 1, r = 34, c = C.green }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}><circle r={r} fill="rgba(13,17,23,0.85)" stroke={c} strokeWidth={5} /><path d={`M ${-r * 0.45} 0 L ${-r * 0.1} ${r * 0.35} L ${r * 0.5} ${-r * 0.35}`} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></g>;
const Star = ({ x, y, r = 46, fill = 0 }) => { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`; }).join(' ');
  return <g><polygon points={pts} fill="rgba(255,255,255,0.04)" stroke={C.gold} strokeWidth={3} /><clipPath id={`st${x}`}><rect x={x - r} y={y + r - 2 * r * fill} width={2 * r} height={2 * r * fill} /></clipPath><polygon points={pts} fill={C.gold2} clipPath={`url(#st${x})`} style={{ filter: fill > 0.99 ? 'drop-shadow(0 0 10px rgba(232,201,106,0.7))' : 'none' }} /></g>; };
const Mag = ({ x, y, r = 120, k = 1, children }) => k > 0.01 && <g opacity={k}><defs><clipPath id={`mg${Math.round(x)}`}><circle cx={x} cy={y} r={r - 6} /></clipPath></defs>
  <circle cx={x} cy={y} r={r} fill="rgba(13,17,23,0.92)" /><g clipPath={`url(#mg${Math.round(x)})`}>{children}</g>
  <circle cx={x} cy={y} r={r} fill="none" stroke={C.gold2} strokeWidth={8} /><line x1={x + r * 0.72} y1={y + r * 0.72} x2={x + r * 1.25} y2={y + r * 1.25} stroke={C.gold} strokeWidth={18} strokeLinecap="round" /></g>;

// FVGBox: the price gap (blue edge, 18% blue fill, «FVG» tag); `ext` extends it right; `mid` (0-1) draws the thin 50% line; `fill` (0-1)
// greys it from the top as price fills it; `dead` turns it grey and dashed (invalid)
const FV = '#4FA3FF', FVF = 'rgba(79,163,255,0.18)';
const FVGBox = ({ x, y, w, h, k = 1, ext = 0, label = 'FVG', mid = 0, fill = 0, dead = 0, glow = 0, below = false }) => { if (k <= 0.01) return null; const W = w + ext, fa = /[؀-ۿ]/.test(label || ''), lw = label ? (fa ? label.length * 14 + 26 : label.length * 13 + 22) : 0;
  return <g opacity={k}>
    {glow > 0 && <rect x={x - 6} y={y - 6} width={W + 12} height={h + 12} rx={6} fill="none" stroke={FV} strokeWidth={10} opacity={0.25 * glow} />}
    <rect x={x} y={y} width={W} height={h} fill={dead > 0.5 ? 'rgba(120,120,130,0.12)' : FVF} stroke={dead > 0.5 ? 'rgba(170,170,180,0.6)' : FV} strokeWidth={2.5} strokeDasharray={dead > 0.5 ? '8 6' : undefined} />
    {fill > 0 && <rect x={x} y={y} width={W} height={h * clamp(fill)} fill="rgba(170,170,180,0.32)" />}
    {mid > 0 && <line x1={x} x2={x + W * clamp(mid)} y1={y + h / 2} y2={y + h / 2} stroke="#fff" strokeWidth={1.6} strokeDasharray="6 5" opacity={0.9} />}
    {label && <g transform={`translate(${x + 6} ${below ? y + h + 34 : y - 6})`}><rect x={0} y={-28} width={lw} height={30} rx={7} fill={dead > 0.5 ? '#8A8A94' : FV} />
      <text x={lw / 2} y={-6} textAnchor="middle" direction={fa ? 'rtl' : 'ltr'} style={fa ? sv(19, 900, '#0D1117') : nv(19, '#0D1117', 800)}>{label}</text></g>}
  </g>; };
const Magnet = ({ x, y, s = 1, k = 1, r = 0 }) => k > 0.01 && <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={k}>
  <path d="M -50 -60 L -50 10 A 50 50 0 0 0 50 10 L 50 -60 L 20 -60 L 20 10 A 20 20 0 0 1 -20 10 L -20 -60 Z" fill={C.red} stroke="#7A1A0A" strokeWidth={3} />
  <rect x={-50} y={-78} width={30} height={20} fill="#D9D9D9" /><rect x={20} y={-78} width={30} height={20} fill="#D9D9D9" /></g>;
const Scale = ({ x, y, tilt = 0, k = 1, lw = 0, rw = 0 }) => { const a = tilt * Math.PI / 180, L = 230, lx = x - L * Math.cos(a), ly = y - L * Math.sin(a), rx = x + L * Math.cos(a), ry = y + L * Math.sin(a);
  const pan = (px, py, n, col) => <g><line x1={px} y1={py} x2={px - 70} y2={py + 110} stroke={C.gold} strokeWidth={3} /><line x1={px} y1={py} x2={px + 70} y2={py + 110} stroke={C.gold} strokeWidth={3} />
    <path d={`M ${px - 90} ${py + 110} Q ${px} ${py + 170} ${px + 90} ${py + 110} Z`} fill="rgba(212,175,55,0.2)" stroke={C.gold} strokeWidth={4} />
    {Array.from({ length: n }, (_, i) => <rect key={i} x={px - 60 + (i % 4) * 32} y={py + 80 - Math.floor(i / 4) * 26} width={26} height={22} rx={4} fill={col} />)}</g>;
  return <g opacity={k}><line x1={x} y1={y - 10} x2={x} y2={y + 300} stroke={C.gold} strokeWidth={8} /><path d={`M ${x - 90} ${y + 300} L ${x + 90} ${y + 300}`} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />
    <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.gold2} strokeWidth={8} strokeLinecap="round" /><circle cx={x} cy={y} r={14} fill={C.gold2} />{pan(rx, ry, rw, C.green)}{pan(lx, ly, lw, C.red)}</g>; };

// ---- lesson 7: the premium (expensive, red) and discount (cheap, green) halves of a range, the 50% equilibrium (white dashed) and the
// optimal trade entry band (OTE, gold, 62-79% of the pull-back) ----
const PRF = 'rgba(230,50,18,0.15)', DSF = 'rgba(38,166,154,0.17)', OTEF = 'rgba(232,201,106,0.24)';
// PDBox: a range split at 50%; zp / zd colour the premium / discount halves, eq draws the equilibrium line, ote the gold band
// (bull: 62-79% down from the high; bear: 62-79% up from the low)
const PDBox = ({ x, y, w, h, k = 1, eq = 1, zones = 1, zp = null, zd = null, ote = 0, tags = 1, bear = false, pct = 1, tagSize = 34, oteGlow = 0 }) => { if (k <= 0.01) return null;
  const a = bear ? 0.21 : 0.62, P = zp ?? zones, D = zd ?? zones;
  return <g opacity={k}>
    <rect x={x} y={y} width={w} height={h / 2} fill={PRF} opacity={P} /><rect x={x} y={y + h / 2} width={w} height={h / 2} fill={DSF} opacity={D} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="rgba(237,230,214,0.35)" strokeWidth={2} />
    {ote > 0 && <g opacity={clamp(ote)}>{oteGlow > 0 && <rect x={x - 5} y={y + a * h - 5} width={w + 10} height={0.17 * h + 10} fill="none" stroke={C.gold2} strokeWidth={9} opacity={0.3 * oteGlow} />}
      <rect x={x} y={y + a * h} width={w} height={0.17 * h} fill={OTEF} stroke={C.gold2} strokeWidth={2.5} strokeDasharray="7 5" />
      <text x={x - 12} y={y + (a + 0.085) * h + 9} textAnchor="end" style={nv(24, C.gold2, 800)}>OTE</text></g>}
    {eq > 0 && <line x1={x} x2={x + w * clamp(eq)} y1={y + h / 2} y2={y + h / 2} stroke="#fff" strokeWidth={2.5} strokeDasharray="10 7" />}
    {pct > 0 && <text x={x + w + 14} y={y + h / 2 + 9} style={nv(26, '#fff', 800)} opacity={pct * clamp(eq * 3 - 2)}>۵۰٪</text>}
    {tags > 0 && <><text x={x + w - 16} y={y + tagSize + 12} textAnchor="start" direction="rtl" style={sv(tagSize, 900, C.red)} opacity={P * tags}>گران</text>
      <text x={x + w - 16} y={y + h - 16} textAnchor="start" direction="rtl" style={sv(tagSize, 900, C.green)} opacity={D * tags}>ارزان</text></>}
  </g>; };
const Tag = ({ x, y, text, col, k = 1, r = -8 }) => k > 0.01 && <g opacity={k} transform={`translate(${x} ${y}) rotate(${r}) scale(${0.7 + 0.3 * k})`}>
  <path d="M -86 -40 L 46 -40 L 86 0 L 46 40 L -86 40 Z" fill={col} stroke="rgba(0,0,0,0.35)" strokeWidth={3} /><circle cx={54} cy={0} r={8} fill="#0D1117" />
  <text x={-20} y={15} textAnchor="middle" style={nv(42, '#fff', 800)}>{text}</text></g>;
const Btn = ({ x, y, w = 220, text, col, on = 1, k = 1, lock = 0 }) => k > 0.01 && <g opacity={k} transform={`translate(${x} ${y})`}>
  <rect x={-w / 2} y={-38} width={w} height={76} rx={18} fill={on > 0.5 ? col : 'rgba(255,255,255,0.08)'} stroke={on > 0.5 ? col : 'rgba(255,255,255,0.25)'} strokeWidth={2.5} />
  <text y={13} textAnchor="middle" direction="rtl" style={sv(36, 900, on > 0.5 ? '#fff' : C.mute)}>{text}</text>
  {lock > 0.01 && <g opacity={lock} transform={`translate(${w / 2 - 6} -34)`}><circle r={18} fill="#0D1117" stroke={C.mute} strokeWidth={3} /><path d="M -7 -2 L -7 -8 A 7 7 0 0 1 7 -8 L 7 -2 M -10 -2 L 10 -2 L 10 10 L -10 10 Z" fill="none" stroke={C.mute} strokeWidth={3} /></g>}</g>;
const Ring = ({ x, y, at, t, c = C.gold2, r0 = 16, dr = 50, d = 1.0 }) => { const q = clamp((t - at) / d); return t > at && q < 1 && <circle cx={x} cy={y} r={r0 + dr * q} fill="none" stroke={c} strokeWidth={3} opacity={1 - q} />; };
const Spark = ({ x, y, s = 1, k = 1 }) => k > 0.01 && <path transform={`translate(${x} ${y}) scale(${s * k})`} d="M 0 -26 L 6 -6 L 26 0 L 6 6 L 0 26 L -6 6 L -26 0 L -6 -6 Z" fill={C.gold2} opacity={k} />;
const badge = { padding: '8px 28px 12px', display: 'inline-block', borderRadius: 18, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...txt(36, 900, '#1b1203') };

// ---- lesson 8: the sessions (Asia moon, London sunrise, New York skyline), the New York hour axis (7:00-13:00) with the golden time
// 8:30-11:00 as a gold band, clocks, news (a newspaper) and the stock open (a bell) ----
const KZ = 'rgba(232,201,106,0.22)';
const hm = (h, m = 0) => `${faNum(h)}:${m ? faNum(m) : '۰۰'}`;
const LTR = ({ children, style = {} }) => <span style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', ...style }}>{children}</span>;
const Moon = ({ x, y, s = 1, c = '#B8C4FF', k = 1 }) => k > 0.01 && <path transform={`translate(${x} ${y}) scale(${s})`} d="M 10 -26 A 26 26 0 1 0 26 10 A 20 20 0 1 1 10 -26 Z" fill={c} opacity={k} />;
const SunR = ({ x, y, s = 1, c = '#FFB547', k = 1 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}><path d="M -24 8 A 24 24 0 0 1 24 8 Z" fill={c} />{[-60, -30, 0, 30, 60].map(a => <line key={a} x1={30 * Math.sin(a * Math.PI / 180)} y1={8 - 30 * Math.cos(a * Math.PI / 180)} x2={40 * Math.sin(a * Math.PI / 180)} y2={8 - 40 * Math.cos(a * Math.PI / 180)} stroke={c} strokeWidth={4} strokeLinecap="round" />)}<line x1={-34} x2={34} y1={10} y2={10} stroke={c} strokeWidth={4} /></g>;
const Sky = ({ x, y, s = 1, c = C.gold2, k = 1 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k} fill={c}><rect x={-30} y={-10} width={14} height={34} /><rect x={-14} y={-30} width={14} height={54} /><rect x={2} y={-18} width={12} height={42} /><rect x={16} y={-4} width={14} height={28} /><rect x={-6} y={-40} width={2} height={10} /></g>;
// the session bar: Asia | London | New York left to right; on = [a, l, n] lights each part
const SESS = [['آسیا', 0, 0.38, Moon], ['لندن', 0.38, 0.68, SunR], ['نیویورک', 0.68, 1, Sky]];
const Sess = ({ x = 260, y = 150, w = 1400, h = 70, on = [0, 0, 0], k = 1, icons = true }) => k > 0.01 && <g opacity={k}>{SESS.map(([lab, a, b, Ic], i) => { const o = on[i];
  return <g key={i}><rect x={x + a * w + 4} y={y} width={(b - a) * w - 8} height={h} rx={14} fill={o > 0.5 ? 'rgba(232,201,106,0.22)' : 'rgba(255,255,255,0.05)'} stroke={o > 0.5 ? C.gold2 : 'rgba(255,255,255,0.18)'} strokeWidth={o > 0.5 ? 3 : 2} />
    {icons && <Ic x={x + (b - 0.05) * w - 40} y={y + h / 2} s={0.6} k={0.4 + 0.6 * o} />}<text x={x + (a + 0.04) * w} y={y + h / 2 + 11} style={sv(30, 900, o > 0.5 ? C.gold2 : C.mute)} direction="rtl" textAnchor="end">{lab}</text></g>; })}</g>;
// a clock face showing h:m
const Clock = ({ x, y, r = 90, h = 8, m = 30, k = 1, c = C.gold2, warn = false }) => { if (k <= 0.01) return null; const am = (m / 60) * 360 - 90, ah = ((h % 12) + m / 60) * 30 - 90, rd = d => d * Math.PI / 180;
  return <g opacity={k} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * k})`}><circle r={r} fill="rgba(13,17,23,0.9)" stroke={warn ? C.red : c} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={(r - 14) * Math.cos(rd(i * 30))} y1={(r - 14) * Math.sin(rd(i * 30))} x2={(r - 4) * Math.cos(rd(i * 30))} y2={(r - 4) * Math.sin(rd(i * 30))} stroke={C.mute} strokeWidth={3} />)}
    <line x1={0} y1={0} x2={r * 0.5 * Math.cos(rd(ah))} y2={r * 0.5 * Math.sin(rd(ah))} stroke={warn ? C.red : c} strokeWidth={8} strokeLinecap="round" />
    <line x1={0} y1={0} x2={r * 0.78 * Math.cos(rd(am))} y2={r * 0.78 * Math.sin(rd(am))} stroke={C.ink} strokeWidth={5} strokeLinecap="round" /><circle r={8} fill={warn ? C.red : c} /></g>; };
// the New York hour axis 7:00-13:00; hx(h) maps an hour to x; the golden band 8:30-11:00
const AX = { x: 300, w: 1320 }, hx = h => AX.x + (h - 7) * AX.w / 6;
const Axis = ({ y = 640, k = 1, band = 0, bandLab = 1, labs = 1 }) => k > 0.01 && <g opacity={k}>
  {band > 0 && <g><rect x={hx(8.5)} y={y - 300} width={(hx(11) - hx(8.5)) * clamp(band)} height={300} fill={KZ} stroke={C.gold2} strokeWidth={2.5} strokeDasharray="8 6" />
    <text x={(hx(8.5) + hx(11)) / 2} y={y - 260} textAnchor="middle" direction="rtl" style={sv(32, 900, C.gold2)} opacity={bandLab * clamp(band * 2 - 1)}>زمان طلایی</text></g>}
  <line x1={AX.x - 30} x2={AX.x + AX.w + 30} y1={y} y2={y} stroke="rgba(237,230,214,0.5)" strokeWidth={3} />
  {Array.from({ length: 7 }, (_, i) => <g key={i}><line x1={hx(7 + i)} x2={hx(7 + i)} y1={y - 10} y2={y + 10} stroke={C.mute} strokeWidth={3} /><text x={hx(7 + i)} y={y + 46} textAnchor="middle" style={nv(26, C.mute, 700)} opacity={labs}>{hm(7 + i)}</text></g>)}
  <text x={AX.x + AX.w + 40} y={y + 10} style={sv(24, 900, C.mute)} direction="rtl" textAnchor="end" opacity={labs}>ساعت نیویورک</text></g>;
const Mark = ({ h, y = 640, lab, k = 1, c = C.gold2, top = 330 }) => k > 0.01 && <g opacity={k}><line x1={hx(h)} x2={hx(h)} y1={y - top} y2={y} stroke={c} strokeWidth={4} strokeDasharray="6 5" />
  <circle cx={hx(h)} cy={y} r={10} fill={c} /><rect x={hx(h) - 62} y={y - top - 52} width={124} height={44} rx={10} fill="rgba(13,17,23,0.9)" stroke={c} strokeWidth={2.5} /><text x={hx(h)} y={y - top - 21} textAnchor="middle" style={nv(28, c, 800)}>{lab}</text></g>;
const Paper = ({ x, y, s = 1, k = 1, flash = 0 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}>{flash > 0 && <circle r={110} fill="rgba(255,255,255,0.12)" opacity={flash} />}
  <rect x={-80} y={-60} width={160} height={120} rx={8} fill="#F6EEDC" /><rect x={-66} y={-46} width={60} height={44} fill="#9AA3B5" />{[-44, -30, -16].map(v => <line key={v} x1={4} x2={66} y1={v} y2={v} stroke="#5A4A1A" strokeWidth={5} />)}{[8, 22, 36].map(v => <line key={v} x1={-66} x2={66} y1={v} y2={v} stroke="#5A4A1A" strokeWidth={4} opacity={0.7} />)}</g>;
const Bell = ({ x, y, s = 1, k = 1, ring = 0 }) => k > 0.01 && <g transform={`translate(${x} ${y}) rotate(${ring * 14 * Math.sin(ring * 30)}) scale(${s})`} opacity={k}>
  <path d="M -50 30 L -40 18 L -40 -14 A 40 40 0 0 1 40 -14 L 40 18 L 50 30 Z" fill={C.gold2} stroke="#7A5A10" strokeWidth={3} /><circle cy={42} r={12} fill={C.gold} /><rect x={-6} y={-66} width={12} height={14} rx={4} fill={C.gold} /></g>;
const Cup = ({ x, y, s = 1, k = 1, t = 0 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}><path d="M -40 -20 L 40 -20 L 32 40 L -32 40 Z" fill="#E9DCC0" stroke="#8A6A3A" strokeWidth={3} />
  <path d="M 38 -6 A 18 18 0 0 1 38 26" fill="none" stroke="#E9DCC0" strokeWidth={8} />{[-16, 0, 16].map((v, i) => <path key={i} d={`M ${v} -30 q 8 -12 0 -24 q -8 -12 0 -24`} fill="none" stroke="rgba(237,230,214,0.6)" strokeWidth={3} transform={`translate(0 ${-6 * Math.sin(t * 2 + i)})`} />)}</g>;
const Laptop = ({ x, y, s = 1, k = 1, lid = 1 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}><rect x={-130} y={40} width={260} height={18} rx={6} fill="#5A6070" />
  <g transform={`translate(0 40) scale(1 ${Math.max(0.04, lid)}) translate(0 -40)`}><rect x={-112} y={-110} width={224} height={150} rx={10} fill="#1A1E29" stroke="#5A6070" strokeWidth={5} /><Path pts={[[-90, 20], [-50, -10], [-20, 0], [20, -50], [50, -30], [90, -80]]} w={4} c={C.green} /></g></g>;
const Cal = ({ x, y, s = 1, k = 1, flip = 0, lab = 'فردا' }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}><rect x={-70} y={-60} width={140} height={130} rx={12} fill="#F6EEDC" /><rect x={-70} y={-60} width={140} height={34} rx={12} fill={C.red} />
  <text y={38} textAnchor="middle" direction="rtl" style={sv(34, 900, '#5A4A1A')} transform={`scale(1 ${Math.abs(Math.cos(flip * Math.PI))})`}>{flip > 0.5 ? lab : 'امروز'}</text></g>;
const Ticket = ({ x, y, lab, col, k = 1, r = 0 }) => k > 0.01 && <g opacity={k} transform={`translate(${x} ${y}) rotate(${r}) scale(${0.7 + 0.3 * k})`}><rect x={-60} y={-24} width={120} height={48} rx={10} fill={col} /><text y={11} textAnchor="middle" direction="rtl" style={sv(26, 900, '#fff')}>{lab}</text></g>;

// ---- lesson 9: the seven-step entry model; the steps (icons, gold numbers) and a checklist that ticks ----
const STEPS = ['جهت بزرگ', 'ناحیه', 'نقدینگی', 'زمان', 'تأیید', 'خبر', 'نسبت سود به ضرر'];
// the step header: «قدم N: title» with its number in a gold circle (top left)
const StepHead = ({ n, t, at = 0.1, sub = null }) => <div style={{ position: 'absolute', left: 260, top: 130, display: 'flex', alignItems: 'center', gap: 18, opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * -30}px)`, ...rtl }}>
  <div style={{ width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...center, ...txt(40, 900, '#1b1203') }}>{faNum(n)}</div>
  <span style={txt(52, 900, C.ink)}>{`قدم ${faNum(n)}: ${STEPS[n - 1]}`}</span>{sub && <span style={txt(34, 700, C.mute)}>{sub}</span>}</div>;
// a checklist panel: rows = labels, on = times each row ticks (1e9 = not yet), hot = current row
const CheckPanel = ({ x, y, w = 520, rows, on, t, k = 1, title = 'چک‌لیست', size = 28, miss = [] }) => k > 0.01 && <div style={{ position: 'absolute', left: x, top: y, width: w, borderRadius: 20, ...glass(C.gold), opacity: k, padding: '18px 26px 20px', ...rtl }}>
  <div style={txt(size + 4, 900, C.gold2)}>{title}</div>
  {rows.map((r, i) => { const d = t > on[i], ms = miss.includes(i); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
    <div style={{ width: size + 6, height: size + 6, borderRadius: 8, border: `3px solid ${ms ? C.red : d ? C.green : C.mute}`, ...center, transform: `scale(${d ? 1 + 0.2 * (1 - pop(t, on[i] + 0.3)) : 1})`, flex: 'none' }}>{d && !ms && <Ico n="check" s={size} c={C.green} sw={12} />}{ms && <Ico n="cross" s={size - 6} c={C.red} sw={12} />}</div>
    <span style={txt(size, 800, ms ? C.red : d ? C.ink : C.mute)}>{`${faNum(i + 1)}. ${r}`}</span></div>; })}</div>;
const Plane = ({ x, y, s = 1, k = 1 }) => k > 0.01 && <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k} fill={C.ink}><path d="M -90 0 L 60 -8 L 90 0 L 60 8 Z" /><path d="M -10 -4 L -40 -60 L -20 -60 L 30 -4 Z" /><path d="M -10 4 L -40 60 L -20 60 L 30 4 Z" /><path d="M -80 -2 L -95 -26 L -84 -26 L -64 -2 Z" /></g>;
const Gear = ({ x, y, r = 80, k = 1, rot = 0, c = C.gold2 }) => { if (k <= 0.01) return null; const n = 10, pts = Array.from({ length: n * 2 }, (_, i) => { const a = (i * Math.PI) / n + rot, rr = i % 2 ? r : r * 1.18; return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`; }).join(' ');
  return <g opacity={k}><polygon points={pts} fill={c} stroke="#7A5A10" strokeWidth={3} /><circle cx={x} cy={y} r={r * 0.4} fill="#0D1117" /></g>; };

// ---- lesson 10: trade management. Prices are drawn in risk units (R): the entry line white dashed, the stop red, break-even gold, the
// first target green dashed, the final target green; ry(r) maps R to a frame y (entry at y 600, 1R = 72 px); the six rules on a bar on top ----
const RULES = ['پلن', 'فرصت', 'سود جزئی', 'سربه‌سر', 'دنبال کردن', 'خروج با دلیل'];
const RULE_T = ['پلن مدیریت را قبل از ورود بنویس', 'به معامله فرصت نفس بده', 'برداشتن بخشی از سود', 'حد ضرر به نقطه سربه‌سر', 'دنبال کردن حد ضرر با ساختار', 'زودتر بیرون آمدن، فقط با دلیل'];
const RuleHead = ({ n, t, at = 0.1 }) => <div style={{ position: 'absolute', left: 260, top: 130, display: 'flex', alignItems: 'center', gap: 18, opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * -30}px)`, ...rtl }}>
  <div style={{ width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...center, ...txt(40, 900, '#1b1203'), flex: 'none' }}>{faNum(n)}</div>
  <span style={txt(46, 900, C.ink)}>{`قانون ${faNum(n)}: ${RULE_T[n - 1]}`}</span></div>;
const RU = 72, E0 = 600, ry = r => E0 - r * RU;
const sgn = v => (v > 0.001 ? '+' : v < -0.001 ? '−' : '');
const fR = v => `${sgn(v)}${faNum(String(Math.round(Math.abs(v) * 10) / 10)).replace('.', '٫')}R`;
const fD = v => <span><LTR>{`${sgn(v)}${faNum(Math.round(Math.abs(v)))}`}</LTR> دلار</span>;
// a level line in R (or at y), drawn from the left; its label to the right of the line end
const Lv = ({ r = 0, y = null, x1 = 300, x2 = 1240, c, lab = null, sub = null, k = 1, dash = null, w = 4, size = 28 }) => { if (k <= 0.01) return null; const yy = y ?? ry(r);
  return <g opacity={clamp(k)}><line x1={x1} x2={x1 + (x2 - x1) * clamp(k)} y1={yy} y2={yy} stroke={c} strokeWidth={w} strokeDasharray={dash || undefined} />
    {lab && <text x={x2 + 18} y={yy + 10} style={sv(size, 900, c)}>{lab}</text>}{sub && <text x={x2 + 18} y={yy + 42} direction="ltr" style={nv(24, c, 800)}>{sub}</text>}</g>; };
// a price path given in R: pts = [[x, r], ...] drawn by progress d (0-1); off = the first segment index (to chain two paths)
const rPts = (pts, d, n = pts.length - 1, off = 0) => pts.map((q, i) => [q[0], ry(q[1]), seg(d, n, i - 1 + off)]);
const Heart = ({ x, y, s = 1, k = 1, c = C.red }) => k > 0.01 && <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 18 C -40 -10 -30 -44 0 -24 C 30 -44 40 -10 0 18 Z" fill={c} opacity={k} />;
const Scissors = ({ x, y, k = 1, open = 0 }) => k > 0.01 && <g transform={`translate(${x} ${y})`} opacity={k} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round">
  <line x1={0} y1={0} x2={60} y2={-14 - 16 * open} /><line x1={0} y1={0} x2={60} y2={14 + 16 * open} /><circle cx={-16} cy={-14} r={12} /><circle cx={-16} cy={14} r={12} /></g>;
const Dice = ({ x, y, s = 1, k = 1, rot = 0, n = 5 }) => { if (k <= 0.01) return null; const P = { 1: [[0, 0]], 3: [[-22, -22], [0, 0], [22, 22]], 5: [[-22, -22], [22, -22], [0, 0], [-22, 22], [22, 22]], 6: [[-22, -24], [22, -24], [-22, 0], [22, 0], [-22, 24], [22, 24]] }[n] || [[0, 0]];
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={k}><rect x={-46} y={-46} width={92} height={92} rx={18} fill="#F6EEDC" stroke="#8A7A5A" strokeWidth={3} />{P.map(([a, b], i) => <circle key={i} cx={a} cy={b} r={8} fill="#1b1203" />)}</g>; };
// the live position card: side, P&L in R and dollars (1R = 10 dollars), status
const PosCard = ({ x, y, v, k = 1, status = 'باز', side = 'خرید · طلا', w = 320 }) => k > 0.01 && <div style={{ position: 'absolute', left: x, top: y, width: w, borderRadius: 20, ...glass(v >= 0 ? C.green : C.red), padding: '16px 24px 20px', opacity: k, transform: `translateY(${(1 - k) * 20}px)`, ...rtl }}>
  <div style={txt(28, 900, C.ink)}>{side}</div>
  <div style={{ fontFamily: NUM, fontWeight: 900, fontSize: 70, color: v >= 0 ? C.green : C.red, direction: 'ltr', textAlign: 'right', marginTop: 6 }}>{fR(v)}</div>
  <div style={{ ...txt(30, 800, v >= 0 ? C.green : C.red), marginTop: 2 }}>{fD(v * 10)}</div>
  <div style={{ ...txt(24, 800, C.mute), marginTop: 8 }}>{status}</div></div>;
const slot = (t, a, b) => pop(t, a) * (b == null ? 1 : 1 - pop(t, b));


// ---- level 3, lesson 9: one complete decision on gold with the seven-step checklist. The checklist panel on the right ticks row by row
// over the step shots (green ✓; red ✗ while a step fails); the bar on top (Lesson.jsx) follows the same seven steps ----
const L7 = STEPS;
const List7 = ({ x = 1430, y = 240, w = 400, n = 0, t, tick = 1e9, miss = 1e9, k = 1, size = 27, title = 'چک‌لیست ورود' }) => k > 0.01 && <div style={{ position: 'absolute', left: x, top: y, width: w, borderRadius: 20, ...glass(C.gold), opacity: k, transform: `translateY(${(1 - k) * 20}px)`, padding: '16px 20px 18px', ...rtl }}>
  <div style={txt(size + 3, 900, C.gold2)}>{title}</div>
  {L7.map((r, i) => { const cur = i === n - 1, d = i < n - 1 || (cur && t > tick), ms = cur && !d && t > miss;
    return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7, padding: '4px 10px', borderRadius: 10, background: cur ? 'rgba(232,201,106,0.13)' : 'transparent' }}>
      <div style={{ width: size + 6, height: size + 6, borderRadius: 8, border: `3px solid ${ms ? C.red : d ? C.green : cur ? C.gold2 : C.mute}`, ...center, flex: 'none', transform: `scale(${cur && d ? 1 + 0.3 * (1 - pop(t, tick + 0.25)) : 1})` }}>
        {d && <Ico n="check" s={size} c={C.green} sw={12} />}{ms && <Ico n="cross" s={size - 6} c={C.red} sw={12} />}</div>
      <span style={txt(size, 800, ms ? C.red : d ? C.ink : cur ? C.gold2 : C.mute)}>{`${faNum(i + 1)}. ${r}`}</span></div>; })}</div>;
const Hypo = ({ x, y, k = 1 }) => <div style={{ position: 'absolute', left: x, top: y, opacity: k, ...txt(20, 900, C.gold2), border: '1.5px solid rgba(232,201,106,0.6)', borderRadius: 8, padding: '1px 10px 3px', background: 'rgba(13,17,23,0.75)', ...rtl }}>مثال فرضی</div>;
const Big = ({ text, k, y, size = 120, color = C.ink, x = null, w = null, icon = null }) => k > 0.01 && <div style={{ position: 'absolute', top: y, ...(x == null ? { left: 0, right: 0 } : { left: x, width: w }), ...center, gap: 22, opacity: clamp(k), transform: `scale(${0.85 + 0.15 * clamp(k)})`, ...txt(size, 900, color), ...rtl }}>{icon}{text}</div>;
const Sketch = ({ x, y, w, h, k = 1, title = null, tf = null }) => k > 0.01 && <g opacity={k}><rect x={x} y={y} width={w} height={h} rx={18} fill="#131722" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
  {title && <text x={x + w - 22} y={y + 40} textAnchor="start" direction="rtl" style={sv(26, 900, 'rgba(237,230,214,0.75)')}>{title}</text>}
  {tf && <g><rect x={x + 18} y={y + 16} width={tf.length * 15 + 20} height={32} rx={7} fill={TFC[tf] || C.gold2} /><text x={x + 28} y={y + 40} style={nv(20, '#131722', 800)}>{tf}</text></g>}</g>;
const Coin2 = ({ x, y, r = 70, flip = 0, k = 1 }) => { if (k <= 0.01) return null; const c = Math.cos(flip * Math.PI * 2), back = c < 0;
  return <g opacity={k} transform={`translate(${x} ${y}) scale(${Math.max(0.06, Math.abs(c))} 1)`}><circle r={r} fill={back ? '#9C7A1E' : C.gold2} stroke="#7A5A10" strokeWidth={5} /><circle r={r * 0.78} fill="none" stroke={back ? '#7A5A10' : '#FFE48A'} strokeWidth={3} />
    <text y={r * 0.3} textAnchor="middle" style={sv(r * 0.9, 900, back ? '#3A2A06' : '#7A5A10')}>{back ? '؟' : 'B'}</text></g>; };
const PieClock = ({ x, y, r = 120, h = 10, m = 0, span = 30, k = 1, fillK = 0 }) => { if (k <= 0.01) return null; const a0 = (m / 60) * 360 - 90, a1 = a0 + (span / 60) * 360 * clamp(fillK), rd = d => d * Math.PI / 180, R = r - 10;
  const large = a1 - a0 > 180 ? 1 : 0, sector = fillK > 0.01 ? `M 0 0 L ${R * Math.cos(rd(a0))} ${R * Math.sin(rd(a0))} A ${R} ${R} 0 ${large} 1 ${R * Math.cos(rd(a1))} ${R * Math.sin(rd(a1))} Z` : null;
  return <g opacity={k} transform={`translate(${x} ${y})`}>{sector && <path d={sector} fill="rgba(232,201,106,0.3)" stroke={C.gold2} strokeWidth={3} />}</g>; };

// 1. hook: price falls into your zone; the heart says «همین حالا وارد شو!»; «اما آیا واقعاً وقتش است؟»; the title «ورود یا صبر؟» and seven
// empty boxes: one complete decision, step by step, on gold
export function hookZone({ shot }) {
  const t = useT(), hr = ev(shot, 'heart', 1.7), nw = ev(shot, 'now', 2.5), rl = ev(shot, 'really', 4.7), td = ev(shot, 'today', 6.3), st = ev(shot, 'step', 10.7);
  const out = 1 - pop(t, td - 0.1), d = prog(t, 0.1, Math.max(1, hr - 0.2)), calm = pop(t, rl), beat = t > hr ? 1 + 0.16 * (1 - calm) * Math.max(0, Math.sin(t * 9)) : 1;
  const P = [[300, 300], [380, 360], [430, 330], [520, 440], [580, 410], [680, 540], [740, 515], [820, 590]];
  return <AbsoluteFill>
    <AbsoluteFill style={{ opacity: out }}>
      <SVG><Sketch x={260} y={240} w={800} h={500} k={pop(t, 0)} title="طلا" />
        <OBBox x={700} y={560} w={330} h={80} k={pop(t, 0.2)} label="ناحیه تو" glow={t > hr - 0.4 ? 1 : 0} />
        <Path pts={P.map((q, i) => [q[0], q[1], seg(d, P.length - 1, i - 1)])} w={6} />
        <Ring x={820} y={590} at={hr - 0.3} t={t} c={C.gold2} r0={14} dr={70} />
        <Heart x={1430} y={360} s={2.7 * beat} k={pop(t, hr) * (1 - 0.55 * calm)} /></SVG>
      <Hypo x={290} y={700} />
      <Big text="همین حالا وارد شو!" k={pop(t, nw) * (1 - 0.5 * calm)} x={1110} w={640} y={470} size={52} color={C.red} />
      <Big text="اما آیا واقعاً وقتش است؟" k={pop(t, rl)} x={1060} w={740} y={580} size={50} color={C.gold2} />
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 190, ...center, flexDirection: 'column', gap: 18, opacity: pop(t, td), transform: `translateY(${(1 - pop(t, td)) * 30}px)`, ...rtl }}>
      <div style={badge}>سطح ۳ · درس ۹</div><div style={txt(130, 900, C.ink)}>ورود <span style={{ color: C.gold2 }}>یا</span> صبر؟</div></div>
    <SVG>{L7.map((_, i) => { const k = pop(t, st + i * 0.1); return <g key={i} opacity={k} transform={`translate(${1440 - i * 160} 600) scale(${0.7 + 0.3 * k})`}><rect x={-44} y={-44} width={88} height={88} rx={18} fill="rgba(255,255,255,0.04)" stroke={C.gold2} strokeWidth={4} />
      <text y={14} textAnchor="middle" style={sv(40, 900, C.mute)}>{faNum(i + 1)}</text></g>; })}</SVG>
    <Chip text="یک تصمیم کامل، قدم به قدم، روی طلا" k={pop(t, st + 0.6)} y={710} size={38} />
  </AbsoluteFill>;
}
// 2. recap: Kamal; last lesson the three entry windows; today every level 3 piece put side by side (scattered tiles snap into a grid); how a
// real decision is built
export function recapL3({ shot }) {
  const t = useT(), wn = ev(shot, 'windows', 3.0), td = ev(shot, 'today', 5.6), tg = ev(shot, 'together', 9.4), rl = ev(shot, 'real', 12.4), g = ease(prog(t, tg, 1.3));
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 230, ...center, flexDirection: 'column', gap: 18, opacity: slot(t, 0.05, wn - 0.3) }}>
      <Img src={staticFile('kamal.jpg')} style={{ width: 260, height: 260, borderRadius: '50%', objectFit: 'cover', border: `6px solid ${C.gold}` }} />
      <div style={txt(56, 900, C.ink)}>کمال حقجو</div></div>
    <AbsoluteFill style={{ opacity: slot(t, wn - 0.1, td - 0.2) }}>
      <Chip text="درس گذشته" y={170} size={38} />
      {[0, 1, 2].map(i => { const k = pop(t, wn + i * 0.25); return <div key={i} style={{ position: 'absolute', left: 1180 - i * 420, top: 300, width: 360, height: 300, ...glass(C.gold), opacity: k, transform: `translateY(${(1 - k) * 24}px)`, ...center, flexDirection: 'column', gap: 18, ...rtl }}>
        <Ico n="clock" s={110} c={C.gold2} sw={7} /><span style={txt(40, 900, C.ink)}>{`پنجره ${faNum(i + 1)}`}</span><span style={txt(26, 800, C.mute)}>زمان ورود</span></div>; })}</AbsoluteFill>
    <AbsoluteFill style={{ opacity: pop(t, td) }}>
      <Chip text="هر چه در سطح ۳ یاد گرفتیم، کنار هم" y={160} size={38} tone={t > tg ? C.green : C.gold} color={t > tg ? C.green : C.gold2} />
      {L7.map((s, i) => { const k = pop(t, td + 0.15 * i), sx = 300 + ((i * 397) % 1150), sy = 280 + ((i * 173) % 340), rot = ((i * 47) % 40) - 20, gx = i < 4 ? 1320 - i * 340 : 1150 - (i - 4) * 340, gy = i < 4 ? 320 : 450;
        return <div key={i} style={{ position: 'absolute', left: sx + (gx - sx) * g, top: sy + (gy - sy) * g, width: 300, height: 100, borderRadius: 18, ...glass(g > 0.9 ? C.gold : 'rgba(255,255,255,0.25)'), opacity: k, transform: `rotate(${rot * (1 - g)}deg) scale(${0.85 + 0.15 * k})`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', ...rtl }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, flex: 'none', background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...center, ...txt(28, 900, '#1b1203') }}>{faNum(i + 1)}</div><span style={txt(s.length > 10 ? 26 : 32, 900, C.ink)}>{s}</span></div>; })}
      <Chip text="یک تصمیم واقعی چطور ساخته می‌شود" k={pop(t, rl)} y={640} size={40} tone={C.green} color={C.green} icon={<Ico n="check" s={38} c={C.green} sw={10} />} />
    </AbsoluteFill>
  </AbsoluteFill>;
}
// the daily sketch shared by the scene and the scenario: the rise from two equal lows to the high, the fresh daily OB above the lows in the
// cheap half, the equal lows with their liquidity
const DP = [[680, 520], [780, 650], [850, 575], [920, 650], [1000, 560], [1060, 600], [1200, 420], [1260, 460], [1360, 330], [1460, 420], [1520, 400]];
// 3. the scene: weekly bullish; on the daily a fresh order block in the cheap half; under it two equal lows = liquidity
export function sceneSetup({ shot }) {
  const t = useT(), wk = ev(shot, 'weekly', 2.8), dl = ev(shot, 'daily', 5.4), ob = ev(shot, 'ob', 6.4), ch = ev(shot, 'cheap', 8.4), eq = ev(shot, 'eq', 10.5), lq = ev(shot, 'liq', 12.3), d = prog(t, dl, 1.4);
  return <AbsoluteFill>
    <Chip text="صحنه را بچینیم" k={pop(t, 0.1)} x={260} y={140} size={38} />
    <div style={{ position: 'absolute', left: 260, top: 300, width: 320, height: 300, ...glass(C.green), opacity: pop(t, wk), transform: `translateY(${(1 - pop(t, wk)) * 24}px)`, ...center, flexDirection: 'column', gap: 12, ...rtl }}>
      <span style={txt(34, 900, C.ink)}>تحلیل هفتگی</span>
      <svg width={220} height={120}><Path pts={[[10, 110], [60, 70], [90, 85], [140, 40], [170, 55], [210, 10]].map((q, i) => [q[0], q[1], seg(prog(t, wk, 1.0), 5, i - 1)])} w={6} c={C.green} /></svg>
      <span style={{ ...txt(38, 900, C.green), display: 'flex', alignItems: 'center', gap: 8 }}><Ico n="up" s={36} c={C.green} sw={10} />صعودی</span></div>
    <SVG><Sketch x={640} y={250} w={1040} h={540} k={pop(t, dl - 0.4)} title="چارت روزانه" tf="D1" />
      <PDBox x={660} y={330} w={1000} h={320} k={pop(t, ch)} zp={0} zd={1} eq={prog(t, ch, 0.8)} pct={0} tagSize={34} />
      <OBBox x={900} y={575} w={580} h={60} k={pop(t, ob)} lock={prog(t, ob, 0.7)} label="اردر بلاک تازه" glow={slot(t, ob, ch)} />
      <Path pts={DP.map((q, i) => [q[0], q[1], seg(d, DP.length - 1, i - 1)])} w={6} />
      <g opacity={pop(t, eq)}><line x1={760} x2={1640} y1={650} y2={650} stroke={LQ} strokeWidth={3} strokeDasharray="10 8" /><circle cx={780} cy={650} r={9} fill={LQ} /><circle cx={920} cy={650} r={9} fill={LQ} />
        <text x={850} y={712} textAnchor="middle" direction="rtl" style={sv(28, 900, LQ)}>دو کف برابر</text></g>
      <Liq x={760} y={668} w={180} rows={1} n={7} k={pop(t, lq)} />
      <text x={850} y={752} textAnchor="middle" direction="rtl" style={sv(30, 900, LQ)} opacity={pop(t, lq)}>= نقدینگی</text></SVG>
    <Hypo x={1540} y={745} k={pop(t, dl)} />
  </AbsoluteFill>;
}
// 4. the main scenario this week (left to right): if price takes the two lows -> enters the OB -> in New York the structure breaks up ->
// we look for a buy
export function scenario({ shot }) {
  const t = useT(), mn = ev(shot, 'main', 0.3), sw = ev(shot, 'sweep', 4.6), ob = ev(shot, 'ob', 5.1), ny = ev(shot, 'ny', 7.7), bs = ev(shot, 'bos', 9.6), by = ev(shot, 'buy', 10.7);
  const node = (i, at, tone, icon, lab, sub = null, subAt = 1e9) => { const k = pop(t, at); return <div key={i} style={{ position: 'absolute', left: 190 + i * 410, top: 360, width: 340, height: 270, ...glass(t > at ? tone : 'rgba(255,255,255,0.15)'), opacity: 0.18 + 0.82 * k, transform: `translateY(${(1 - k) * 24}px)`, ...center, flexDirection: 'column', gap: 14, ...rtl }}>
    <div style={{ position: 'absolute', right: 16, top: 12, width: 46, height: 46, borderRadius: 23, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...center, ...txt(26, 900, '#1b1203') }}>{faNum(i + 1)}</div>
    {icon}<span style={txt(34, 900, C.ink)}>{lab}</span>{sub && <span style={{ ...txt(28, 900, C.green), opacity: pop(t, subAt) }}>{sub}</span>}</div>; };
  return <AbsoluteFill>
    <Big text="سناریوی اصلی این هفته" k={pop(t, mn)} y={140} size={62} color={C.gold2} />
    <Chip text="اگر…" k={pop(t, mn + 2.0)} y={250} size={38} />
    {node(0, sw, LQ, <svg width={160} height={70}><line x1={10} x2={150} y1={24} y2={24} stroke={LQ} strokeWidth={3} strokeDasharray="8 6" /><Liq x={20} y={40} w={120} rows={1} n={6} eat={prog(t, sw, 1.2)} /><path d="M 60 6 L 80 58 L 100 14" fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" /></svg>, 'دو کف زده شود')}
    {node(1, ob, C.gold, <svg width={160} height={70}><rect x={20} y={14} width={120} height={46} fill={OBF} stroke={C.gold} strokeWidth={3} /><text x={80} y={46} textAnchor="middle" style={nv(24, C.gold2, 800)}>OB</text></svg>, 'ورود به اردر بلاک')}
    {node(2, ny, C.gold, <svg width={160} height={70}><Sky x={80} y={36} s={1.2} /></svg>, 'سشن نیویورک', 'ساختار به بالا بشکند', bs)}
    {node(3, by, C.green, <Ico n="up" s={70} c={C.green} sw={10} />, 'دنبال خرید')}
    <SVG>{[0, 1, 2].map(i => <Arrow key={i} x1={540 + i * 410} y1={495} x2={590 + i * 410} y2={495} c={C.gold2} w={6} head={16} p={prog(t, [ob, ny, by][i] - 0.3, 0.4)} />)}</SVG>
  </AbsoluteFill>;
}
// 5. the trading day: the London session; price came down to the order block; most traders rush (a crowd on the buy button); we open the
// checklist
export function tradeDay({ shot }) {
  const t = useT(), dy = ev(shot, 'day', 0.75), ld = ev(shot, 'london', 3.5), rc = ev(shot, 'reach', 6.3), rs = ev(shot, 'rush', 9.0), ls = ev(shot, 'list', 10.7), d = prog(t, ld - 0.3, Math.max(1, rc - ld + 0.3));
  const P = [[700, 330], [770, 380], [810, 360], [880, 450], [930, 430], [1010, 540], [1060, 520], [1120, 600]], jit = t > rs ? Math.sin(t * 21) * 7 : 0, fade = 1 - 0.6 * pop(t, ls);
  return <AbsoluteFill>
    <SVG><Sess x={260} y={140} w={1400} h={70} on={[0, t > ld ? 1 : 0, 0]} k={pop(t, dy)} />
      <Sketch x={680} y={260} w={640} h={500} k={pop(t, dy + 0.3)} title="طلا" />
      <OBBox x={980} y={570} w={330} h={70} k={pop(t, dy + 0.5)} label="OB روزانه" glow={t > rc ? 1 : 0} />
      <Path pts={P.map((q, i) => [q[0], q[1], seg(d, P.length - 1, i - 1)])} w={6} />
      <Ring x={1120} y={600} at={rc} t={t} c={C.gold2} r0={14} dr={70} />
      <g opacity={pop(t, rs) * fade}>{[0, 1, 2, 3, 4].map(i => <g key={i} transform={`translate(${1440 + (i % 3) * 110 + jit * (i % 2 ? 1 : -1)} ${380 + Math.floor(i / 3) * 120 + Math.abs(jit) * 0.6})`}><circle r={30} fill="none" stroke={C.red} strokeWidth={5} /><path d="M -40 70 C -36 34 -16 30 0 30 C 16 30 36 34 40 70" fill="none" stroke={C.red} strokeWidth={5} /></g>)}
        <Btn x={1560} y={690} w={240} text="خرید!" col={C.red} on={1} /></g></SVG>
    <Chip text="روز معامله" k={pop(t, dy)} x={260} y={250} size={34} icon={<Ico n="clock" s={34} c={C.gold2} sw={9} />} />
    <Chip text="قیمت به اردر بلاک رسید" k={pop(t, rc)} x={700} y={770} size={30} />
    <Chip text="بیشتر معامله‌گرها عجله می‌کنند" k={pop(t, rs) * fade} x={1360} y={250} size={28} tone={C.red} color={C.red} />
    <List7 x={240} y={330} w={400} size={24} n={0} t={t} k={pop(t, ls)} title="ما: چک‌لیست را باز می‌کنیم" />
    <Hypo x={700} y={722} k={pop(t, dy + 0.3)} />
  </AbsoluteFill>;
}
// the step header for this lesson: «قدم N: title»
const StepH = ({ n, t, sub = null }) => <StepHead n={n} t={t} sub={sub} />;
const mini = (pts, p, c = C.green) => <svg width={380} height={170}><line x1={10} x2={370} y1={160} y2={160} stroke="rgba(237,230,214,0.15)" strokeWidth={2} /><Path pts={pts.map((q, i) => [q[0], q[1], seg(p, pts.length - 1, i - 1)])} w={6} c={c} /></svg>;
// 6. step 1: the big direction: weekly and daily trend bullish? yes -> tick one
export function step1Dir({ shot }) {
  const t = useT(), w1 = ev(shot, 'w1', 3.4), d1 = ev(shot, 'd1', 4.0), ys = ev(shot, 'yes', 5.9), tk = ev(shot, 'tick', 6.5);
  const card = (x, tf, lab, at, pts) => <div style={{ position: 'absolute', left: x, top: 260, width: 500, height: 380, borderRadius: 18, background: '#131722', border: `2.5px solid ${t > at ? C.green : 'rgba(255,255,255,0.15)'}`, opacity: pop(t, 0.4), boxShadow: '0 20px 60px rgba(0,0,0,0.5)', ...rtl }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px' }}><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 22, color: '#131722', background: TFC[tf] || C.gold2, borderRadius: 6, padding: '2px 10px' }}>{tf}</span><span style={txt(32, 900, C.ink)}>{lab}</span></div>
    <div style={{ position: 'absolute', left: 60, top: 90 }}>{mini(pts, prog(t, at - 0.6, 1.0))}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, ...center, gap: 10, opacity: pop(t, at), ...txt(34, 900, C.green) }}><Ico n="check" s={34} c={C.green} sw={11} />صعودی</div></div>;
  return <AbsoluteFill>
    <StepH n={1} t={t} />
    {card(830, 'W1', 'روند هفتگی', w1, [[10, 150], [80, 100], [120, 120], [200, 60], [240, 80], [330, 20]])}
    {card(280, 'D1', 'روند روزانه', d1, [[10, 140], [70, 90], [110, 115], [180, 70], [230, 95], [320, 30], [360, 50]])}
    <Big text="بله" k={pop(t, ys)} x={280} w={1050} y={670} size={70} color={C.green} icon={<Ico n="check" s={70} c={C.green} sw={11} />} />
    <List7 n={1} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 7. step 2: the zone: fresh, in the cheap half? yes, the daily order block is untouched -> tick two
export function step2Zone({ shot }) {
  const t = useT(), fr = ev(shot, 'fresh', 3.9), ch = ev(shot, 'cheap', 5.3), ys = ev(shot, 'yes', 6.7), it = ev(shot, 'intact', 8.7), tk = ev(shot, 'tick', 10.3);
  return <AbsoluteFill>
    <StepH n={2} t={t} />
    <SVG><PDBox x={300} y={250} w={1000} h={480} k={pop(t, 0.5)} zp={0.25} zd={0.25 + 0.75 * pop(t, ch)} eq={prog(t, 0.8, 0.8)} pct={1} tags={1} tagSize={36} oteGlow={0} />
      <OBBox x={560} y={560} w={560} h={80} k={pop(t, 1.2)} label="OB روزانه" glow={slot(t, fr, ch) + pop(t, it)} lock={prog(t, 1.2, 0.8)} />
      <Tag x={1210} y={540} text="تازه" col={C.green} k={pop(t, fr)} r={-6} /></SVG>
    <Big text="بله" k={pop(t, ys)} x={300} w={500} y={300} size={64} color={C.green} icon={<Ico n="check" s={60} c={C.green} sw={11} />} />
    <Chip text="اردر بلاک روزانه دست نخورده است" k={pop(t, it)} x={420} y={760} size={32} tone={C.green} color={C.green} icon={<Ico n="shield" s={34} c={C.green} sw={9} />} />
    <List7 n={2} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 8. step 3: liquidity: before the zone, was liquidity taken? yes, the two equal lows were hit (a wick under them eats the dots, price is
// back in the order block) -> tick three
export function step3Liq({ shot }) {
  const t = useT(), bf = ev(shot, 'before', 3.0), tk0 = ev(shot, 'taken', 5.4), ys = ev(shot, 'yes', 6.4), eq = ev(shot, 'eq', 7.1), tk = ev(shot, 'tick', 9.2);
  const A = [[300, 420], [380, 590], [450, 510], [540, 590], [640, 300], [760, 420], [800, 400], [880, 540]], B = [[880, 540], [950, 625], [1010, 535], [1080, 520]];
  return <AbsoluteFill>
    <StepH n={3} t={t} />
    <SVG><Sketch x={270} y={240} w={1080} h={540} k={pop(t, 0.3)} title="طلا · روزانه" />
      <OBBox x={520} y={505} w={800} h={70} k={pop(t, 0.5)} label="OB" />
      <line x1={360} x2={1320} y1={590} y2={590} stroke={LQ} strokeWidth={3} strokeDasharray="10 8" opacity={pop(t, 0.8)} />
      <Liq x={350} y={612} w={210} rows={1} n={7} k={pop(t, 0.9)} eat={prog(t, tk0 - 0.2, 1.0)} />
      <Path pts={A.map((q, i) => [q[0], q[1], seg(prog(t, 0.4, 2.2), A.length - 1, i - 1)])} w={6} />
      <Path pts={B.map((q, i) => [q[0], q[1], seg(prog(t, tk0 - 0.6, 1.2), B.length - 1, i - 1)])} w={6} />
      <Ring x={950} y={625} at={tk0} t={t} c={LQ} r0={12} dr={60} />
      <text x={960} y={690} textAnchor="middle" direction="rtl" style={sv(28, 900, LQ)} opacity={pop(t, tk0)}>نقدینگی جمع شد</text></SVG>
    <Chip text="قبل از رسیدن به ناحیه؟" k={pop(t, bf)} x={300} y={270} size={30} tone={LQ} color={LQ} />
    <Big text="بله" k={pop(t, ys)} x={900} w={420} y={320} size={56} color={C.green} icon={<Ico n="check" s={52} c={C.green} sw={11} />} />
    <Chip text="دو کف برابر زده شد" k={pop(t, eq)} x={300} y={690} size={30} tone={C.green} color={C.green} />
    <Hypo x={1210} y={740} />
    <List7 n={3} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 9. step 4: time: are we in an entry window? no, still London (the window is in New York) -> the first decision: wait. Three ticks, no
// right time = no entry
export function step4Wait({ shot }) {
  const t = useT(), wn = ev(shot, 'window', 3.5), no = ev(shot, 'no', 5.8), ld = ev(shot, 'london', 7.5), fs = ev(shot, 'first', 9.9), wt = ev(shot, 'wait', 12.3), th = ev(shot, 'three', 14.0), ne = ev(shot, 'noentry', 16.6);
  const S = { x: 260, w: 1100 }, lx = S.x + 0.53 * S.w;
  return <AbsoluteFill>
    <StepH n={4} t={t} />
    <SVG><Sess x={S.x} y={250} w={S.w} h={70} on={[0, 1, 0]} k={pop(t, 0.4)} />
      <g opacity={pop(t, wn)}><rect x={S.x + 0.72 * S.w} y={238} width={0.16 * S.w * prog(t, wn, 0.7)} height={94} rx={12} fill={KZ} stroke={C.gold2} strokeWidth={3} strokeDasharray="8 6" />
        <text x={S.x + 0.8 * S.w} y={370} textAnchor="middle" direction="rtl" style={sv(26, 900, C.gold2)}>پنجره ورود</text></g>
      <g opacity={pop(t, ld)}><path d={`M ${lx} 336 L ${lx - 14} 360 L ${lx + 14} 360 Z`} fill={C.red} /><text x={lx} y={396} textAnchor="middle" direction="rtl" style={sv(28, 900, C.red)}>الان: هنوز لندن</text></g>
      <Clock x={420} y={560} r={100} h={9} m={10 + 4 * t} k={pop(t, ld)} warn />
      <g opacity={pop(t, th)}>{[0, 1, 2].map(i => <Check key={i} x={1140 - i * 90} y={720} r={30} k={pop(t, th + i * 0.15)} />)}<XMark x={870} y={720} r={30} k={pop(t, th + 0.5)} /></g></SVG>
    <Big text="نه" k={slot(t, no, fs)} x={600} w={700} y={470} size={130} color={C.red} />
    <Chip text="پس اولین تصمیم:" k={pop(t, fs)} x={650} y={420} size={34} />
    <Big text="صبر" k={pop(t, wt)} x={600} w={700} y={490} size={140} color={C.gold2} icon={<Ico n="pause" s={110} c={C.gold2} sw={9} />} />
    <Chip text="سه تیک داریم" k={pop(t, th)} x={260} y={690} size={28} tone={C.green} color={C.green} />
    <Chip text="بدون زمان درست، وارد نمی‌شویم" k={pop(t, ne)} x={600} y={770} size={30} tone={C.red} color={C.red} icon={<Ico n="cross" s={30} c={C.red} sw={10} />} />
    <List7 n={4} t={t} miss={no} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 10. an hour later New York opens; the first 15 minutes we only watch (lesson 7); price dips lower once and comes back; now we are in the
// window -> tick four
export function step4NY({ shot }) {
  const t = useT(), hr = ev(shot, 'hour', 0.55), ny = ev(shot, 'ny', 1.7), m15 = ev(shot, 'm15', 3.8), wa = ev(shot, 'watch', 5.6), lo = ev(shot, 'lower', 10.3), bk = ev(shot, 'back', 11.7), iw = ev(shot, 'inwin', 13.7), tk = ev(shot, 'tick', 15.8);
  const W = { x: 760, y: 300, w: 600, h: 440 }, q = prog(t, m15, Math.max(1, lo - m15 - 0.3)), dn = prog(t, lo - 0.3, Math.max(0.8, bk - lo + 0.3)), up = prog(t, bk - 0.1, 1.4);
  const P1 = Array.from({ length: 9 }, (_, i) => [W.x + 30 + i * 26, 520 + 22 * Math.sin(i * 1.7) * (i % 2 ? 1 : -0.7)]), P2 = [[P1[8][0], P1[8][1]], [1060, 600], [1110, 660], [1150, 640]], P3 = [[1150, 640], [1210, 560], [1250, 580], [1320, 470]];
  return <AbsoluteFill>
    <Chip text="یک ساعت بعد" k={pop(t, hr)} x={260} y={140} size={36} icon={<Ico n="clock" s={36} c={C.gold2} sw={9} />} />
    <SVG><Sess x={760} y={140} w={1000} h={64} on={[0, 0, t > ny ? 1 : 0]} k={pop(t, 0.2)} />
      <Clock x={460} y={430} r={110} h={8} m={30 + 60 * ease(prog(t, hr, 1.2))} k={pop(t, 0.3)} />
      <text x={460} y={590} textAnchor="middle" direction="rtl" style={sv(28, 900, C.gold2)} opacity={pop(t, ny)}>نیویورک باز شد</text>
      <rect x={W.x} y={W.y} width={W.w} height={W.h} rx={16} fill="#131722" stroke="rgba(255,255,255,0.12)" strokeWidth={2} opacity={pop(t, ny)} />
      <rect x={W.x + 20} y={W.y + 20} width={(P1[8][0] - W.x - 20) * q} height={W.h - 40} fill="rgba(255,255,255,0.05)" stroke="rgba(237,230,214,0.35)" strokeWidth={2} strokeDasharray="8 6" opacity={pop(t, m15)} />
      <text x={W.x + 140} y={W.y + 60} textAnchor="middle" direction="rtl" style={sv(24, 900, C.ink)} opacity={pop(t, m15)}>۱۵ دقیقه اول</text>
      <rect x={P1[8][0]} y={W.y + 20} width={(W.x + W.w - 20 - P1[8][0]) * prog(t, iw, 0.8)} height={W.h - 40} fill={KZ} stroke={C.gold2} strokeWidth={2.5} strokeDasharray="8 6" />
      <text x={1220} y={W.y + 60} textAnchor="middle" direction="rtl" style={sv(26, 900, C.gold2)} opacity={pop(t, iw)}>پنجره ورود</text>
      <Path pts={P1.map((p, i) => [p[0], p[1], seg(q, 8, i - 1)])} w={5} />
      <Path pts={P2.map((p, i) => [p[0], p[1], seg(dn, 3, i - 1)])} w={5} c={t > bk ? C.ink : C.red} />
      <Path pts={P3.map((p, i) => [p[0], p[1], seg(up, 3, i - 1)])} w={5} c={C.green} /></SVG>
    <Chip text="فقط نگاه می‌کنیم" k={pop(t, wa)} x={260} y={640} size={30} icon={<Ico n="eye" s={32} c={C.gold2} sw={8} />} />
    <Chip text="همان‌طور که در درس ۷ گفتیم" k={pop(t, wa + 0.6)} x={260} y={725} size={26} />
    <Chip text="یک بار پایین‌تر رفت و برگشت" k={pop(t, bk)} x={780} y={760} size={28} />
    <Hypo x={780} y={702} k={pop(t, ny)} />
    <List7 n={4} t={t} tick={tk} miss={-1} k={pop(t, 0.3)} x={1440} y={250} w={380} size={24} />
  </AbsoluteFill>;
}
// chart data CH (XAUUSD M15, hypothetical): down into the zone, the last high at 4146, one dip lower to 4131 in New York, the rise that
// breaks 4146 and closes above it, then the pull-back to the break area (entry 4147); the stop under the lowest point (4129), the target
// last week's high (4201): 18 risk, 54 reward = 3:1
const CH = makeCandles([[0, 4152], [5, 4138], [8, 4146], [12, 4131], [18, 4155], [22, 4147]], 93);
const BRK = firstClose(CH, 13, 4146.5, 1);
// 11. CHART step 5: confirmation on M15: did the structure break up? price broke the last high and closed above it -> tick five
export function step5Chart({ shot }) {
  const t = useT(), m15 = ev(shot, 'm15', 3.7), up = ev(shot, 'up', 6.1), hi = ev(shot, 'high', 7.9), cl = ev(shot, 'close', 10.5), tk = ev(shot, 'tick', 12.0);
  const view = [0, 26, 4124, 4162], PWD = 1280, PH = 524, [X, Y] = mapXY(view, PWD, PH), upTo = 12.6 + (BRK + 0.55 - 12.6) * prog(t, up - 0.3, Math.max(1.2, hi - up + 0.3)) + 0.43 * prog(t, hi, Math.max(0.8, cl - hi)) + 0.6 * prog(t, cl + 0.6, 1.2), brk = t > hi;
  return <AbsoluteFill>
    <StepH n={5} t={t} />
    <Platform y={220} h={600} k={pop(t, 0)} w={PWD} sym="XAUUSD" tf="M15" frame={TFC.M15} name="طلا · پانزده دقیقه">
      <StructChart t={t} cs={CH} upTo={upTo} view={view} w={PWD} h={PH} />
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={PWD} height={PH}>
        <line x1={X(8)} x2={X(8) + (X(26) - X(8)) * prog(t, m15, 0.8)} y1={Y(4146)} y2={Y(4146)} stroke={brk ? C.green : C.gold2} strokeWidth={3.5} strokeDasharray={brk ? undefined : '10 8'} />
        <g opacity={pop(t, m15)}><rect x={X(8) - 70} y={Y(4146) - 58} width={140} height={42} rx={10} fill="rgba(13,17,23,0.92)" stroke={brk ? C.green : C.gold2} strokeWidth={2} />
          <text x={X(8)} y={Y(4146) - 28} textAnchor="middle" direction="rtl" style={sv(24, 900, brk ? C.green : C.gold2)}>{brk ? 'شکست ↑' : 'سقف آخر'}</text></g>
        <g opacity={pop(t, cl)}><rect x={X(BRK) - 26} y={Y(CH[BRK].h) - 12} width={52} height={Y(CH[BRK].l) - Y(CH[BRK].h) + 24} rx={10} fill="none" stroke={C.green} strokeWidth={3} /><Ring x={X(BRK)} y={Y(CH[BRK].c)} at={cl} t={t} c={C.green} />
          <rect x={X(BRK) + 40} y={Y(CH[BRK].c) - 22} width={250} height={44} rx={10} fill={C.green} /><text x={X(BRK) + 165} y={Y(CH[BRK].c) + 9} textAnchor="middle" direction="rtl" style={sv(24, 900, '#fff')}>بالای سقف بسته شد</text></g>
        <g opacity={pop(t, 1.0)}><circle cx={X(12)} cy={Y(4131) + 18} r={7} fill={LQ} /><text x={X(12)} y={Y(4131) + 50} textAnchor="middle" direction="rtl" style={sv(22, 900, LQ)}>پایین‌ترین نقطه</text></g></svg></Platform>
    <List7 n={5} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 12. info step 6: news: any important news in the next half hour? we check the economic calendar: none -> tick six
export function step6News({ shot }) {
  const t = useT(), hf = ev(shot, 'half', 4.0), cl = ev(shot, 'cal', 6.1), nn = ev(shot, 'none', 8.6), tk = ev(shot, 'tick', 10.1), sc = prog(t, cl + 0.3, Math.max(0.8, nn - cl - 0.5));
  const R = [['۱۰:۰۰', 'USD', 1, 0], ['۱۰:۱۵', 'EUR', 1, 0], ['۱۰:۲۵', 'GBP', 1, 0], ['۱۳:۳۰', 'USD', 3, 1]];
  return <AbsoluteFill>
    <StepH n={6} t={t} />
    <SVG><Clock x={470} y={480} r={140} h={10} m={0} k={pop(t, 0.4)} /><PieClock x={470} y={480} r={140} h={10} m={0} span={30} fillK={prog(t, hf, 1.0)} k={pop(t, hf)} /></SVG>
    <div style={{ position: 'absolute', left: 320, top: 650, width: 300, textAlign: 'center', ...txt(32, 900, C.gold2), opacity: pop(t, hf), ...rtl }}>نیم ساعت آینده</div>
    <div style={{ position: 'absolute', left: 760, top: 250, width: 600, borderRadius: 18, background: '#131722', border: '1.5px solid rgba(255,255,255,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', opacity: pop(t, cl), transform: `translateY(${(1 - pop(t, cl)) * 24}px)`, padding: '16px 22px 20px', ...rtl }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={txt(32, 900, C.ink)}>تقویم اقتصادی</span><span style={{ ...txt(18, 900, C.gold2), border: '1.5px solid rgba(232,201,106,0.6)', borderRadius: 8, padding: '1px 10px 3px' }}>مثال فرضی</span></div>
      {R.map(([tm, cur, imp, far], i) => { const lit = !far && sc * 3 > i; return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, padding: '10px 16px', borderRadius: 12, background: lit ? 'rgba(232,201,106,0.12)' : 'rgba(255,255,255,0.03)', opacity: far ? 0.4 : 1 }}>
        <span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 28, color: C.ink, direction: 'ltr', width: 100 }}>{tm}</span><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 26, color: C.mute, width: 70 }}>{cur}</span>
        <span style={{ display: 'flex', gap: 6, direction: 'ltr' }}>{[0, 1, 2].map(j => <span key={j} style={{ width: 16, height: 26, borderRadius: 4, background: j < imp ? (imp === 3 ? C.red : '#9AA3B5') : 'rgba(255,255,255,0.1)' }} />)}</span>
        <span style={{ marginRight: 'auto', ...txt(24, 800, far ? C.mute : C.green), opacity: far ? 1 : pop(t, nn) }}>{far ? 'بعد از نیم ساعت' : 'کم‌اهمیت'}</span></div>; })}</div>
    <Big text="خبری نیست" k={pop(t, nn)} x={760} w={600} y={700} size={54} color={C.green} icon={<Ico n="check" s={52} c={C.green} sw={11} />} />
    <List7 n={6} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 13. CHART step 7: reward to risk: entry on the pull-back to the break area, the stop under the lowest point, the target last week's high;
// about 3:1, more than 2 -> accepted, tick seven
export function step7RR({ shot }) {
  const t = useT(), rr = ev(shot, 'rr', 1.9), en = ev(shot, 'entry', 4.2), sl = ev(shot, 'sl', 7.3), tp = ev(shot, 'tp', 10.0), th = ev(shot, 'three', 13.6), tw = ev(shot, 'two', 15.9), ok = ev(shot, 'ok', 16.6), tk = ev(shot, 'tick', 17.6);
  const view = [0, 34, 4120, 4208], PWD = 1280, PH = 524, [X, Y] = mapXY(view, PWD, PH), upTo = BRK + 1 + (22.98 - BRK - 1) * prog(t, 0.3, Math.max(1.5, en - 0.6));
  const E = 4147, SL = 4129, TP = 4201, x0 = X(22), x1 = X(33.6);
  const lab = (y, text, c, at, dy = -12) => <g opacity={pop(t, at)}><rect x={x1 - 330} y={y + dy - 30} width={320} height={40} rx={9} fill="rgba(13,17,23,0.92)" stroke={c} strokeWidth={2} /><text x={x1 - 170} y={y + dy - 2} textAnchor="middle" direction="rtl" style={sv(22, 900, c)}>{text}</text></g>;
  return <AbsoluteFill>
    <StepH n={7} t={t} />
    <Platform y={220} h={600} k={pop(t, 0)} w={PWD} sym="XAUUSD" tf="M15" frame={TFC.M15} name="طلا · پانزده دقیقه">
      <StructChart t={t} cs={CH} upTo={upTo} view={view} w={PWD} h={PH} />
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={PWD} height={PH}>
        <rect x={x0} y={Y(TP)} width={(x1 - x0) * pop(t, th)} height={Y(E) - Y(TP)} fill="rgba(38,166,154,0.16)" />
        <rect x={x0} y={Y(E)} width={(x1 - x0) * pop(t, th)} height={Y(SL) - Y(E)} fill="rgba(230,50,18,0.16)" />
        <line x1={X(4)} x2={x1} y1={Y(TP)} y2={Y(TP)} stroke={C.green} strokeWidth={3.5} opacity={pop(t, tp)} />
        <line x1={x0 - 30} x2={x1} y1={Y(E)} y2={Y(E)} stroke="rgba(237,230,214,0.75)" strokeWidth={3} strokeDasharray="9 7" opacity={pop(t, en)} />
        <line x1={X(10)} x2={x1} y1={Y(SL)} y2={Y(SL)} stroke={C.red} strokeWidth={3.5} opacity={pop(t, sl)} />
        <g opacity={pop(t, en)}><circle cx={x0} cy={Y(E)} r={10} fill={C.green} /><Ring x={x0} y={Y(E)} at={en} t={t} c={C.green} /></g>
        <g opacity={pop(t, sl)}><circle cx={X(12)} cy={Y(4131)} r={9} fill="none" stroke={C.red} strokeWidth={3} /></g>
        {lab(Y(TP), 'هدف: سقف هفته گذشته', C.green, tp)}{lab(Y(E), 'ورود: برگشت به ناحیه شکست', C.ink, en)}{lab(Y(SL), 'حد ضرر: زیر پایین‌ترین نقطه', C.red, sl, 46)}
        <text x={x0 + 20} y={(Y(TP) + Y(E)) / 2 + 20} style={sv(56, 900, C.green)} direction="rtl" textAnchor="end" opacity={pop(t, th)}>۳</text>
        <text x={x0 + 20} y={(Y(E) + Y(SL)) / 2 + 16} style={sv(40, 900, C.red)} direction="rtl" textAnchor="end" opacity={pop(t, th)}>۱</text></svg></Platform>
    <div style={{ position: 'absolute', left: 160, top: 278, width: 400, borderRadius: 18, ...glass(t > ok ? C.green : C.gold), padding: '10px 24px 12px', opacity: pop(t, rr), ...rtl }}>
      <div style={txt(30, 900, C.gold2)}>نسبت سود به ضرر</div>
      {[['ورود', en, C.ink], ['حد ضرر', sl, C.red], ['هدف', tp, C.green]].map(([a, at, c], i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, ...txt(24, 900, c), opacity: 0.25 + 0.75 * pop(t, at) }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, border: `2.5px solid ${t > at ? C.green : C.mute}`, ...center }}>{t > at && <Ico n="check" s={24} c={C.green} sw={13} />}</div>{a}</div>)}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}><span style={{ ...txt(36, 900, C.ink), opacity: pop(t, th) }}>حدود ۳ به ۱</span><span style={{ ...txt(26, 800, C.mute), opacity: pop(t, tw) }}>بیشتر از ۲</span></div>
      <div style={{ ...txt(32, 900, C.green), marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, opacity: pop(t, ok) }}><Ico n="check" s={32} c={C.green} sw={11} />قبول</div></div>
    <List7 n={7} t={t} tick={tk} k={pop(t, 0.3)} />
  </AbsoluteFill>;
}
// 14. seven full ticks: now and only now the entry decision is made; fixed risk, 1% or less; not more because we are sure: confidence does
// not change the risk
export function sevenTicks({ shot }) {
  const t = useT(), sv7 = ev(shot, 'seven', 0.3), nw = ev(shot, 'now', 3.4), en = ev(shot, 'entry', 4.9), rk = ev(shot, 'risk', 6.8), on = ev(shot, 'one', 8.1), su = ev(shot, 'sure', 11.5), cf = ev(shot, 'conf', 13.1);
  return <AbsoluteFill>
    <SVG>{L7.map((_, i) => <Check key={i} x={1500 - i * 170} y={210} r={44} k={pop(t, sv7 + 0.4 + i * 0.12)} />)}</SVG>
    <Big text="هفت تیک کامل" k={pop(t, sv7)} y={290} size={80} color={C.green} />
    <Big text="حالا و فقط حالا" k={slot(t, nw, rk - 0.2)} y={430} size={78} color={C.gold2} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 570, ...center, opacity: slot(t, en, rk - 0.2) }}>
      <div style={{ padding: '14px 46px 20px', borderRadius: 22, background: C.green, display: 'flex', alignItems: 'center', gap: 16, ...txt(52, 900, '#fff'), ...rtl }}><Ico n="check" s={50} c="#fff" sw={11} />تصمیم ورود</div></div>
    <Big text="ریسک ثابت" k={pop(t, rk)} y={420} size={74} color={C.ink} icon={<Ico n="shield" s={70} c={C.gold2} sw={8} />} />
    <Big text="۱٪ یا کمتر" k={pop(t, on)} y={530} size={70} color={C.gold2} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 650, ...center, opacity: pop(t, su), ...rtl }}><span style={{ ...txt(40, 900, C.red), textDecoration: 'line-through', textDecorationThickness: 5 }}>بیشتر، چون مطمئنیم</span></div>
    <Chip text="اطمینان، ریسک را عوض نمی‌کند" k={pop(t, cf)} y={740} size={40} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// 15. the other side of the coin: in step 5 the structure did not break and price closed under the order block: the scenario is void; no
// trade, write why in the journal; that is a right decision too; in level 3 the days without a trade are lessons as well
export function otherSide({ shot }) {
  const t = useT(), cn = ev(shot, 'coin', 1.4), fv = ev(shot, 'five', 4.2), bl = ev(shot, 'below', 7.3), vd = ev(shot, 'void', 11.4), nt = ev(shot, 'notrade', 14.0), jr = ev(shot, 'journal', 16.0), rt = ev(shot, 'right', 19.3), ls = ev(shot, 'lesson', 22.7);
  const dim = 1 - 0.75 * pop(t, nt), P = [[320, 360], [400, 410], [450, 390], [540, 480], [600, 460], [680, 520]], dn = prog(t, bl - 0.4, 1.0);
  return <AbsoluteFill>
    <SVG><Coin2 x={360} y={210} r={62} flip={prog(t, cn - 0.2, 1.2) * 1.5} k={pop(t, 0.1)} /></SVG>
    <Chip text="روی دیگر سکه" k={pop(t, cn)} x={460} y={175} size={36} />
    <AbsoluteFill style={{ opacity: dim }}>
      <SVG><Sketch x={280} y={300} w={1000} h={470} k={pop(t, fv - 0.5)} title="طلا · پانزده دقیقه" />
        <OBBox x={560} y={470} w={680} h={80} k={pop(t, fv - 0.3)} label="OB" crack={prog(t, vd, 1.2)} />
        <Path pts={P.map((q, i) => [q[0], q[1], seg(prog(t, fv - 0.3, 1.6), P.length - 1, i - 1)])} w={6} />
        {t > bl - 0.4 && <SkC c={[760, 500, 500 + 140 * ease(dn), 490, 500 + 150 * ease(dn)]} w={40} />}
        <line x1={720} x2={1240} y1={550} y2={550} stroke={C.red} strokeWidth={3} strokeDasharray="8 6" opacity={pop(t, bl)} />
        <text x={1000} y={600} textAnchor="middle" direction="rtl" style={sv(28, 900, C.red)} opacity={pop(t, bl)}>بسته شدن زیر اردر بلاک</text></SVG>
      <Chip text="قدم ۵: ساختار نشکست" k={pop(t, fv)} x={300} y={690} size={28} tone={C.red} color={C.red} icon={<Ico n="cross" s={28} c={C.red} sw={10} />} />
      <Hypo x={1140} y={728} k={pop(t, fv)} />
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 520, top: 400, opacity: pop(t, vd) * (1 - 0.6 * pop(t, nt)), transform: `rotate(-8deg) scale(${1.25 - 0.25 * pop(t, vd)})`, border: `6px solid ${C.red}`, borderRadius: 18, padding: '6px 34px 12px', background: 'rgba(13,17,23,0.7)', ...txt(64, 900, C.red), ...rtl }}>سناریو باطل</div>
    <Chip text="تصمیم ما: معامله نمی‌کنیم" k={pop(t, nt)} x={300} y={290} size={36} tone={C.gold} color={C.gold2} icon={<Ico n="pause" s={36} c={C.gold2} sw={9} />} />
    <Chip text="این هم یک تصمیم درست است" k={pop(t, rt)} x={300} y={560} size={36} tone={C.green} color={C.green} icon={<Ico n="check" s={36} c={C.green} sw={10} />} />
    <Chip text="روزهای بدون معامله هم درس هستند" k={pop(t, ls)} x={300} y={660} size={34} tone={C.gold} color={C.gold2} icon={<Ico n="book" s={34} c={C.gold2} sw={8} />} />
    <div style={{ position: 'absolute', left: 1360, top: 300, width: 440, height: 440, background: '#F6EEDC', borderRadius: 8, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', padding: '22px 28px', opacity: pop(t, jr), transform: `rotate(2deg) translateY(${(1 - pop(t, jr)) * 30}px)`, ...rtl }}>
      <div style={txt(34, 900, '#5A4A1A')}>ژورنال</div>
      <div style={{ ...txt(28, 800, '#3A2E10'), marginTop: 18 }}>امروز: معامله نکردم</div>
      <div style={{ ...txt(32, 900, C.red), marginTop: 22, opacity: pop(t, jr + 0.8) }}>چرا؟</div>
      <div style={{ ...txt(26, 800, '#3A2E10'), marginTop: 10, whiteSpace: 'normal', lineHeight: 1.5, opacity: pop(t, jr + 1.4) }}>قدم ۵ رد شد؛ قیمت زیر اردر بلاک بسته شد، سناریو باطل بود.</div></div>
  </AbsoluteFill>;
}
// 16. a common mistake: many fill the checklist after the entry to prove to themselves they were right; the checklist is for before the
// decision, not to justify it afterwards (two timelines, left to right)
export function mistakeAfter({ shot }) {
  const t = useT(), af = ev(shot, 'after', 3.7), pv = ev(shot, 'prove', 6.4), bf = ev(shot, 'before', 9.8), js = ev(shot, 'justify', 12.0);
  const box = (x, y, k, ticks, tone, lab) => <div style={{ position: 'absolute', left: x, top: y, width: 400, height: 170, ...glass(tone), opacity: k, transform: `translateY(${(1 - k) * 20}px)`, ...center, flexDirection: 'column', gap: 14, ...rtl }}>
    <span style={txt(30, 900, C.ink)}>{lab}</span><div style={{ display: 'flex', gap: 8 }}>{L7.map((_, i) => <div key={i} style={{ width: 36, height: 36, borderRadius: 7, border: `3px solid ${i < ticks ? C.green : C.mute}`, ...center }}>{i < ticks && <Ico n="check" s={30} c={C.green} sw={13} />}</div>)}</div></div>;
  const pill = (x, y, k, text, col) => <div style={{ position: 'absolute', left: x, top: y + 40, width: 300, height: 90, borderRadius: 20, background: col, opacity: k, transform: `scale(${0.85 + 0.15 * k})`, ...center, ...txt(40, 900, '#fff'), ...rtl }}>{text}</div>;
  const fast = Math.floor(7 * prog(t, pv - 0.4, 1.0));
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 260, top: 130, display: 'flex', alignItems: 'center', gap: 16, opacity: pop(t, 0.1), ...rtl }}><div style={{ transform: `scale(${1 + 0.12 * Math.max(0, Math.sin(t * 5)) * (1 - pop(t, af))})` }}><Ico n="warn" s={64} c={C.red} sw={8} /></div><span style={txt(56, 900, C.ink)}>اشتباه رایج</span><span style={{ ...txt(34, 800, C.mute), opacity: pop(t, 1.2) }}>خیلی‌ها…</span></div>
    <AbsoluteFill style={{ opacity: 1 - 0.55 * pop(t, bf) }}>
      {pill(300, 250, pop(t, 0.8), 'ورود', C.red)}{box(760, 250, pop(t, 1.6) * (0.45 + 0.55 * pop(t, af)), fast, C.red, 'بعد از ورود: پر کردن چک‌لیست')}
      <SVG><Arrow x1={620} y1={335} x2={740} y2={335} c={C.red} w={6} head={16} p={prog(t, af - 0.2, 0.4)} /><XMark x={1240} y={335} r={40} k={pop(t, af + 0.5)} /></SVG>
      <Chip text="تا ثابت کنند کار درستی کرده‌اند" k={pop(t, pv)} x={1300} y={300} size={28} tone={C.red} color={C.red} />
    </AbsoluteFill>
    {box(300, 500, pop(t, bf), 7 * (t > bf + 0.6 ? 1 : 0), C.green, 'قبل از تصمیم: چک‌لیست')}{pill(860, 500, pop(t, bf + 0.6), 'تصمیم', C.green)}
    <SVG><Arrow x1={720} y1={585} x2={840} y2={585} c={C.green} w={6} head={16} p={prog(t, bf + 0.2, 0.4)} /><Check x={1240} y={585} r={40} k={pop(t, bf + 1.0)} /></SVG>
    <Chip text="برای قبل از تصمیم، نه برای توجیه بعد از آن" k={pop(t, js)} y={750} size={36} tone={C.gold} color={C.gold2} />
  </AbsoluteFill>;
}
// 17. practice: this week every day in the New York session open the gold chart and fill the seven-step checklist for your own scenario;
// only on paper or a demo account; journal how many ticks and whether the decision was enter or wait; not a buy or sell order
export function practice3({ shot }) {
  const t = useT(), wk = ev(shot, 'week', 2.3), ny = ev(shot, 'ny', 3.9), ch = ev(shot, 'chart', 4.7), ow = ev(shot, 'own', 7.1), fl = ev(shot, 'fill', 9.9), pa = ev(shot, 'paper', 11.7), dm = ev(shot, 'demo', 12.4), jr = ev(shot, 'journal', 14.3), dc = ev(shot, 'decision', 17.6), no = ev(shot, 'notorder', 21.4);
  const D = ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'], N = [7, 5, 6, 3, 7];
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <SVG>{Array.from({ length: 40 }, (_, i) => <line key={'v' + i} x1={i * 50} x2={i * 50} y1={0} y2={1080} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}
      {Array.from({ length: 22 }, (_, i) => <line key={'h' + i} x1={0} x2={1920} y1={i * 50} y2={i * 50} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}</SVG>
    <div style={{ position: 'absolute', left: 280, top: 150, width: 780, height: 640, background: '#F6EEDC', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(-1.5deg) translateY(${(1 - pop(t, wk)) * 30}px)`, opacity: pop(t, wk), padding: '22px 34px', ...rtl }}>
      <div style={txt(36, 900, '#5A4A1A')}>{t > jr ? 'ژورنال این هفته' : 'تمرین این هفته'}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 18, ...txt(26, 900, '#5A4A1A') }}><span style={{ width: 190 }}>روز</span><span style={{ width: 230, textAlign: 'center' }}>تیک‌ها</span><span style={{ width: 220, textAlign: 'center' }}>تصمیم</span></div>
      {D.map((d, i) => <div key={i} style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', borderTop: '1px solid rgba(90,74,26,0.25)', paddingTop: 12, opacity: pop(t, wk + 0.3 + i * 0.15) }}>
        <span style={{ width: 190, ...txt(28, 800, '#5A4A1A') }}>{d}</span>
        <span style={{ width: 230, textAlign: 'center', ...txt(30, 900, N[i] === 7 ? '#1E7A6E' : '#8A5A10'), opacity: t > fl + i * 0.6 ? 1 : 0 }}>{`${faNum(N[i])} از ۷`}</span>
        <span style={{ width: 220, display: 'flex', justifyContent: 'center', opacity: t > dc + i * 0.5 ? 1 : 0 }}><span style={{ padding: '2px 22px 6px', borderRadius: 10, background: N[i] === 7 ? '#1E7A6E' : '#B8860B', ...txt(28, 900, '#fff') }}>{N[i] === 7 ? 'ورود' : 'صبر'}</span></span></div>)}
      <div style={{ marginTop: 26, ...txt(24, 800, 'rgba(90,74,26,0.7)'), opacity: pop(t, dc + 2.5) }}>یک تیک کم = صبر</div></div>
    <Chip text="هر روز، سشن نیویورک" k={pop(t, ny)} x={1150} y={160} size={32} icon={<Ico n="clock" s={32} c={C.gold2} sw={9} />} />
    <SVG><Laptop x={1430} y={400} s={1.25} k={pop(t, ch)} /></SVG>
    <div style={{ position: 'absolute', left: 1300, top: 500, width: 260, textAlign: 'center', ...txt(28, 900, '#F6EEDC'), opacity: pop(t, ch), ...rtl }}>چارت طلا</div>
    <Chip text="سناریوی خودت + چک‌لیست ۷ قدمی" k={slot(t, ow, pa - 0.1)} x={1150} y={570} size={28} />
    <Chip text="فقط روی کاغذ" k={pop(t, pa)} x={1150} y={570} size={30} tone={C.green} color={C.green} />
    <Chip text="یا حساب آزمایشی" k={pop(t, dm)} x={1460} y={570} size={30} tone={C.green} color={C.green} />
    <Chip text="ژورنال: چند تیک؟ ورود یا صبر؟" k={pop(t, jr)} x={1150} y={655} size={28} />
    <Chip text="این درس دستور خرید یا فروش نیست" k={pop(t, no)} x={1150} y={740} size={28} tone={C.red} color={C.red} icon={<Ico n="warn" s={30} c={C.red} sw={9} />} />
  </AbsoluteFill>;
}
// 18. summary (two shots): the seven steps light one by one; one tick missing = wait; the risk always stays fixed
export function summaryL3({ shot }) {
  const t = useT(), rows = shot.rows || [0, 1, 2, 3, 4, 5, 6], keys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], sv7 = ev(shot, 'seven', 1e9), wt = ev(shot, 'wait', 1e9), rk = ev(shot, 'risk', 1e9);
  return <AbsoluteFill>
    <H shot={shot} at={0.1} />
    {L7.map((s, i) => { const mine = rows.includes(i), at = mine ? ev(shot, keys[i], 1 + rows.indexOf(i) * 1.2) : (i < rows[0] ? -1 : 1e9), k = mine ? pop(t, at - 0.2) : i < rows[0] ? 1 : 0, on = t > at, x = i < 4 ? 980 : 300, y = 240 + (i % 4) * 112;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 640, height: 92, borderRadius: 18, ...glass(on ? C.gold : 'rgba(255,255,255,0.15)'), opacity: mine ? 0.25 + 0.75 * k : i < rows[0] ? 0.6 : 0.2, transform: `translateX(${(1 - k) * 30}px)`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', ...rtl }}>
        <div style={{ width: 58, height: 58, borderRadius: 29, flex: 'none', background: on ? 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)' : 'rgba(255,255,255,0.08)', ...center, ...txt(30, 900, on ? '#1b1203' : C.mute) }}>{faNum(i + 1)}</div>
        <span style={txt(36, 900, on ? C.ink : C.mute)}>{s}</span>{on && <span style={{ marginRight: 'auto' }}><Ico n="check" s={40} c={C.green} sw={11} /></span>}</div>; })}
    <Chip text="تصمیم ورود = هفت قدم" k={pop(t, sv7)} y={730} size={38} />
    <Chip text="یک تیک کم = صبر" k={pop(t, wt)} x={300} y={600} size={38} tone={C.gold} color={C.gold2} icon={<Ico n="pause" s={38} c={C.gold2} sw={9} />} />
    <Chip text="ریسک همیشه ثابت" k={pop(t, rk)} y={730} size={38} tone={C.green} color={C.green} icon={<Ico n="shield" s={38} c={C.green} sw={9} />} />
  </AbsoluteFill>;
}
// 19. next lesson: managing the open trade: when to move the stop, when to let the trade breathe
export function nextManageL3({ shot }) {
  const t = useT(), mg = ev(shot, 'manage', 3.8), sl = ev(shot, 'sl', 6.3), br = ev(shot, 'breathe', 10.1), mv = ease(prog(t, sl + 0.3, 1.4)), lung = 1 + 0.12 * Math.sin((t - br) * 2.2) * (t > br ? 1 : 0);
  const UP = [[300, 0], [380, 0.5], [450, 0.2], [560, 1.2], [630, 0.9], [740, 1.9], [800, 1.6], [900, 2.4], [960, 2.1], [1060, 2.8]];
  return <AbsoluteFill>
    <H shot={shot} at={0.1} />
    <SVG><Lv r={0} c="rgba(237,230,214,0.55)" lab="ورود" dash="8 7" w={3} x2={1100} k={pop(t, 0.6)} />
      <Lv r={-1 + mv} c={mv > 0.98 ? C.gold2 : C.red} lab={mv > 0.98 ? 'سربه‌سر' : 'حد ضرر'} x2={1100} k={pop(t, 0.8)} />
      <Path pts={rPts(UP, prog(t, 0.8, Math.max(2, mg - 0.6)))} w={6} />
      <Arrow x1={270} y1={ry(-1) - 10} x2={270} y2={ry(0) + 14} c={C.gold2} w={6} head={16} p={prog(t, sl, 0.8)} />
      <g transform={`translate(1060 ${ry(2.8)}) scale(${lung})`} opacity={pop(t, br)}><circle r={70} fill="rgba(38,166,154,0.12)" stroke={C.green} strokeWidth={4} /><circle r={46} fill="none" stroke={C.green} strokeWidth={2} opacity={0.6} /></g></SVG>
    <PosCard x={1420} y={250} v={2.8 * prog(t, mg, 1.0)} k={pop(t, mg)} status="معامله باز" />
    <Chip text="کی حد ضرر را جابجا کنیم؟" k={pop(t, sl)} x={1250} y={560} size={30} tone={C.gold} color={C.gold2} />
    <Chip text="کی بگذاریم معامله نفس بکشد؟" k={pop(t, br)} x={1250} y={650} size={30} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// CTA: like, subscribe and the bell on YouTube (no Instagram line in this lesson's narration)
export function ctaIG({ shot }) {
  const t = useT(), k = pop(t, 0.2);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 660, top: 120, width: 600, height: 600 * 758 / 1320, borderRadius: 22, overflow: 'hidden', border: `3px solid ${C.gold}`, boxShadow: '0 30px 90px rgba(0,0,0,0.6)', opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
      <Img src={staticFile('yt_channel.jpg')} style={{ width: '100%', height: '100%' }} /></div>
    <div style={{ position: 'absolute', left: 400, right: 400, top: 490, height: 190, borderRadius: 28, ...glass(C.gold), opacity: pop(t, 0.5) }} />
    <ChannelButtons t={t} like={ev(shot, 'like', 2.0)} sub={ev(shot, 'sub', 4.0)} bell={ev(shot, 'bell', 5.5)} y={530} />
    <Chip text="تا هیچ درسی از دست نرود" k={pop(t, ev(shot, 'bell', 5.5) + 0.8)} y={720} size={34} />
  </AbsoluteFill>;
}
export function outro() { return <BrandOutro course="سطح ۳ · درس ۹: ورود یا صبر؟" badge="سطح ۳" />; }

// ==== the prop-firm special (prop firms for Afghans): seven sections with chapter cards; the owner's 14 on-screen texts appear on the
// sentences that say them (the caption bar at the bottom of the content area). Money in dollars with Persian digits; green = allowed / ok,
// red = refused / danger, gold = the firm and the key numbers. Every screen of a firm, a wallet or a calendar is a drawing marked «مثال فرضی»;
// no logo of a real company is drawn, the one firm named (FundedNext) appears only as text, as in the owner's script. ====
const fmt = v => faNum(Math.round(v).toLocaleString('en-US'));
const GL = {
  dollar: 'M50 12 L50 88 M68 28 C60 20 34 20 32 34 C30 48 68 46 68 62 C68 78 40 80 30 70',
  card: 'M12 24 L88 24 L88 76 L12 76 Z M34 40 A 8 8 0 1 1 34.1 40 M24 66 C26 56 42 56 44 66 M54 42 L78 42 M54 54 L74 54',
  camera: 'M14 32 L36 32 L42 20 L58 20 L64 32 L86 32 L86 80 L14 80 Z M50 42 A 13 13 0 1 1 49.9 42',
  home: 'M14 50 L50 18 L86 50 M24 42 L24 84 L76 84 L76 42 M42 84 L42 62 L58 62 L58 84',
  wallet: 'M14 28 L80 28 L80 80 L14 80 Z M80 42 L90 42 L90 66 L80 66 M66 54 L70 54',
  link: 'M44 56 L56 44 M38 48 L28 58 A 10 10 0 0 0 42 72 L52 62 M62 52 L72 42 A 10 10 0 0 0 58 28 L48 38',
  robot: 'M24 34 L76 34 L76 78 L24 78 Z M40 52 L40 56 M60 52 L60 56 M40 68 L60 68 M50 34 L50 22 M50 16 L50 18 M14 50 L24 50 M76 50 L86 50',
  fire: 'M50 88 C30 88 22 72 26 58 C30 46 40 42 40 26 C52 34 58 46 56 56 C62 52 64 46 64 40 C74 50 78 62 74 72 C70 82 62 88 50 88 Z',
  globe: 'M50 14 A 36 36 0 1 1 49.9 14 M50 14 C34 30 34 70 50 86 M50 14 C66 30 66 70 50 86 M14 50 L86 50 M20 32 C40 38 60 38 80 32 M20 68 C40 62 60 62 80 68',
  chat: 'M14 20 L86 20 L86 66 L46 66 L28 82 L30 66 L14 66 Z M30 38 L70 38 M30 50 L58 50',
  lock: 'M24 46 L76 46 L76 86 L24 86 Z M34 46 L34 34 C34 16 66 16 66 34 L66 46 M50 60 L50 70',
  doc: 'M26 12 L62 12 L78 28 L78 88 L26 88 Z M62 12 L62 28 L78 28 M36 46 L68 46 M36 58 L68 58 M36 70 L58 70',
  trophy: 'M32 18 L68 18 L66 46 C64 58 36 58 34 46 Z M34 26 C18 26 20 44 34 42 M66 26 C82 26 80 44 66 42 M50 58 L50 72 M36 84 L64 84 L60 72 L40 72 Z',
  calendar: 'M14 22 L86 22 L86 84 L14 84 Z M14 38 L86 38 M32 12 L32 28 M68 12 L68 28 M30 54 L34 54 M48 54 L52 54 M66 54 L70 54 M30 70 L34 70 M48 70 L52 70',
  power: 'M34 28 A 28 28 0 1 0 66 28 M50 12 L50 50',
  news: 'M14 22 L86 22 L86 80 L14 80 Z M24 36 L52 36 M24 50 L76 50 M24 64 L76 64 M62 30 L76 30 L76 42 L62 42 Z',
  moon: 'M62 16 A 34 34 0 1 0 84 62 A 28 28 0 1 1 62 16 Z',
  cart: 'M10 20 L24 20 L34 64 L78 64 L88 32 L28 32 M40 76 A 6 6 0 1 1 39.9 76 M72 76 A 6 6 0 1 1 71.9 76',
  angry: 'M50 14 A 36 36 0 1 1 49.9 14 M30 36 L44 42 M70 36 L56 42 M36 70 C42 60 58 60 64 70',
  usdt: 'M50 14 A 36 36 0 1 1 49.9 14 M30 32 L70 32 M50 32 L50 74 M34 48 C40 54 60 54 66 48',
  passport: 'M24 12 L76 12 L76 88 L24 88 Z M50 30 A 12 12 0 1 1 49.9 30 M38 42 L62 42 M50 30 C44 36 44 48 50 54 M50 30 C56 36 56 48 50 54 M36 70 L64 70',
  share: 'M72 14 A 10 10 0 1 1 71.9 14 M28 40 A 10 10 0 1 1 27.9 40 M72 66 A 10 10 0 1 1 71.9 66 M37 45 L63 29 M37 55 L63 71',
  search: 'M42 18 A 24 24 0 1 1 41.9 18 M60 60 L84 84',
  save: 'M18 14 L70 14 L86 30 L86 86 L18 86 Z M32 14 L32 36 L66 36 L66 14 M32 86 L32 58 L72 58 L72 86',
  star: 'M50 12 L61 38 L88 40 L67 58 L74 86 L50 70 L26 86 L33 58 L12 40 L39 38 Z',
  gate: 'M14 86 L14 30 L86 30 L86 86 M14 30 L50 14 L86 30 M30 44 L30 86 M50 44 L50 86 M70 44 L70 86',
  bank: 'M12 38 L50 16 L88 38 Z M20 44 L20 76 M40 44 L40 76 M60 44 L60 76 M80 44 L80 76 M12 84 L88 84',
  bulb: 'M50 12 C30 12 22 30 30 46 C34 54 38 58 38 66 L62 66 C62 58 66 54 70 46 C78 30 70 12 50 12 Z M40 76 L60 76 M44 86 L56 86',
  key: 'M30 30 A 16 16 0 1 1 29.9 30 M42 42 L84 84 M70 70 L78 62 M60 60 L68 52',
  money: 'M10 28 L90 28 L90 72 L10 72 Z M50 38 A 12 12 0 1 1 49.9 38 M20 38 L20 62 M80 38 L80 62',
  rise: 'M14 80 L40 54 L56 66 L86 28 M66 28 L86 28 L86 48',
};
const Gly = ({ n, s = 60, c = C.gold2, sw = 7, fill = 'none' }) => <svg width={s} height={s} viewBox="0 0 100 100" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d={GL[n]} /></svg>;
const ICON = (n, s, c, sw) => (GL[n] ? <Gly n={n} s={s} c={c} sw={sw} /> : <Ico n={n} s={s} c={c} sw={sw} />);
// the caption bar: one of the owner's on-screen texts, at the bottom of the content area
const Cap = ({ text, k, tone = C.gold, color = C.ink, y = 742, size = 36 }) => k > 0.01 && <div style={{ position: 'absolute', left: 0, right: 0, top: y, ...center, opacity: clamp(k), transform: `translateY(${(1 - clamp(k)) * 18}px)` }}>
  <div style={{ ...glass(tone), padding: '12px 34px 16px', ...txt(size, 900, color), ...rtl, maxWidth: 1600, whiteSpace: 'nowrap' }}>{text}</div></div>;
const Badge = ({ text, size = 34 }) => <span style={{ padding: '6px 22px 10px', borderRadius: 16, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...txt(size, 900, '#1b1203') }}>{text}</span>;
const OkMark = ({ ok, s = 40, k = 1 }) => k > 0.01 && <div style={{ width: s, height: s, borderRadius: s / 2, flex: 'none', background: ok ? C.green : C.red, ...center, opacity: clamp(k), transform: `scale(${0.6 + 0.4 * clamp(k)})` }}><Ico n={ok ? 'check' : 'cross'} s={s * 0.7} c="#fff" sw={14} /></div>;
// a numbered header for the criteria, rules and steps: «معیار ۱: سابقه»
const NumHead = ({ n, label, t, at = 0.1, w = 'auto' }) => <div style={{ position: 'absolute', left: 260, top: 128, display: 'flex', alignItems: 'center', gap: 18, opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * -30}px)`, ...rtl }}>
  <div style={{ width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)', ...center, ...txt(40, 900, '#1b1203'), flex: 'none' }}>{faNum(n)}</div>
  <span style={txt(50, 900, C.ink)}>{label}</span></div>;
// a side list (right): rows; rows before n are ticked, row n is current (ticks at `tick`), rows after are waiting
const SideList = ({ title, rows, n, t, tick = 1e9, x = 1440, y = 240, w = 400, size = 26, k = 1, bad = false }) => k > 0.01 && <div style={{ position: 'absolute', left: x, top: y, width: w, borderRadius: 20, ...glass(bad ? C.red : C.gold), opacity: k, transform: `translateY(${(1 - k) * 20}px)`, padding: '16px 20px 18px', ...rtl }}>
  <div style={txt(size + 4, 900, bad ? C.red : C.gold2)}>{title}</div>
  {rows.map((r, i) => { const cur = i === n - 1, d = i < n - 1 || (cur && t > tick);
    return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7, padding: '4px 10px', borderRadius: 10, background: cur ? (bad ? 'rgba(230,50,18,0.14)' : 'rgba(232,201,106,0.13)') : 'transparent' }}>
      <div style={{ width: size + 6, height: size + 6, borderRadius: 8, border: `3px solid ${d ? (bad ? C.red : C.green) : cur ? (bad ? C.red : C.gold2) : C.mute}`, ...center, flex: 'none' }}>{d && <Ico n={bad ? 'cross' : 'check'} s={size} c={bad ? C.red : C.green} sw={12} />}</div>
      <span style={txt(size, 800, d ? C.ink : cur ? (bad ? C.red : C.gold2) : C.mute)}>{`${faNum(i + 1)}. ${r}`}</span></div>; })}</div>;
const Panel = ({ x, y, w, h, k = 1, tone = 'rgba(255,255,255,0.14)', title = null, hypo = false, children }) => k > 0.01 && <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, background: '#131722', border: `2px solid ${tone}`, boxShadow: '0 24px 70px rgba(0,0,0,0.55)', opacity: clamp(k), transform: `translateY(${(1 - clamp(k)) * 24}px)`, overflow: 'hidden', ...rtl }}>
  {title && <div style={{ height: 52, background: '#0F121A', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', ...txt(24, 800, 'rgba(237,230,214,0.8)') }}>
    <span style={{ display: 'flex', gap: 8, direction: 'ltr', marginLeft: 'auto', order: 2 }}>{['#EF5350', '#E8C96A', '#26A69A'].map(c => <i key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, display: 'block' }} />)}</span>
    <span>{title}</span>{hypo && <span style={{ ...txt(17, 900, C.gold2), border: '1.5px solid rgba(232,201,106,0.6)', borderRadius: 8, padding: '1px 10px 3px' }}>مثال فرضی</span>}</div>}
  {children}</div>;
const SECT = ['پراپ‌فرم چیست؟', 'افغان‌ها از کجا برداشت می‌گیرند؟', 'چطور پراپ‌فرم درست انتخاب کنیم؟', 'قانون‌های آزمون، دقیق', 'احراز هویت و گرفتن برداشت', 'دام‌ها و کلاهبرداری‌ها', 'استراتژی من برای قبولی'];
const CRIT = ['سابقه', 'کشور', 'برداشت با تتر', 'قانون ساده', 'بازار و پلتفرم'];
const KYC = ['مدرک معتبر', 'عکس زنده', 'مدرک آدرس', 'درخواست برداشت', 'آدرس کیف‌پول'];
const TRAPS = ['شرکت جعلی', 'فروش پاس', 'ربات معجزه', 'خرید پشت‌سرهم'];
const STRAT = ['ریسک ۰٫۵٪', 'حد روزانه ۱٫۵٪', 'بدون عجله', 'روش تست‌شده', 'کوچک شروع کن'];
const keyOf = (shot, keys, i, d) => ev(shot, keys[i], d);

// chapter card: «بخش N از ۷», the title, seven segments (RTL), optional chips (c1..c4)
export function chapter({ shot }) {
  const t = useT(), n = shot.n, k = pop(t, 0.1), k2 = pop(t, 0.4), chips = shot.chips || [];
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 40, ...center, opacity: 0.06 * k, ...txt(620, 900, C.gold2) }}>{faNum(n)}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 230, ...center, flexDirection: 'column', gap: 26, ...rtl }}>
      <div style={{ opacity: k, transform: `scale(${0.85 + 0.15 * k})` }}><Badge text={`بخش ${faNum(n)} از ۷`} size={42} /></div>
      <div style={{ ...txt(92, 900, C.ink), opacity: k2, transform: `translateY(${(1 - k2) * 26}px)` }}>{SECT[n - 1]}</div></div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 560, ...center, gap: 16, direction: 'rtl' }}>
      {SECT.map((_, i) => { const kk = pop(t, 0.5 + i * 0.06), on = i < n, curr = i === n - 1;
        return <div key={i} style={{ width: 150, height: 14, borderRadius: 7, background: on ? (curr ? C.gold2 : C.green) : 'rgba(255,255,255,0.12)', opacity: kk, boxShadow: curr ? `0 0 ${16 + 10 * Math.sin(t * 4)}px ${C.gold2}` : 'none' }} />; })}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 650, ...center, gap: 18, ...rtl }}>
      {chips.map((c, i) => { const kk = pop(t, ev(shot, `c${i + 1}`, 1.2 + i * 0.4)); return <div key={i} style={{ ...glass(C.red), padding: '10px 26px 14px', ...txt(32, 900, C.ink), opacity: kk, transform: `translateY(${(1 - kk) * 16}px)` }}>{`${faNum(i + 1)}. ${c}`}</div>; })}</div>
  </AbsoluteFill>;
}
// 1. hook: 50 or 100 dollars -> a 100,000-dollar account (the number counts up); without your own money in the market; sounds good?
export function hook100({ shot }) {
  const t = useT(), hd = ev(shot, 'hundred', 0.8), ac = ev(shot, 'acct', 2.4), ow = ev(shot, 'own', 4.6), gd = ev(shot, 'good', 7.4), v = 100000 * ease(prog(t, ac - 0.2, 1.6));
  return <AbsoluteFill>
    <Cap text="با ۱۰۰ دلار → حساب ۱۰۰,۰۰۰ دلاری؟" k={pop(t, ac + 0.6)} y={150} size={44} />
    <div style={{ position: 'absolute', left: 270, top: 330, width: 420, height: 300, ...glass(C.green), ...center, flexDirection: 'column', gap: 10, opacity: pop(t, 0.2), ...rtl }}>
      <div style={{ position: 'relative', width: 260, height: 120 }}>{[0, 1, 2].map(i => <div key={i} style={{ position: 'absolute', left: 20 + i * 18, top: 10 + i * 14, width: 200, height: 90, borderRadius: 10, background: '#1E7A50', border: '3px solid #8FE3B0', transform: `rotate(${-8 + i * 6}deg)`, ...center }}><Gly n="dollar" s={58} c="#CFF5DC" sw={9} /></div>)}</div>
      <span style={{ ...txt(44, 900, C.green), opacity: pop(t, hd) }}>۵۰ یا ۱۰۰ دلار</span></div>
    <SVG><Arrow x1={720} y1={480} x2={900} y2={480} c={C.gold2} w={9} head={26} p={prog(t, ac - 0.4, 0.6)} /></SVG>
    <div style={{ position: 'absolute', left: 930, top: 300, width: 760, height: 360, ...glass(C.gold), ...center, flexDirection: 'column', gap: 8, opacity: pop(t, ac - 0.3), ...rtl }}>
      <span style={txt(34, 800, C.mute)}>حساب</span>
      <span style={{ fontFamily: NUM, fontWeight: 900, fontSize: 150, color: C.gold2, direction: 'ltr', textShadow: '0 0 40px rgba(232,201,106,0.45)' }}>{`${fmt(v)}$`}</span>
      <span style={{ ...txt(38, 900, C.ink), opacity: pop(t, gd) }}>خیلی خوب به نظر می‌رسد، نه؟</span></div>
    <Chip text="بدون پول خودت در بازار" k={pop(t, ow)} y={700} size={38} tone={C.green} color={C.green} icon={<Ico n="shield" s={36} c={C.green} sw={9} />} />
  </AbsoluteFill>;
}
// 2. most fail: ten people, nine turn red; «۹۰٪ رد می‌شوند»
export function failStat({ shot }) {
  const t = useT(), bt = ev(shot, 'but', 0.3), ms = ev(shot, 'most', 1.4), fl = ev(shot, 'fail', 2.6);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 200, ...center, gap: 34, direction: 'ltr' }}>
      {Array.from({ length: 10 }, (_, i) => { const red = i < 9 && t > fl + i * 0.08, k = pop(t, bt + i * 0.06);
        return <div key={i} style={{ position: 'relative', opacity: k, transform: `translateY(${(1 - k) * 20 + (red ? 10 : 0)}px)` }}><Ico n="user" s={120} c={red ? C.red : i === 9 && t > fl + 1 ? C.green : C.ink} sw={6} />
          {red && <div style={{ position: 'absolute', left: 36, top: 132 }}><OkMark ok={false} s={46} k={pop(t, fl + i * 0.08)} /></div>}{i === 9 && <div style={{ position: 'absolute', left: 36, top: 132 }}><OkMark ok s={46} k={pop(t, fl + 1)} /></div>}</div>; })}</div>
    <Chip text="بیشتر کسانی که آزمون می‌دهند…" k={slot(t, ms, fl + 0.6)} y={480} size={38} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 470, ...center, opacity: pop(t, fl + 0.6), transform: `scale(${0.85 + 0.15 * pop(t, fl + 0.6)})`, ...txt(130, 900, C.red), ...rtl }}>۹۰٪ رد می‌شوند</div>
  </AbsoluteFill>;
}
// the outline of Afghanistan (map15.json), drawn in; tone red or gold
const AfgShape = ({ x, y, w = 520, t, at = 0, tone = C.gold2, fill = 0.2 }) => { const k = prog(t, at, 1.6), h = w * 355 / 475;
  return <svg style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }} width={w} height={h} viewBox="515 70 475 355">
    <path d={MAP.afg} fill={tone === C.red ? `rgba(230,50,18,${fill * k})` : `rgba(212,175,55,${fill * k})`} stroke={tone} strokeWidth={4} strokeLinejoin="round" pathLength={1000} style={{ strokeDasharray: `${1000 * clamp(k * 1.1)} 1000`, filter: `drop-shadow(0 0 10px ${tone === C.red ? 'rgba(230,50,18,0.5)' : 'rgba(232,201,106,0.45)'})` }} /></svg>; };
// 3. for us Afghans a more important question: does the withdrawal reach us at all?
export function afgQuestion({ shot }) {
  const t = useT(), us = ev(shot, 'us', 0.4), q = ev(shot, 'q', 2.2), wd = ev(shot, 'wd', 3.0);
  return <AbsoluteFill>
    <AfgShape x={1020} y={190} w={640} t={t} at={us - 0.3} />
    <div style={{ position: 'absolute', left: 1180, top: 330, ...txt(56, 900, C.ink), opacity: pop(t, us + 0.6) }}>افغانستان</div>
    <div style={{ position: 'absolute', left: 1380, top: 410, ...txt(170, 900, C.gold2), opacity: pop(t, q), transform: `scale(${0.7 + 0.3 * pop(t, q)}) rotate(${6 * Math.sin(t * 2)}deg)` }}>؟</div>
    <div style={{ position: 'absolute', left: 260, top: 250, ...txt(52, 900, C.mute), opacity: pop(t, us), ...rtl }}>برای ما افغان‌ها…</div>
    <div style={{ position: 'absolute', left: 260, top: 360, width: 700, ...txt(66, 900, C.ink), whiteSpace: 'normal', lineHeight: 1.45, opacity: pop(t, q), ...rtl }}>آیا اصلاً <span style={{ color: C.gold2 }}>برداشت</span> به ما می‌رسد؟</div>
    <SVG><g opacity={pop(t, wd)}>{[0, 1, 2].map(i => { const p = ((t - wd) * 0.45 + i / 3) % 1; return <g key={i} transform={`translate(${380 + 620 * p} ${640 - 60 * Math.sin(p * Math.PI)})`} opacity={Math.sin(p * Math.PI)}><circle r={26} fill={C.gold} stroke="#7A5A10" strokeWidth={3} /><text y={10} textAnchor="middle" style={nv(28, '#3A2A06', 900)}>$</text></g>; })}</g></SVG>
  </AbsoluteFill>;
}
// 4. today, everything, honestly: six topic tiles (2 x 3, read right to left)
const AG = [['what', 'bulb', 'پراپ‌فرم چیست؟'], ['where', 'globe', 'افغان‌ها: برداشت از کجا؟'], ['reg', 'card', 'ثبت‌نام و احراز هویت'], ['usdt', 'usdt', 'سود با تتر'], ['traps', 'warn', 'دام‌ها و کلاهبرداری'], ['strat', 'trophy', 'استراتژی قبولی']];
export function agenda({ shot }) {
  const t = useT(), hn = ev(shot, 'honest', 2.4);
  return <AbsoluteFill>
    <Chip text="امروز: همه چیز، از اول تا آخر" k={pop(t, 0.1)} y={140} size={40} />
    <Chip text="شرکت‌های تأمین سرمایه = پراپ‌فرم" k={slot(t, ev(shot, 'firms', 1.5), hn - 0.1)} y={235} size={34} />
    <Chip text="صادقانه، بدون وعده دروغ" k={pop(t, hn)} y={235} size={34} tone={C.green} color={C.green} icon={<Ico n="shield" s={34} c={C.green} sw={9} />} />
    {AG.map(([k0, g, lab], i) => { const at = ev(shot, k0, 4 + i * 1.3), k = pop(t, at), x = 1270 - (i % 3) * 470, y = 350 + Math.floor(i / 3) * 210;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 430, height: 180, ...glass(t > at ? C.gold : 'rgba(255,255,255,0.12)'), opacity: 0.25 + 0.75 * k, transform: `translateY(${(1 - k) * 20}px)`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', ...rtl }}>
        {ICON(g, 66, t > at ? C.gold2 : C.mute, 7)}<span style={txt(34, 900, t > at ? C.ink : C.mute)}>{lab}</span></div>; })}
  </AbsoluteFill>;
}
// 5. watch to the end: one small mistake can burn all your money (a bill catches fire)
export function burn({ shot }) {
  const t = useT(), en = ev(shot, 'end', 0.6), ms = ev(shot, 'mistake', 2.2), bn = ev(shot, 'burn', 4.6), b = prog(t, bn - 0.6, 1.8);
  return <AbsoluteFill>
    <Big text="این ویدیو را تا آخر ببین" k={pop(t, en)} y={150} size={70} color={C.gold2} icon={<Ico n="eye" s={70} c={C.gold2} sw={8} />} />
    <div style={{ position: 'absolute', left: 700, top: 330, width: 520, height: 240, borderRadius: 14, background: '#1E7A50', border: '4px solid #8FE3B0', overflow: 'hidden', opacity: pop(t, ms - 0.4), transform: `rotate(-4deg)` }}>
      <div style={{ position: 'absolute', inset: 0, ...center }}><span style={{ fontFamily: NUM, fontWeight: 900, fontSize: 110, color: '#CFF5DC' }}>$</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${100 * b}%`, background: 'linear-gradient(0deg, #0D1117 60%, rgba(230,90,18,0.9) 85%, rgba(255,190,60,0.6))' }} /></div>
    <div style={{ position: 'absolute', left: 860, top: 300 + 240 * (1 - b), opacity: b > 0.02 ? 1 : 0, transform: `scale(${1 + 0.08 * Math.sin(t * 12)})` }}><Gly n="fire" s={200} c="#FF8A1F" sw={6} fill="rgba(255,120,30,0.35)" /></div>
    <Chip text="یک اشتباه کوچک = سوختن همه پول" k={pop(t, ms)} y={660} size={42} tone={C.red} color={C.red} />
  </AbsoluteFill>;
}
// 6. hello: Kamal in the gold ring, name and title
export function hello({ shot }) {
  const t = useT(), k = pop(t, 0.1), nm = ev(shot, 'name', 0.8), tt = ev(shot, 'title', 2.0), ring = prog(t, 0.2, 1.2);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 300, top: 200, width: 440, height: 440, opacity: k, transform: `scale(${0.9 + 0.1 * k})` }}>
      <Img src={staticFile('kamal.jpg')} style={{ position: 'absolute', left: 26, top: 26, width: 388, height: 388, borderRadius: '50%', objectFit: 'cover' }} />
      <svg style={{ position: 'absolute', inset: 0 }} width={440} height={440}><circle cx={220} cy={220} r={206} fill="none" stroke={C.gold2} strokeWidth={10} strokeDasharray={1295} strokeDashoffset={1295 * (1 - ring)} transform="rotate(-90 220 220)" strokeLinecap="round" /></svg></div>
    <div style={{ position: 'absolute', left: 820, top: 300, display: 'flex', flexDirection: 'column', gap: 18, ...rtl }}>
      <span style={{ ...txt(46, 800, C.mute), opacity: pop(t, 0.2) }}>سلام، من</span>
      <span style={{ ...txt(96, 900, C.ink), opacity: pop(t, nm) }}>کمال حقجو</span>
      <span style={{ ...txt(44, 800, C.gold2), opacity: pop(t, tt) }}>مربی و تحلیل‌گر بازارهای مالی</span></div>
  </AbsoluteFill>;
}
// 7. a prop firm gives its capital to traders, but not to everyone: first prove you can (a gate between the firm and the trader)
export function firmGives({ shot }) {
  const t = useT(), fm = ev(shot, 'firm', 0.4), cp = ev(shot, 'capital', 1.6), na = ev(shot, 'notall', 3.6), pv = ev(shot, 'prove', 5.0), blocked = t > na;
  return <AbsoluteFill>
    <Building x={260} y={260} s={1.15} label="پراپ‌فرم" o={pop(t, fm)} q={prog(t, fm, 1.2)} />
    <div style={{ position: 'absolute', left: 1480, top: 330, opacity: pop(t, cp), ...center, flexDirection: 'column', gap: 10 }}><Ico n="user" s={190} c={C.ink} sw={5} /><span style={txt(36, 900, C.ink)}>معامله‌گر</span></div>
    <SVG>{[0, 1, 2, 3].map(i => { const p = ((t - cp) * 0.5 + i / 4) % 1, stop = blocked ? Math.min(p, 0.55) : p, x = 640 + 800 * stop; return t > cp && <g key={i} transform={`translate(${x} ${470 - 50 * Math.sin(stop * Math.PI)})`} opacity={blocked && p > 0.55 ? Math.max(0, 1 - (p - 0.55) * 4) : 1}><circle r={30} fill={C.gold} stroke="#7A5A10" strokeWidth={3} /><text y={11} textAnchor="middle" style={nv(30, '#3A2A06', 900)}>$</text></g>; })}
      <g opacity={pop(t, na)} transform={`translate(1100 ${330 - 40 * (1 - pop(t, na))})`}><rect x={-16} y={0} width={32} height={300} rx={8} fill={C.red} /><rect x={-110} y={110} width={220} height={26} rx={10} fill={C.red} /></g></SVG>
    <Chip text="اما نه به هر کسی" k={pop(t, na)} x={940} y={210} size={34} tone={C.red} color={C.red} />
    <Chip text="اول باید ثابت کنی که بلدی" k={pop(t, pv)} y={720} size={42} tone={C.gold} color={C.gold2} />
  </AbsoluteFill>;
}
// a left-to-right flow of nodes; shot.nodes = [[event, glyph, label, sub, tone]]; shot.show = how many nodes are this shot's (the rest dim)
export function flow({ shot }) {
  const t = useT(), N = shot.nodes, n = N.length, W = Math.min(330, 1500 / n - 30), x0 = 960 - (n * (W + 40) - 40) / 2, cap = shot.cap;
  return <AbsoluteFill>
    {shot.text[0] && <H shot={shot} />}
    {N.map(([k0, g, lab, sub, tone], i) => { const at = k0 === '-' ? -1 : ev(shot, k0, 1 + i * 1.5), k = at < 0 ? 1 : pop(t, at), x = x0 + i * (W + 40), col = tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold;
      return <div key={i} style={{ position: 'absolute', left: x, top: 280, width: W, height: 330, ...glass(t > at ? col : 'rgba(255,255,255,0.12)'), opacity: 0.22 + 0.78 * k, transform: `translateY(${(1 - k) * 24}px)`, ...center, flexDirection: 'column', gap: 16, padding: '0 14px', ...rtl }}>
        {ICON(g, 84, t > at ? (tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold2) : C.mute, 7)}
        <span style={{ ...txt(W > 280 ? 34 : 30, 900, C.ink), whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.35 }}>{lab}</span>
        {sub && <span style={{ ...txt(26, 800, tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold2), whiteSpace: 'normal', textAlign: 'center' }}>{sub}</span>}</div>; })}
    <SVG>{N.slice(1).map((nd, i) => { const at = nd[0] === '-' ? -1 : ev(shot, nd[0], 2 + i * 1.5); return <Arrow key={i} x1={x0 + (i + 1) * (W + 40) - 36} y1={445} x2={x0 + (i + 1) * (W + 40) - 6} y2={445} c={C.gold2} w={6} head={14} p={at < 0 ? 1 : prog(t, at - 0.3, 0.4)} />; })}</SVG>
    {cap && <Cap text={cap} k={pop(t, ev(shot, 'cap', 1e9))} y={660} size={cap.length > 50 ? 32 : 36} />}
  </AbsoluteFill>;
}
// boxes with operators: shot.rows = [[event, label, value, tone]], shot.ops = ['×', '=', ...]; chips [[event, text, tone]]
export function calc({ shot }) {
  const t = useT(), R = shot.rows, ops = shot.ops || [];
  return <AbsoluteFill>
    {shot.text[0] && <H shot={shot} />}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 290, ...center, gap: 22, direction: 'ltr' }}>
      {R.map(([k0, lab, val, tone], i) => { const at = ev(shot, k0, 0.5 + i * 1.5), k = pop(t, at), col = tone === 'green' ? C.green : tone === 'red' ? C.red : C.gold;
        return <React.Fragment key={i}>{i > 0 && <span style={{ ...txt(64, 900, C.gold2), opacity: pop(t, at - 0.2) }}>{ops[i - 1]}</span>}
          <div style={{ minWidth: 300, height: 200, padding: '0 28px', ...glass(col), opacity: 0.2 + 0.8 * k, transform: `translateY(${(1 - k) * 20}px)`, ...center, flexDirection: 'column', gap: 8, ...rtl }}>
            <span style={txt(28, 800, C.mute)}>{lab}</span><span style={txt(54, 900, tone === 'green' ? C.green : tone === 'red' ? C.red : C.ink)}>{val}</span></div></React.Fragment>; })}</div>
    {(shot.chips || []).map(([k0, text, tone], i) => <Chip key={i} text={text} k={pop(t, ev(shot, k0, 1e9))} y={560 + i * 95} size={36} tone={tone === 'green' ? C.green : tone === 'red' ? C.red : C.gold} color={tone === 'green' ? C.green : tone === 'red' ? C.red : C.gold2} />)}
  </AbsoluteFill>;
}
// where the firm's money comes from: the test fees (most fail) and a share of the winners' profit
export function revenue({ shot }) {
  const t = useT(), q = ev(shot, 'q', 0.3), fe = ev(shot, 'fees', 3.0), ms = ev(shot, 'most', 5.4), sh = ev(shot, 'share', 7.4), a = ease(prog(t, fe, 1.0)), b = ease(prog(t, sh, 1.0));
  return <AbsoluteFill>
    <Chip text="شرکت از کجا پول درمی‌آورد؟" k={pop(t, q)} y={140} size={40} />
    <div style={{ position: 'absolute', left: 280, top: 270, width: 780, ...rtl }}>
      {[['هزینه آزمون‌ها', a * 0.78, C.gold, fe], ['سهم از سود معامله‌گرهای قبول‌شده', b * 0.3, C.green, sh]].map(([lab, w, col, at], i) => <div key={i} style={{ marginTop: i ? 40 : 0, opacity: 0.3 + 0.7 * pop(t, at) }}>
        <div style={txt(34, 900, C.ink)}>{lab}</div>
        <div style={{ marginTop: 12, height: 60, borderRadius: 14, background: 'rgba(255,255,255,0.06)' }}><div style={{ width: `${100 * w}%`, height: '100%', borderRadius: 14, background: col }} /></div></div>)}</div>
    <div style={{ position: 'absolute', left: 1150, top: 270, width: 520, height: 400, ...glass(C.red), opacity: pop(t, ms), ...center, flexDirection: 'column', gap: 14, ...rtl }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: 400, gap: 8, direction: 'ltr', justifyContent: 'center' }}>{Array.from({ length: 20 }, (_, i) => <Ico key={i} n="user" s={56} c={i < 18 ? C.red : C.green} sw={7} />)}</div>
      <span style={txt(36, 900, C.red)}>بیشتر مردم رد می‌شوند</span></div>
  </AbsoluteFill>;
}
// the system rewards the disciplined and patient; rushing and excitement feed the firm's income
export function discipline({ shot }) {
  const t = useT(), dg = ev(shot, 'design', 0.6), cm = ev(shot, 'calm', 2.2), rs = ev(shot, 'rush', 4.4), fm = ev(shot, 'firm', 6.2), pre = 0.25 * pop(t, 0.8);
  return <AbsoluteFill>
    <Chip text="این یعنی چه؟" k={slot(t, 0.3, dg - 0.1)} y={140} size={40} />
    <Chip text="سیستم طوری طراحی شده که…" k={pop(t, dg)} y={140} size={38} />
    <div style={{ position: 'absolute', left: 280, top: 270, width: 1360, height: 190, ...glass(C.green), opacity: Math.max(pre, pop(t, cm)), display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', ...rtl }}>
      <Ico n="user" s={110} c={C.green} sw={6} /><span style={txt(48, 900, C.green)}>منظم و صبور</span><span style={{ flex: 1, height: 6, background: `linear-gradient(270deg, ${C.green}, rgba(38,166,154,0.2))`, borderRadius: 3 }} /><Gly n="trophy" s={110} c={C.gold2} sw={6} /><span style={txt(40, 900, C.ink)}>برنده</span></div>
    <div style={{ position: 'absolute', left: 280, top: 500, width: 1360, height: 190, ...glass(C.red), opacity: Math.max(pre, pop(t, rs)), display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', ...rtl }}>
      <Gly n="angry" s={110} c={C.red} sw={6} /><span style={txt(48, 900, C.red)}>عجله و هیجان</span><span style={{ flex: 1, height: 6, background: `linear-gradient(270deg, ${C.red}, rgba(230,50,18,0.2))`, borderRadius: 3 }} /><Gly n="bank" s={110} c={C.gold2} sw={6} /><span style={{ ...txt(40, 900, C.ink), opacity: pop(t, fm) }}>درآمد شرکت</span></div>
  </AbsoluteFill>;
}
// listen carefully: many lose money here
export function listen({ shot }) {
  const t = useT(), ls = ev(shot, 'listen', 0.4), ln = ev(shot, 'lose', 2.4);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 230, ...center, opacity: pop(t, ls), transform: `scale(${1 + 0.06 * Math.sin(t * 3)})` }}><Ico n="warn" s={180} c={C.gold2} sw={7} /></div>
    <Big text="این قسمت را خیلی دقیق گوش کن" k={pop(t, ls + 0.3)} y={450} size={66} />
    <Chip text="خیلی‌ها اینجا پول از دست می‌دهند" k={pop(t, ln)} y={600} size={40} tone={C.red} color={C.red} />
  </AbsoluteFill>;
}
// truth 1: living in Afghanistan: almost every famous firm lists it as restricted
export function afgBanned({ shot }) {
  const t = useT(), tr = ev(shot, 'truth', 0.2), lv = ev(shot, 'live', 1.6), ls = ev(shot, 'list', 4.2);
  const rows = ['…', '…', 'افغانستان', '…', '…'];
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 260, top: 140, ...rtl, opacity: pop(t, tr) }}><Badge text="حقیقت اول" /></div>
    <AfgShape x={980} y={200} w={660} t={t} at={lv - 0.3} tone={t > ls ? C.red : C.gold2} />
    <div style={{ position: 'absolute', left: 1150, top: 360, ...txt(52, 900, C.ink), opacity: pop(t, lv) }}>زندگی در افغانستان</div>
    <Panel x={280} y={260} w={560} h={430} k={pop(t, ls - 0.3)} title="فهرست کشورهای ممنوع" hypo>
      {rows.map((r, i) => { const hot = r === 'افغانستان'; return <div key={i} style={{ margin: '12px 22px 0', height: 52, borderRadius: 10, background: hot ? 'rgba(230,50,18,0.18)' : 'rgba(255,255,255,0.04)', border: hot ? `2px solid ${C.red}` : 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', opacity: hot ? pop(t, ls + 0.4) : 0.6 }}>
        {hot ? <OkMark ok={false} s={34} /> : <div style={{ width: 160, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.12)' }} />}{hot && <span style={txt(32, 900, C.red)}>{r}</span>}</div>; })}</Panel>
  </AbsoluteFill>;
}
// register ✓ -> test ✓ -> KYC and withdrawal ✗ -> the test fee is lost too
export function kycFail({ shot }) {
  const t = useT(), rg = ev(shot, 'reg', 1.0), ts = ev(shot, 'test', 2.2), ky = ev(shot, 'kyc', 4.0), fl = ev(shot, 'fail', 5.6), lo = ev(shot, 'lost', 7.0);
  const step = (x, at, lab, ok, g) => { const k = pop(t, at); return <div style={{ position: 'absolute', left: x, top: 300, width: 380, height: 260, ...glass(ok ? C.green : C.red), opacity: 0.2 + 0.8 * k, transform: `translateY(${(1 - k) * 20}px)`, ...center, flexDirection: 'column', gap: 16, ...rtl }}>
    {ICON(g, 80, ok ? C.green : C.red, 7)}<span style={{ ...txt(34, 900, C.ink), textAlign: 'center', whiteSpace: 'normal' }}>{lab}</span><OkMark ok={ok} s={46} k={ok ? k : pop(t, fl)} /></div>; };
  return <AbsoluteFill>
    <Chip text="ممکن است بتوانی…" k={pop(t, 0.2)} y={150} size={36} />
    {step(260, rg, 'ثبت‌نام', true, 'card')}{step(720, ts, 'حتی آزمون', true, 'trophy')}{step(1180, ky, 'احراز هویت و برداشت', false, 'passport')}
    <SVG>{[0, 1].map(i => <Arrow key={i} x1={650 + i * 460} y1={430} x2={710 + i * 460} y2={430} c={C.gold2} w={6} head={14} p={prog(t, [ts, ky][i] - 0.3, 0.4)} />)}</SVG>
    <Chip text="پول آزمون هم از دست رفته" k={pop(t, lo)} y={640} size={40} tone={C.red} color={C.red} icon={<Gly n="fire" s={40} c={C.red} sw={8} />} />
  </AbsoluteFill>;
}
// truth 2 (the good news): the criterion is where you live, not your nationality; an Afghan with legal residence abroad passes
const CTRY = [['sa', 'عربستان'], ['ae', 'امارات'], ['tr', 'ترکیه'], ['eu', 'اروپا']];
export function residence({ shot }) {
  const t = useT(), tr = ev(shot, 'truth', 0.2), cr = ev(shot, 'criterion', 2.4), nt = ev(shot, 'nation', 3.6), rs = ev(shot, 'res', 6.0), ps = ev(shot, 'pass', 9.6), wd = ev(shot, 'wd', 12.0);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 260, top: 140, display: 'flex', gap: 16, alignItems: 'center', ...rtl, opacity: pop(t, tr) }}><Badge text="حقیقت دوم" /><span style={{ ...txt(36, 900, C.green), opacity: pop(t, ev(shot, 'good', 1.6)), display: 'flex', alignItems: 'center', gap: 10 }}><Ico n="check" s={34} c={C.green} sw={11} />خبر خوب</span></div>
    <Chip text="در بیشتر شرکت‌ها…" k={slot(t, ev(shot, 'most', 3.4), cr - 0.1)} x={260} y={250} size={36} />
    <div style={{ position: 'absolute', left: 260, top: 250, display: 'flex', gap: 24, alignItems: 'center', ...rtl, opacity: pop(t, cr) }}>
      <span style={txt(46, 900, C.ink)}>ملاک:</span><span style={{ ...glass(C.green), padding: '8px 26px 12px', ...txt(46, 900, C.green) }}>محل زندگی</span>
      <span style={{ ...txt(46, 900, C.mute), opacity: pop(t, nt), textDecoration: 'line-through' }}>نه ملیت</span></div>
    <div style={{ position: 'absolute', left: 260, top: 380, width: 440, height: 300, ...glass(C.gold), opacity: pop(t, ev(shot, 'good', rs - 0.6)), ...center, gap: 20, ...rtl }}>
      <div style={{ ...center, flexDirection: 'column', gap: 8 }}><Ico n="user" s={120} c={C.ink} sw={5} /><span style={txt(30, 900, C.ink)}>افغانِ مقیم خارج</span></div>
      <div style={{ ...center, flexDirection: 'column', gap: 12, opacity: pop(t, ps) }}><Gly n="passport" s={70} c={C.gold2} /><Gly n="card" s={70} c={C.gold2} /><span style={txt(22, 800, C.mute)}>پاسپورت + اقامه</span></div></div>
    {CTRY.map(([k0, lab], i) => { const k = pop(t, ev(shot, k0, rs + 0.5 + i * 0.6)); return <div key={i} style={{ position: 'absolute', left: 800 + (i % 2) * 430, top: 380 + Math.floor(i / 2) * 150, width: 390, height: 120, ...glass(C.green), opacity: Math.max(0.2 * pop(t, 0.5 + i * 0.15), k), transform: `scale(${0.85 + 0.15 * k})`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', ...rtl }}>
      <OkMark ok s={46} /><span style={txt(40, 900, C.ink)}>{lab}</span><span style={{ marginRight: 'auto', ...txt(22, 800, C.mute) }}>با اقامه قانونی</span></div>; })}
    <Cap text="مقیم افغانستان ❌  ·  افغانِ مقیم خارج با اقامه ✅" k={pop(t, wd)} y={700} />
  </AbsoluteFill>;
}
// truth 3: every firm has its own rule; some look at residence and nationality; check before you pay (the FAQ page, both boxes, ask support, save)
export function ownRules({ shot }) {
  const t = useT(), pre = shot.pre ? -1 : null, tr = pre ?? ev(shot, 'truth', 0.2), bt = pre ?? ev(shot, 'both', 2.6), bf = pre ?? ev(shot, 'before', 5.6), fq = ev(shot, 'faq', 1e9), bn = ev(shot, 'banned', 9.4), rs = ev(shot, 'res', 11.0), ps = ev(shot, 'pass', 12.4), sp = ev(shot, 'support', 14.4), sv2 = ev(shot, 'save', 16.0);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 260, top: 140, display: 'flex', gap: 16, alignItems: 'center', ...rtl, opacity: pop(t, tr) }}><Badge text="حقیقت سوم" /><span style={txt(36, 900, C.ink)}>هر شرکت، قانون خودش</span></div>
    <div style={{ position: 'absolute', left: 260, top: 240, display: 'flex', gap: 20, ...rtl, opacity: pop(t, bt) }}>{[['home', 'محل زندگی'], ['passport', 'ملیت']].map(([g, l], i) => <div key={i} style={{ ...glass(C.gold), padding: '10px 26px 14px', display: 'flex', alignItems: 'center', gap: 14, ...txt(34, 900, C.ink) }}>{ICON(g, 44, C.gold2, 8)}{l}</div>)}<span style={{ ...txt(32, 800, C.mute), alignSelf: 'center' }}>بعضی‌ها هر دو</span></div>
    <Panel x={260} y={350} w={900} h={360} k={pop(t, fq - 0.4)} title="سؤال‌های متداول  ›  کشورهای ممنوع" hypo>
      <div style={{ margin: '18px 24px', height: 54, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', ...txt(26, 800, C.mute) }}><Gly n="search" s={34} c={C.mute} sw={9} /><span style={{ opacity: pop(t, bn) }}>کشورهای ممنوع (Restricted countries)</span></div>
      {[['کشور محل زندگی‌ام را چک کردم', rs], ['کشور پاسپورتم را چک کردم', ps]].map(([l, at], i) => <div key={i} style={{ margin: '14px 24px 0', display: 'flex', alignItems: 'center', gap: 16, ...txt(32, 900, t > at ? C.ink : C.mute) }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, border: `3px solid ${t > at ? C.green : C.mute}`, ...center }}>{t > at && <Ico n="check" s={34} c={C.green} sw={13} />}</div>{l}</div>)}</Panel>
    <div style={{ position: 'absolute', left: 1220, top: 360, width: 460, opacity: pop(t, sp), ...rtl }}>
      <div style={{ ...glass(C.gold), padding: '16px 22px 20px', borderRadius: '22px 22px 4px 22px', ...txt(30, 800, C.ink), whiteSpace: 'normal', lineHeight: 1.5 }}>شک داشتی؟ قبل از خرید از پشتیبانی بپرس</div>
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, opacity: pop(t, sv2), ...txt(30, 900, C.green) }}><Gly n="save" s={52} c={C.green} sw={7} />جوابشان را ذخیره کن</div></div>
    <Cap text="ملاک: محل زندگی (+ گاهی ملیت) ← قبل از خرید چک کن" k={pop(t, bf)} y={736} size={34} />
  </AbsoluteFill>;
}
// a very serious warning: a fake address or an account in someone else's name = withdrawal refused
export function fakeWarn({ shot }) {
  const t = useT(), wn = ev(shot, 'warn', 0.3), ad = ev(shot, 'addr', 2.6), fr = ev(shot, 'friend', 4.4), no = ev(shot, 'no', 6.8), nv2 = ev(shot, 'never', 7.8);
  const typed = 'Dubai, Al Barsha 12'.slice(0, Math.floor(19 * prog(t, ad, 1.2)));
  return <AbsoluteFill>
    <RedAlert k={0.6 * pop(t, wn)} s={t} />
    <Chip text="یک هشدار خیلی جدی" k={pop(t, wn)} y={140} size={40} tone={C.red} color={C.red} icon={<Ico n="warn" s={40} c={C.red} sw={8} />} />
    <Panel x={260} y={250} w={640} h={260} k={pop(t, ad - 0.3)} title="آدرس" tone={C.red}>
      <div style={{ margin: '30px 26px', height: 70, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: NUM, fontWeight: 700, fontSize: 34, color: C.ink, direction: 'ltr' }}>{typed}<span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }}>|</span></div>
      <div style={{ position: 'absolute', left: 300, top: 150, transform: 'rotate(-10deg)', border: `5px solid ${C.red}`, borderRadius: 12, padding: '2px 20px 6px', ...txt(44, 900, C.red), opacity: pop(t, no) }}>جعلی</div></Panel>
    <Panel x={1000} y={250} w={640} h={260} k={pop(t, fr - 0.3)} title="حساب" tone={C.red}>
      <div style={{ margin: '24px 26px', display: 'flex', alignItems: 'center', gap: 18 }}><Ico n="user" s={90} c={C.mute} sw={6} /><div style={{ ...txt(32, 900, C.ink) }}>به نام رفیق یا فامیل</div></div>
      <div style={{ position: 'absolute', left: 330, top: 150, transform: 'rotate(-10deg)', border: `5px solid ${C.red}`, borderRadius: 12, padding: '2px 20px 6px', ...txt(44, 900, C.red), opacity: pop(t, no + 0.3) }}>رد</div></Panel>
    <Big text="این کار را نکن. هرگز." k={pop(t, nv2)} y={560} size={70} color={C.red} />
    <Cap text="⛔ آدرس جعلی / حساب به نام دیگری = برداشت رد" k={pop(t, nv2 + 0.6)} y={700} tone={C.red} />
  </AbsoluteFill>;
}
// at withdrawal they check the document, a live face photo and sometimes proof of address; a mismatch = refused, account closed
export function mismatch({ shot }) {
  const t = useT(), dc = ev(shot, 'doc', 1.4), sf = ev(shot, 'selfie', 2.4), ad = ev(shot, 'addr', 3.6), mm = ev(shot, 'mismatch', 5.4), dn = ev(shot, 'denied', 6.6), cl = ev(shot, 'closed', 7.6), mo = ev(shot, 'months', 9.6);
  const card = (x, g, lab, at) => <div style={{ position: 'absolute', left: x, top: 260, width: 340, height: 240, ...glass(t > mm ? C.red : C.gold), opacity: pop(t, at), transform: `translateY(${(1 - pop(t, at)) * 20}px) rotate(${t > mm ? 2 * Math.sin(t * 20) * (1 - prog(t, mm, 0.6)) : 0}deg)`, ...center, flexDirection: 'column', gap: 16, ...rtl }}>{ICON(g, 90, t > mm ? C.red : C.gold2, 6)}<span style={txt(32, 900, C.ink)}>{lab}</span></div>;
  return <AbsoluteFill>
    <Chip text="هنگام برداشت می‌خواهند:" k={pop(t, 0.3)} y={140} size={36} />
    {card(330, 'passport', 'مدرک', dc)}{card(790, 'camera', 'عکس زنده از صورت', sf)}{card(1250, 'home', 'مدرک آدرس', ad)}
    <SVG><g opacity={pop(t, mm)}>{[[670, 380, 790, 380], [1130, 380, 1250, 380]].map(([a, b, c2, d], i) => <g key={i}><line x1={a} y1={b} x2={c2} y2={d} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" /><XMark x={(a + c2) / 2} y={b} r={26} k={pop(t, mm + 0.2)} /></g>)}</g></SVG>
    <Chip text="اطلاعات با هم نخواند" k={pop(t, mm)} y={530} size={34} tone={C.red} color={C.red} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 620, ...center, gap: 24, ...rtl }}>
      {[['برداشت رد', dn], ['حساب بسته', cl], ['پول آزمون + ماه‌ها زحمت', mo]].map(([l, at], i) => <div key={i} style={{ ...glass(C.red), padding: '10px 26px 14px', display: 'flex', alignItems: 'center', gap: 12, ...txt(32, 900, C.red), opacity: pop(t, at) }}><OkMark ok={false} s={34} />{l}</div>)}</div>
  </AbsoluteFill>;
}
// an account in someone else's name = your money in someone else's hands; the right way: only your own real documents
export function otherName({ shot }) {
  const t = useT(), ot = ev(shot, 'other', 0.4), rt = ev(shot, 'right', 3.6);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 280, top: 230, width: 640, height: 400, ...glass(C.red), opacity: pop(t, ot), ...center, gap: 30, ...rtl }}>
      <div style={{ ...center, flexDirection: 'column', gap: 8 }}><Gly n="wallet" s={120} c={C.red} sw={6} /><span style={txt(30, 900, C.ink)}>پول تو</span></div>
      <Arrow2 /><div style={{ ...center, flexDirection: 'column', gap: 8 }}><Ico n="user" s={120} c={C.mute} sw={5} /><span style={txt(30, 900, C.mute)}>در دست کس دیگر</span></div></div>
    <div style={{ position: 'absolute', left: 1000, top: 230, width: 640, height: 400, ...glass(C.green), opacity: pop(t, rt), ...center, flexDirection: 'column', gap: 18, ...rtl }}>
      <div style={{ display: 'flex', gap: 20 }}><Gly n="passport" s={100} c={C.green} sw={6} /><Gly n="card" s={100} c={C.green} sw={6} /><Gly n="home" s={100} c={C.green} sw={6} /></div>
      <span style={txt(40, 900, C.green)}>راه درست:</span><span style={txt(40, 900, C.ink)}>فقط مدارک واقعی خودت</span></div>
  </AbsoluteFill>;
}
const Arrow2 = () => <svg width={90} height={40}><path d="M84 20 L10 20 M30 6 L10 20 L30 34" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>;
// in Afghanistan now? don't despair: build skill (demo, backtest, journal); a prop firm is one chance, skill goes everywhere with you
export function skillAsset({ shot }) {
  const t = useT(), dp = ev(shot, 'despair', 0.6), dm = ev(shot, 'demo', 3.4), bt = ev(shot, 'back', 5.0), jr = ev(shot, 'journal', 6.6), op = ev(shot, 'chance', 8.4), sk = ev(shot, 'skill', 10.4);
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <SVG>{Array.from({ length: 40 }, (_, i) => <line key={'v' + i} x1={i * 50} x2={i * 50} y1={0} y2={1080} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}{Array.from({ length: 22 }, (_, i) => <line key={'h' + i} x1={0} x2={1920} y1={i * 50} y2={i * 50} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}</SVG>
    <Chip text="الان در افغانستان هستی؟ ناامید نشو" k={pop(t, dp)} y={140} size={40} tone={C.green} color={C.green} />
    {[['حساب آزمایشی', 'layers', dm], ['تست روی گذشته', 'rise', bt], ['ژورنال', 'book', jr]].map(([l, g, at], i) => <div key={i} style={{ position: 'absolute', left: 1240 - i * 420, top: 260, width: 380, height: 230, background: '#F6EEDC', borderRadius: 6, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(${(i - 1) * 2}deg) translateY(${(1 - pop(t, at)) * 30}px)`, opacity: pop(t, at), ...center, flexDirection: 'column', gap: 14, ...rtl }}>
      {ICON(g, 90, '#5A4A1A', 7)}<span style={txt(36, 900, '#3A2E10')}>{l}</span></div>)}
    <Chip text="پراپ‌فرم فقط یک فرصت است" k={pop(t, op)} x={260} y={560} size={34} />
    <Chip text="مهارت = دارایی که هر جا بروی با تو می‌آید" k={pop(t, sk)} x={260} y={660} size={36} tone={C.gold} color={C.gold2} icon={<Ico n="shield" s={36} c={C.gold2} sw={9} />} />
  </AbsoluteFill>;
}
// hundreds of firms, new ones open and some close every month; instead of names: five criteria
export function manyFirms({ shot }) {
  const t = useT(), hd = ev(shot, 'hundreds', 0.4), op = ev(shot, 'open', 2.6), cl = ev(shot, 'close', 3.8), fv = ev(shot, 'five', 6.4), cp = ev(shot, 'cap', 8.0);
  return <AbsoluteFill>
    <Chip text="صدها پراپ‌فرم در اینترنت" k={pop(t, hd)} y={140} size={38} />
    <div style={{ position: 'absolute', left: 300, top: 240, width: 1320, display: 'flex', flexWrap: 'wrap', gap: 14, direction: 'ltr', opacity: 1 - 0.75 * pop(t, fv) }}>
      {Array.from({ length: 30 }, (_, i) => { const nw = i % 7 === 3, gone = i % 6 === 1, k = pop(t, hd + (i % 10) * 0.05) * (nw ? pop(t, op + (i % 3) * 0.2) : 1);
        return <div key={i} style={{ width: 118, height: 96, borderRadius: 12, background: nw ? 'rgba(38,166,154,0.2)' : 'rgba(255,255,255,0.05)', border: `2px solid ${nw && t > op ? C.green : 'rgba(255,255,255,0.14)'}`, ...center, opacity: k * (gone && t > cl ? 0.25 : 1), position: 'relative' }}>
          <Gly n="bank" s={52} c={nw ? C.green : C.mute} sw={7} />{gone && t > cl && <div style={{ position: 'absolute' }}><Ico n="cross" s={70} c={C.red} sw={10} /></div>}</div>; })}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 360, ...center, gap: 18, direction: 'rtl' }}>{CRIT.map((c, i) => { const k = pop(t, fv + 0.2 + i * 0.15); return <div key={i} style={{ width: 250, height: 150, ...glass(C.gold), opacity: k, transform: `translateY(${(1 - k) * 30}px)`, ...center, flexDirection: 'column', gap: 10, ...rtl }}><Badge text={faNum(i + 1)} size={28} /><span style={txt(30, 900, C.ink)}>{c}</span></div>; })}</div>
    <Cap text="۵ معیار: سابقه · کشور · برداشت با تتر · قانون ساده · بازار و پلتفرم" k={pop(t, cp)} y={600} size={34} />
  </AbsoluteFill>;
}
// one criterion: header «معیار N», the five-criteria panel on the right, and a picture per criterion (shot.mode)
export function crit({ shot }) {
  const t = useT(), n = shot.n, mode = shot.mode, tk = ev(shot, 'tick', 1e9), e = k0 => ev(shot, k0, 1e9);
  const LAB = ['سابقه و برداشت‌های واقعی', 'پذیرش کشور تو', 'روش برداشت', 'قانون‌ها', 'پلتفرم و بازار'];
  return <AbsoluteFill>
    <NumHead n={n} label={`معیار ${faNum(n)}: ${LAB[n - 1]}`} t={t} />
    {mode === 'track' && <>
      <Panel x={260} y={240} w={1100} h={300} k={pop(t, e('years') - 0.3)} title="نظرهای کاربران (سایت مستقل)" hypo>
        <div style={{ display: 'flex', gap: 30, padding: '24px 30px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, direction: 'ltr' }}>{[0, 1, 2, 3, 4].map(i => <Gly key={i} n="star" s={50} c={C.gold2} sw={6} fill={i < 4 ? 'rgba(232,201,106,0.8)' : 'none'} />)}</div>
          <span style={{ ...txt(34, 900, C.ink), opacity: pop(t, e('years')) }}>چند سال سابقه</span></div>
        <div style={{ display: 'flex', gap: 20, padding: '0 30px' }}>{[0, 1, 2].map(i => <div key={i} style={{ ...glass(C.green), padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 10, ...txt(26, 900, C.green), opacity: pop(t, e('real') + i * 0.3) }}><OkMark ok s={30} />برداشت تأییدشده</div>)}</div></Panel>
      <Chip text="نظرهای مربوط به برداشت را بخوان" k={pop(t, e('reviews'))} x={260} y={580} size={32} />
      <Chip text="شرکت تازه + تخفیف عجیب = خطر" k={pop(t, e('danger'))} x={260} y={670} size={34} tone={C.red} color={C.red} icon={<Ico n="warn" s={34} c={C.red} sw={9} />} /></>}
    {mode === 'country' && <>
      <div style={{ position: 'absolute', left: 300, top: 260, display: 'flex', gap: 40, ...rtl }}>{[['home', 'محل زندگی', e('res')], ['passport', 'پاسپورت', e('pass')]].map(([g, l, at], i) => <div key={i} style={{ width: 440, height: 330, ...glass(t > at ? C.green : C.gold), opacity: pop(t, at - 0.6), ...center, flexDirection: 'column', gap: 20 }}>
        {ICON(g, 130, t > at ? C.green : C.gold2, 6)}<span style={txt(44, 900, C.ink)}>{l}</span><OkMark ok s={50} k={pop(t, at)} /></div>)}</div>
      <Chip text="همان که در بخش قبل گفتیم" k={pop(t, e('before'))} x={300} y={640} size={32} /></>}
    {mode === 'usdt' && <>
      <div style={{ position: 'absolute', left: 280, top: 250, width: 330, height: 330, ...glass(C.green), opacity: pop(t, e('usdt') - 0.3), ...center, flexDirection: 'column', gap: 14 }}>
        <Gly n="usdt" s={150} c={C.green} sw={6} /><span style={txt(40, 900, C.ink)}>تتر</span><span style={txt(26, 800, C.mute)}>دلار دیجیتال</span></div>
      <div style={{ position: 'absolute', left: 660, top: 250, display: 'flex', flexDirection: 'column', gap: 18, ...rtl }}>
        {[['ترون', 'TRC20', e('tron')], ['اتریوم', 'ERC20', e('eth')], ['رایز', 'Rise', e('rise')]].map(([a, b, at], i) => <div key={i} style={{ width: 360, height: 92, ...glass(C.green), display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', opacity: pop(t, at) }}>
          <OkMark ok s={38} /><span style={txt(34, 900, C.ink)}>{a}</span><span style={{ marginRight: 'auto', fontFamily: NUM, fontWeight: 800, fontSize: 28, color: C.gold2 }}>{b}</span></div>)}</div>
      <div style={{ position: 'absolute', left: 1060, top: 250, width: 330, height: 330, ...glass(C.red), opacity: pop(t, e('bank')), ...center, flexDirection: 'column', gap: 14, ...rtl }}><Gly n="bank" s={120} c={C.red} sw={6} /><span style={txt(32, 900, C.ink)}>حواله بانکی</span><span style={txt(30, 900, C.red)}>برای ما سخت</span></div>
      <Chip text="قبل از خرید: برداشت با تتر ممکن است؟" k={pop(t, e('check'))} x={280} y={640} size={34} tone={C.gold} color={C.gold2} /></>}
    {mode === 'rules' && <>
      <div style={{ position: 'absolute', left: 280, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 16, ...rtl }}>
        {[['حد ضرر روزانه', 'down', e('daily')], ['حد ضرر کل', 'shield', e('max')], ['هدف سود', 'target', e('target')], ['قانون‌های اضافه: خبر، آخر هفته', 'news', e('extra')]].map(([l, g, at], i) => <div key={i} style={{ height: 86, ...glass(C.gold), display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * 30}px)` }}>{ICON(g, 54, C.gold2, 8)}<span style={txt(36, 900, C.ink)}>{l}</span></div>)}</div>
      <Chip text="قانون ساده‌تر = شانس قبولی بیشتر" k={pop(t, e('simple'))} x={280} y={680} size={36} tone={C.green} color={C.green} /></>}
    {mode === 'platform' && <>
      <Panel x={280} y={250} w={1080} h={400} k={pop(t, e('gold') - 0.4)} title="MetaTrader 5" hypo>
        {[['XAUUSD', 'طلا', e('gold')], ['US30', 'داو جونز', e('dow')]].map(([a, b, at], i) => <div key={i} style={{ margin: '22px 30px 0', height: 90, borderRadius: 14, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 24px', opacity: 0.3 + 0.7 * pop(t, at) }}>
          <OkMark ok s={44} k={pop(t, at)} /><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 40, color: C.ink }}>{a}</span><span style={txt(34, 900, C.gold2)}>{b}</span></div>)}
        <div style={{ margin: '26px 30px', ...txt(30, 800, C.mute), opacity: pop(t, e('mt5')) }}>متاتریدر ۵ یا پلتفرمی که بلدی</div></Panel></>}
    <SideList title="۵ معیار" rows={CRIT} n={n} t={t} tick={tk} />
  </AbsoluteFill>;
}
// a real example the owner checked: FundedNext (text only): KYC documents, USDT on TRON and Ethereum, Rise, Afghanistan restricted
export function firmExample({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  const rows = [['احراز هویت: پاسپورت · کارت شناسایی · کارت اقامه', true, e('kyc')], ['برداشت: USDT (TRC20 / ERC20)', true, e('usdt')], ['برداشت از طریق Rise', true, e('rise')], ['افغانستان: در فهرست کشورهای ممنوع', false, e('banned')]];
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 260, top: 130, display: 'flex', alignItems: 'center', gap: 18, opacity: pop(t, 0.1), ...rtl }}><Badge text="مثال واقعی" /><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 52, color: C.ink }}>FundedNext</span></div>
    <div style={{ position: 'absolute', left: 260, top: 240, width: 1400, display: 'flex', flexDirection: 'column', gap: 16, ...rtl }}>
      {rows.map(([l, ok, at], i) => <div key={i} style={{ height: 88, ...glass(ok ? C.green : C.red), display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', opacity: 0.15 + 0.85 * pop(t, at), transform: `translateX(${(1 - pop(t, at)) * 30}px)` }}><OkMark ok={ok} s={46} /><span style={txt(36, 900, C.ink)}>{l}</span></div>)}</div>
    <Cap text="مثال: FundedNext ← اقامه قبول · USDT (TRC20/ERC20) · Rise · افغانستان ممنوع" k={pop(t, e('cap'))} y={680} size={32} />
    <Chip text="قانون‌ها عوض می‌شوند؛ همیشه خودت دوباره چک کن" k={pop(t, e('change'))} y={680} size={32} tone={C.gold} color={C.gold2} />
  </AbsoluteFill>;
}
// the same rule, restated: an Afghan resident abroad with residence: yes; resident of Afghanistan: no
export function sameRule({ shot }) {
  const t = useT(), y1 = ev(shot, 'yes', 1.0), n1 = ev(shot, 'no', 2.6), ch = ev(shot, 'change', 4.0);
  return <AbsoluteFill>
    <Chip text="همان قاعده" k={pop(t, 0.2)} y={150} size={40} />
    {[['افغانِ مقیم خارج با اقامه', true, y1, 1000], ['مقیم افغانستان', false, n1, 280]].map(([l, ok, at, x], i) => <div key={i} style={{ position: 'absolute', left: x, top: 270, width: 640, height: 300, ...glass(ok ? C.green : C.red), opacity: pop(t, at), transform: `scale(${0.9 + 0.1 * pop(t, at)})`, ...center, flexDirection: 'column', gap: 22, ...rtl }}>
      <OkMark ok={ok} s={90} /><span style={txt(44, 900, C.ink)}>{l}</span><span style={txt(50, 900, ok ? C.green : C.red)}>{ok ? 'بله' : 'نه'}</span></div>)}
    <Chip text="قانون‌ها ممکن است عوض شوند: خودت دوباره در سایتشان چک کن" k={pop(t, ch)} y={610} size={32} tone={C.gold} color={C.gold2} icon={<Gly n="search" s={34} c={C.gold2} sw={9} />} />
    <Chip text="نکته: صفحه کشورهای ممنوع فاندد نکست (CFD) «مقیم یا شهروند» را می‌گوید؛ قبل از خرید از پشتیبانی بپرس" k={pop(t, ch + 1.4)} y={710} size={26} tone={C.red} color={C.ink} icon={<Ico n="warn" s={28} c={C.red} sw={9} />} />
  </AbsoluteFill>;
}
// one or two phases, three main rules
export function rulesIntro({ shot }) {
  const t = useT(), ph = ev(shot, 'phases', 0.6), th = ev(shot, 'three', 2.8), cp = ev(shot, 'cap', 1e9);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 170, ...center, gap: 30, ...rtl }}>{['مرحله ۱', 'مرحله ۲'].map((l, i) => <div key={i} style={{ width: 360, height: 150, ...glass(C.gold), ...center, ...txt(44, 900, C.ink), opacity: pop(t, ph + i * 0.4) * (i ? 0.8 : 1) }}>{l}</div>)}<span style={{ ...txt(34, 800, C.mute), opacity: pop(t, ph + 0.8) }}>یک یا دو مرحله</span></div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 390, ...center, gap: 30, ...rtl }}>{[['target', 'هدف سود'], ['down', 'حد ضرر روزانه'], ['shield', 'حد ضرر کل']].map(([g, l], i) => <div key={i} style={{ width: 400, height: 200, ...glass(C.gold), ...center, flexDirection: 'column', gap: 14, opacity: pop(t, th + i * 0.3), transform: `translateY(${(1 - pop(t, th + i * 0.3)) * 24}px)` }}><Badge text={faNum(i + 1)} size={26} /><span style={{ ...txt(38, 900, C.ink), display: 'flex', alignItems: 'center', gap: 12 }}>{ICON(g, 46, C.gold2, 8)}{l}</span></div>)}</div>
    <Cap text="قانون‌ها: هدف سود ۸٪ / ۵٪ · حد ضرر روزانه ۵٪ · حد ضرر کل ۱۰٪" k={pop(t, cp)} y={680} size={34} />
  </AbsoluteFill>;
}
// CHART (account balance, hypothetical): shot.mode target | daily | max | floating; y in thousands of dollars (88k-110k)
const EQ = { x: 200, y: 230, w: 1180, h: 560 }, RNG = { target: [97, 110, 10], daily: [94, 104, 3], max: [88, 102, 10], floating: [93, 102, 3] };
const EqLine = ({ v, c, lab, Y, k = 1, dash = null, w = 3.5 }) => k > 0.01 && <g opacity={clamp(k)}><line x1={EQ.x + 90} x2={EQ.x + EQ.w - 110} y1={Y(v)} y2={Y(v)} stroke={c} strokeWidth={w} strokeDasharray={dash || undefined} />
  <text x={EQ.x + EQ.w - 100} y={Y(v) + 9} style={nv(24, c, 800)}>{`${faNum(v)}k`}</text>{lab && <text x={EQ.x + EQ.w - 120} y={Y(v) - 12} direction="rtl" textAnchor="start" style={sv(24, 900, c)}>{lab}</text>}</g>;
export function equity({ shot }) {
  const t = useT(), mode = shot.mode, e = (k0, d) => ev(shot, k0, d);
  const [lo, hi, dmax] = RNG[mode], ey = v => EQ.y + 80 + (hi - v) / (hi - lo) * (EQ.h - 140), ex = d => EQ.x + 90 + d * (EQ.w - 230) / dmax;
  const P = { target: [[0, 100], [1, 101.2], [2, 100.6], [3, 102.4], [4, 103.6], [5, 103], [6, 105.2], [7, 106.1], [8, 105.6], [9, 108.2]], daily: [[0, 100], [1, 102], [1.3, 101.4], [1.6, 99.2], [1.9, 98.0], [2.2, 96.6]], max: [[0, 100], [1.5, 98.2], [3, 96.4], [4.5, 95], [6, 93.6], [7.5, 91.8], [9, 90]], floating: [[0, 100], [1, 100.5], [1.4, 99.4], [1.8, 97.8], [2.2, 95.2]] }[mode];
  const d0 = { target: e('up', 0.6), daily: e('day', 0.6), max: e('slide', 0.6), floating: e('open', 0.6) }[mode], dd = { target: e('hit', 6), daily: e('fail', 6), max: e('over', 6), floating: e('fail', 6) }[mode], p = prog(t, d0, Math.max(1, dd - d0));
  const pts = P.map(([d, v], i) => [ex(d), ey(v), seg(p, P.length - 1, i - 1)]), end = P[P.length - 1], bad = mode !== 'target';
  const p2 = mode === 'target' ? e('p2', 1e9) : 1e9, P2 = [[0, 100], [1.5, 101.4], [3, 100.8], [4.5, 103.1], [6, 104.2], [7.5, 105.1]], q = prog(t, p2 + 0.3, 2.4);
  return <AbsoluteFill>
    {shot.head && (shot.head[0] ? <NumHead n={shot.head[0]} label={shot.head[1]} t={t} /> : <Chip text={shot.head[1]} k={pop(t, 0.1)} x={260} y={130} size={40} />)}
    <Panel x={EQ.x} y={EQ.y} w={EQ.w} h={EQ.h} k={pop(t, 0)} title="موجودی حساب ۱۰۰,۰۰۰ دلاری" hypo />
    <SVG><EqLine Y={ey} v={100} c="rgba(237,230,214,0.55)" lab="شروع" dash="9 7" w={2.5} />
      {mode === 'target' && <><EqLine Y={ey} v={108} c={C.green} lab="هدف مرحله ۱: ۸٪" k={pop(t, e('line', 0.3)) * (1 - pop(t, p2))} />{t > p2 && <EqLine Y={ey} v={105} c={C.green} lab="هدف مرحله ۲: ۵٪" k={pop(t, p2)} />}</>}
      {mode === 'daily' && <><line x1={ex(1)} x2={ex(1)} y1={EQ.y + 60} y2={EQ.y + EQ.h - 20} stroke="rgba(255,255,255,0.15)" strokeDasharray="6 6" /><text x={ex(0.5)} y={EQ.y + EQ.h - 30} textAnchor="middle" style={sv(24, 900, C.mute)}>دیروز</text><text x={ex(1.6)} y={EQ.y + EQ.h - 30} textAnchor="middle" style={sv(24, 900, C.mute)}>امروز</text>
        <g opacity={pop(t, e('line', 1.0))}><line x1={ex(1)} x2={ex(2.6)} y1={ey(97)} y2={ey(97)} stroke="#FF8A1F" strokeWidth={4} /><text x={ex(1.05)} y={ey(97) + 36} direction="rtl" textAnchor="end" style={sv(24, 900, '#FF8A1F')}>حد روزانه: ۵٪ (۵,۰۰۰ دلار)</text></g></>}
      {mode === 'max' && <EqLine Y={ey} v={90} c={C.red} lab="حد ضرر کل: ۱۰٪" k={pop(t, e('line', 0.3))} />}
      {mode === 'floating' && <><EqLine Y={ey} v={95} c="#FF8A1F" lab="حد روزانه" k={pop(t, e('line', 0.3))} /><line x1={ex(1)} x2={ex(2.4)} y1={ey(100.5)} y2={ey(100.5)} stroke={C.blue} strokeWidth={4} opacity={pop(t, e('closed', 1.2))} /><text x={ex(1.05)} y={ey(100.5) - 14} direction="rtl" textAnchor="end" style={sv(24, 900, C.blue)} opacity={pop(t, e('closed', 1.2))}>معامله هنوز باز (بسته نشده)</text></>}
      <Path pts={t > p2 ? pts.map(q2 => [q2[0], q2[1], 1]) : pts} w={5} c={t > p2 ? 'rgba(237,230,214,0.25)' : bad && t > dd ? C.red : C.ink} dash={mode === 'floating' ? '12 8' : null} />
      {t > p2 && <Path pts={P2.map(([d, v], i) => [ex(d), ey(v), seg(q, P2.length - 1, i - 1)])} w={5} c={C.ink} />}
      {mode === 'target' ? <><Check x={ex(end[0])} y={ey(end[1])} r={30} k={pop(t, dd) * (1 - pop(t, p2))} />{t > p2 && <Check x={ex(7.5)} y={ey(105.1)} r={30} k={pop(t, p2 + 2.7)} />}</> : <XMark x={ex(end[0])} y={ey(end[1])} r={34} k={pop(t, dd)} />}</SVG>
    <div style={{ position: 'absolute', left: 1420, top: 250, width: 420, display: 'flex', flexDirection: 'column', gap: 18, ...rtl }}>
      {(shot.notes || []).map(([k0, text, tone], i) => <div key={i} style={{ ...glass(tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold), padding: '14px 22px 18px', ...txt(30, 900, tone === 'red' ? C.red : tone === 'green' ? C.green : C.ink), whiteSpace: 'normal', lineHeight: 1.4, opacity: pop(t, e(k0, 1e9)), transform: `translateY(${(1 - pop(t, e(k0, 1e9))) * 16}px)` }}>{text}</div>)}</div>
  </AbsoluteFill>;
}
// extra rules: minimum trading days, news minutes, holding over the weekend; one unread rule is enough to lose everything
export function extraRules({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  return <AbsoluteFill>
    <Chip text="قانون‌های اضافه" k={pop(t, 0.2)} y={140} size={40} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 260, ...center, gap: 30, ...rtl }}>
      {[['calendar', 'حداقل روزهای معامله', e('days'), false], ['news', 'معامله در دقیقه‌های خبر', e('news'), true], ['moon', 'نگه داشتن معامله در آخر هفته', e('weekend'), true]].map(([g, l, at, ban], i) => <div key={i} style={{ width: 440, height: 300, ...glass(ban ? C.red : C.gold), opacity: pop(t, at), transform: `translateY(${(1 - pop(t, at)) * 24}px)`, ...center, flexDirection: 'column', gap: 18, padding: '0 20px' }}>
        {ICON(g, 100, ban ? C.red : C.gold2, 6)}<span style={{ ...txt(34, 900, C.ink), whiteSpace: 'normal', textAlign: 'center' }}>{l}</span>{ban && <span style={txt(28, 900, C.red)}>گاهی ممنوع</span>}</div>)}</div>
    <Chip text="یک قانون نخوانده = از دست دادن همه چیز" k={pop(t, e('unread'))} y={640} size={40} tone={C.red} color={C.red} icon={<Ico n="book" s={38} c={C.red} sw={8} />} />
  </AbsoluteFill>;
}
// KYC on a phone (shot.mode doc | selfie | address), the five steps on the right
export function kycPhone({ shot }) {
  const t = useT(), mode = shot.mode, n = shot.n, e = k0 => ev(shot, k0, 1e9), sc = prog(t, 0.4, 2.0);
  return <AbsoluteFill>
    <NumHead n={n} label={`قدم ${faNum(n)}: ${['مدرک معتبر', 'عکس یا ویدیوی زنده', 'مدرک آدرس'][n - 1]}`} t={t} />
    <Phone x={300} y={240} w={330} h={560} o={pop(t, 0.2)}>
      <div style={{ position: 'absolute', inset: 0, background: '#0F141C', ...center, flexDirection: 'column', gap: 16 }}>
        {mode === 'doc' && <><div style={{ width: 250, height: 160, borderRadius: 12, background: '#2A3A5A', border: `3px solid ${t > e('clear') ? C.green : C.gold2}`, position: 'relative', ...center }}><Gly n="passport" s={90} c="#C9D4EA" sw={6} />
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => <div key={i} style={{ position: 'absolute', [a ? 'right' : 'left']: -8, [b ? 'bottom' : 'top']: -8, width: 26, height: 26, borderStyle: 'solid', borderColor: C.green, borderWidth: `${b ? 0 : 5}px ${a ? 5 : 0}px ${b ? 5 : 0}px ${a ? 0 : 5}px`, opacity: pop(t, e('corners')) }} />)}</div>
          <span style={txt(22, 800, C.mute)}>کادر را با مدرک پر کن</span></>}
        {mode === 'selfie' && <><div style={{ width: 220, height: 280, borderRadius: '50%', border: `5px solid ${t > e('light') ? C.green : C.gold2}`, ...center, background: `rgba(255,255,255,${0.04 + 0.08 * pop(t, e('light'))})` }}><Ico n="user" s={150} c="#C9D4EA" sw={5} /></div><span style={txt(22, 800, C.mute)}>صورت در کادر</span></>}
        {mode === 'address' && <div style={{ width: 240, height: 320, background: '#F6EEDC', borderRadius: 6, padding: 18, ...rtl }}><div style={txt(22, 900, '#5A4A1A')}>قبض برق</div>{[0, 1, 2, 3, 4].map(i => <div key={i} style={{ height: 10, marginTop: 16, width: `${90 - i * 12}%`, background: 'rgba(90,74,26,0.35)', borderRadius: 5 }} />)}<div style={{ marginTop: 26, ...txt(20, 900, '#1E7A6E'), opacity: pop(t, e('name')) }}>به نام خودت ✓</div></div>}
      </div></Phone>
    <div style={{ position: 'absolute', left: 690, top: 270, width: 680, display: 'flex', flexDirection: 'column', gap: 18, ...rtl }}>
      {(shot.notes || []).map(([k0, text, tone], i) => <div key={i} style={{ ...glass(tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold), padding: '12px 24px 16px', display: 'flex', alignItems: 'center', gap: 14, ...txt(32, 900, C.ink), opacity: pop(t, e(k0)), transform: `translateX(${(1 - pop(t, e(k0))) * 24}px)` }}><OkMark ok={tone !== 'red'} s={36} />{text}</div>)}</div>
    {shot.cap && <Cap text={shot.cap} k={pop(t, e('cap'))} y={742} size={32} />}
    <SideList title="احراز هویت و برداشت" rows={KYC} n={n} t={t} tick={e('tick')} />
  </AbsoluteFill>;
}
// verification attempts are limited (three); the name exactly as in the passport
export function attempts({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  return <AbsoluteFill>
    <Chip text="مراقب باش" k={pop(t, 0.2)} y={140} size={40} tone={C.red} color={C.red} icon={<Ico n="warn" s={40} c={C.red} sw={8} />} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 250, ...center, gap: 40, direction: 'rtl', opacity: pop(t, e('limit')) }}>
      <span style={txt(48, 900, C.ink)}>تعداد تلاش محدود:</span>{[0, 1, 2].map(i => <div key={i} style={{ width: 110, height: 110, borderRadius: 55, ...glass(C.gold), ...center, ...txt(52, 900, C.gold2), opacity: pop(t, e('three') + i * 0.2) }}>{faNum(i + 1)}</div>)}</div>
    <Chip text="از اول درست بفرست" k={pop(t, e('right'))} y={380} size={38} tone={C.green} color={C.green} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 470, ...center, gap: 30, direction: 'ltr', opacity: pop(t, e('name')) }}>
      {[['PASSPORT', 'KAMAL HAQJO'], ['FORM', 'KAMAL HAQJO']].map(([a, b], i) => <div key={i} style={{ width: 460, height: 130, ...glass(C.green), padding: '16px 24px' }}><div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 22, color: C.mute }}>{a}</div><div style={{ fontFamily: NUM, fontWeight: 800, fontSize: 40, color: C.ink, marginTop: 8 }}>{b}</div></div>)}
      <OkMark ok s={60} k={pop(t, e('name') + 0.6)} /></div>
    <Chip text="اسمت دقیقاً مثل پاسپورت" k={pop(t, e('name') + 0.4)} y={625} size={34} />
    <Cap text="KYC: پاسپورت/اقامه · سلفی زنده · مدرک آدرس · فقط ۳ تلاش" k={pop(t, e('cap'))} y={742} size={34} />
  </AbsoluteFill>;
}
// the withdrawal screen (shot.mode request | wallet | network), the five steps on the right
export function withdraw({ shot }) {
  const t = useT(), mode = shot.mode, n = shot.n, e = k0 => ev(shot, k0, mode === 'network' && (k0 === 'addr' || k0 === 'own' || k0 === 'usdt') ? -1 : 1e9);
  const addr = 'TQ8u3v…kP9x', wrong = mode === 'network' && t > e('wrong') && t < e('double');
  return <AbsoluteFill>
    <NumHead n={n} label={n === 4 ? 'قدم ۴: درخواست برداشت' : 'قدم ۵: آدرس کیف‌پول تتر'} t={t} />
    <Panel x={260} y={240} w={1100} h={400} k={pop(t, 0.2)} title="درخواست برداشت" hypo>
      <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 18 }}>{[['USDT', true], ['حواله بانکی', false], ['Rise', false]].map(([l, on], i) => <div key={i} style={{ padding: '14px 26px 18px', borderRadius: 14, background: on && t > e('usdt') ? 'rgba(38,166,154,0.22)' : 'rgba(255,255,255,0.05)', border: `2.5px solid ${on && t > e('usdt') ? C.green : 'rgba(255,255,255,0.15)'}`, ...txt(32, 900, on ? C.ink : C.mute), fontFamily: /[A-Z]/.test(l) ? NUM : undefined }}>{l}</div>)}</div>
        {mode !== 'request' && <><div style={{ ...txt(26, 800, C.mute) }}>آدرس کیف‌پول</div>
          <div style={{ height: 70, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `2.5px solid ${t > e('own') ? C.green : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', direction: 'ltr' }}><span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 32, color: C.ink }}>{addr.slice(0, Math.ceil(addr.length * prog(t, e('addr'), 1.0)))}</span><span style={{ marginLeft: 'auto', ...txt(24, 900, C.green), opacity: pop(t, e('own')) }}>کیف‌پول خودت ✓</span></div></>}
        {mode === 'network' && <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}><span style={txt(26, 800, C.mute)}>شبکه:</span>
          {[['TRC20 (ترون)', !wrong], ['ERC20', wrong]].map(([l, on], i) => <div key={i} style={{ padding: '12px 24px 16px', borderRadius: 14, background: on ? (wrong ? 'rgba(230,50,18,0.2)' : 'rgba(38,166,154,0.22)') : 'rgba(255,255,255,0.05)', border: `2.5px solid ${on ? (wrong ? C.red : C.green) : 'rgba(255,255,255,0.15)'}`, fontFamily: NUM, fontWeight: 800, fontSize: 30, color: C.ink }}>{l}</div>)}</div>}
      </div></Panel>
    <div style={{ position: 'absolute', left: 260, top: 656, width: 1120, display: 'flex', flexWrap: 'wrap', gap: 12, ...rtl }}>
      {(shot.notes || []).filter(([k0]) => !(k0 === 'wrong' && t > e('double') + 0.5)).map(([k0, text, tone], i) => <div key={i} style={{ ...glass(tone === 'red' ? C.red : tone === 'green' ? C.green : C.gold), padding: '8px 20px 12px', ...txt(26, 900, tone === 'red' ? C.red : tone === 'green' ? C.green : C.ink), opacity: pop(t, e(k0)) * (k0 === 'wrong' ? 1 - pop(t, e('double')) : 1) }}>{text}</div>)}</div>
    {wrong && <div style={{ position: 'absolute', left: 290, top: 540, transform: 'rotate(-6deg)', border: `6px solid ${C.red}`, borderRadius: 16, padding: '4px 26px 10px', background: 'rgba(13,17,23,0.85)', ...txt(48, 900, C.red), ...rtl }}>شبکه اشتباه = پول گم شد</div>}
    <SideList title="احراز هویت و برداشت" rows={KYC} n={n} t={t} tick={e('tick')} />
    {shot.cap && <Cap text={shot.cap} k={pop(t, e('cap'))} y={752} size={32} />}
  </AbsoluteFill>;
}
// USDT -> your wallet -> a reputable exchanger -> cash
export function cashOut({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  const N = [['usdt', 'تتر', e('usdt')], ['wallet', 'کیف‌پول تو', e('wallet')], ['bank', 'صرافی معتبر', e('exch')], ['money', 'پول نقد', e('cash')]];
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 300, ...center, gap: 60, direction: 'ltr' }}>{N.map(([g, l, at], i) => <React.Fragment key={i}>
      <div style={{ width: 300, height: 300, borderRadius: 150, ...glass(i === 3 ? C.green : C.gold), ...center, flexDirection: 'column', gap: 14, opacity: pop(t, at), transform: `scale(${0.8 + 0.2 * pop(t, at)})` }}>{ICON(g, 120, i === 3 ? C.green : C.gold2, 6)}<span style={txt(34, 900, C.ink)}>{l}</span></div></React.Fragment>)}</div>
    <SVG>{[0, 1, 2].map(i => <Arrow key={i} x1={575 + i * 360} y1={450} x2={625 + i * 360} y2={450} c={C.gold2} w={7} head={16} p={prog(t, N[i + 1][2] - 0.3, 0.4)} />)}</SVG>
  </AbsoluteFill>;
}
// a trap (shot.n 1-4) with the four traps on the right
export function trap({ shot }) {
  const t = useT(), n = shot.n, e = k0 => ev(shot, k0, 1e9);
  const T = ['پراپ‌فرم جعلی', 'فروشنده‌های «پاس کردن»', 'ربات و سیگنال معجزه‌گر', 'خرید پشت‌سرهم آزمون'];
  return <AbsoluteFill>
    <RedAlert k={0.35} s={t} />
    <NumHead n={n} label={`دام ${faNum(n)}: ${T[n - 1]}`} t={t} />
    {n === 1 && <><Panel x={260} y={240} w={1100} h={330} k={pop(t, 0.3)} title="www.best-prop-firm…" tone={C.red}>
      <div style={{ padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 30, ...rtl }}><div style={{ padding: '18px 30px 22px', borderRadius: 18, background: 'linear-gradient(90deg,#FF5A3C,#FFB547)', ...txt(54, 900, '#fff'), opacity: pop(t, e('discount')), transform: `scale(${1 + 0.05 * Math.sin(t * 6)})` }}>۹۰٪ تخفیف!</div>
        <span style={{ ...txt(38, 900, C.ink), opacity: pop(t, e('promise')) }}>وعده‌های بزرگ</span></div>
      <div style={{ padding: '0 34px', display: 'flex', gap: 20, ...rtl }}><div style={{ ...glass(C.green), padding: '8px 20px 12px', ...txt(28, 900, C.green), opacity: pop(t, e('pass')) }}>آزمون قبول ✓</div><div style={{ ...glass(C.red), padding: '8px 20px 12px', ...txt(28, 900, C.red), opacity: pop(t, e('denied')) }}>برداشت رد شد: «بهانه»</div></div></Panel>
      <Chip text="قبل از خرید: سابقه و برداشت‌های واقعی را چک کن" k={pop(t, e('check'))} x={260} y={620} size={32} tone={C.gold} color={C.gold2} /></>}
    {n === 2 && <><div style={{ position: 'absolute', left: 260, top: 250, width: 560, ...rtl }}><Bubble t={t} at={e('say')} text="آزمونت را برایت پاس می‌کنیم 😉" w={540} size={32} />
        <div style={{ marginTop: 24, opacity: pop(t, e('money')), display: 'flex', alignItems: 'center', gap: 14, ...txt(32, 900, C.ink) }}><Gly n="dollar" s={50} c={C.gold2} />پول می‌گیرند و با حساب تو معامله می‌کنند</div></div>
      <div style={{ position: 'absolute', left: 900, top: 250, width: 460, display: 'flex', flexDirection: 'column', gap: 16, ...rtl }}>{[['خلاف قانون همه شرکت‌ها', e('rule')], ['کشف می‌شود: حساب بسته', e('found')], ['برداشت باطل', e('void')], ['خیلی‌هایشان کلاهبردارند', e('scam')]].map(([l, at], i) => <div key={i} style={{ ...glass(C.red), padding: '12px 22px 16px', display: 'flex', alignItems: 'center', gap: 12, ...txt(30, 900, C.ink), opacity: pop(t, at) }}><OkMark ok={false} s={34} />{l}</div>)}</div></>}
    {n === 3 && <><div style={{ position: 'absolute', left: 300, top: 260, ...center, flexDirection: 'column', gap: 16, opacity: pop(t, e('bot')) }}><div style={{ transform: `translateY(${8 * Math.sin(t * 3)}px)` }}><Gly n="robot" s={220} c={C.gold2} sw={5} /></div>
        <div style={{ ...glass(C.gold), padding: '10px 24px 14px', ...txt(34, 900, C.gold2), opacity: pop(t, e('two')) }}>پاس در ۲ روز!</div></div>
      <div style={{ position: 'absolute', left: 760, top: 270, width: 600, display: 'flex', flexDirection: 'column', gap: 18, ...rtl }}>{[['کپی معامله و بعضی ربات‌ها: ممنوع', e('banned')], ['ریسک خیلی بالا', e('risk')]].map(([l, at], i) => <div key={i} style={{ ...glass(C.red), padding: '16px 24px 20px', display: 'flex', alignItems: 'center', gap: 14, ...txt(34, 900, C.ink), opacity: pop(t, at) }}><OkMark ok={false} s={40} />{l}</div>)}
        <div style={{ opacity: pop(t, e('risk')), height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}><div style={{ width: `${92 * prog(t, e('risk'), 1.0)}%`, height: '100%', background: 'linear-gradient(270deg,#E63212,#FFB547)' }} /></div></div></>}
    {n === 4 && <><div style={{ position: 'absolute', left: 280, top: 260, display: 'flex', gap: 18, direction: 'ltr', opacity: pop(t, e('buy')) }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ width: 200, height: 150, ...glass(C.red), ...center, flexDirection: 'column', gap: 8, opacity: pop(t, e('buy') + i * 0.5), transform: `rotate(${(i - 1.5) * 3}deg)` }}><Gly n="cart" s={64} c={C.red} sw={7} /><span style={txt(24, 900, C.ink)}>آزمون جدید</span></div>)}</div>
      <div style={{ position: 'absolute', left: 1180, top: 250, opacity: pop(t, e('angry')), transform: `rotate(${4 * Math.sin(t * 9)}deg)` }}><Gly n="angry" s={170} c={C.red} sw={6} /></div>
      <Chip text="همین، درآمد شرکت را می‌سازد" k={pop(t, e('income'))} x={280} y={460} size={32} tone={C.red} color={C.red} icon={<Gly n="bank" s={34} c={C.red} sw={8} />} />
      <Chip text="رد شدی؟ اول ژورنال: بفهم چرا" k={pop(t, e('journal'))} x={280} y={560} size={34} tone={C.green} color={C.green} icon={<Ico n="book" s={34} c={C.green} sw={8} />} />
      <Chip text="بعد، با ذهن آرام، دوباره" k={pop(t, e('calm'))} x={280} y={655} size={34} tone={C.green} color={C.green} /></>}
    <SideList title="۴ دام" rows={TRAPS} n={n} t={t} tick={e('tick')} bad />
    {shot.cap && <Cap text={shot.cap} k={pop(t, e('cap'))} y={742} tone={C.red} size={34} />}
  </AbsoluteFill>;
}
// two «never» rules: never borrowed money for a test; never give your account and password to anyone
export function always({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  return <AbsoluteFill>
    <Chip text="یک قانون همیشگی" k={pop(t, 0.2)} y={150} size={40} tone={C.gold} color={C.gold2} />
    {[['dollar', 'هرگز با پول قرضی آزمون نخر', e('loan')], ['key', 'هرگز حساب و رمزت را به کسی نده', e('pass')]].map(([g, l, at], i) => <div key={i} style={{ position: 'absolute', left: 340, top: 280 + i * 200, width: 1240, height: 160, ...glass(C.red), display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px', opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * 40}px)`, ...rtl }}>
      {ICON(g, 90, C.red, 7)}<span style={txt(52, 900, C.ink)}>{l}</span></div>)}
  </AbsoluteFill>;
}
// a strategy rule (shot.n 1-5, shot.mode risk | daily | time | tested | small) with the five rules on the right
export function strat({ shot }) {
  const t = useT(), n = shot.n, mode = shot.mode, e = k0 => ev(shot, k0, 1e9);
  const LAB = ['ریسک کم', 'حد روزانه خودت را کوچک بگذار', 'زمان را فراموش کن', 'فقط یک روش تست‌شده', 'کوچک شروع کن'];
  return <AbsoluteFill>
    <NumHead n={n} label={`قانون ${faNum(n)}: ${LAB[n - 1]}`} t={t} />
    {mode === 'risk' && <>
      <Chip text="ریسک هر معامله: ۰٫۵٪ = ۵۰۰ دلار" k={pop(t, e('half'))} x={260} y={240} size={36} tone={C.green} color={C.green} />
      {[['ریسک ۰٫۵٪', 20, C.green, e('twenty'), '۲۰ ضرر پشت هم'], ['ریسک ۳٪', 4, C.red, e('three'), 'فقط ۳ یا ۴ ضرر']].map(([l, nb, col, at, res], r) => <div key={r} style={{ position: 'absolute', left: 260, top: 380 + r * 170, width: 1120, opacity: pop(t, at - 0.4), ...rtl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><span style={{ ...txt(32, 900, col), width: 170 }}>{l}</span>
          <div style={{ position: 'relative', width: 700, height: 70, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', gap: nb > 10 ? 3 : 6, padding: 4, direction: 'rtl' }}>{Array.from({ length: nb }, (_, i) => <div key={i} style={{ flex: nb > 10 ? 1 : 'none', width: nb > 10 ? undefined : 700 * (r ? 0.3 : 0.05) - 6, background: col, borderRadius: 6, opacity: t > at + i * (nb > 10 ? 0.08 : 0.3) ? 1 : 0.1 }} />)}
            <div style={{ position: 'absolute', left: -4, top: -10, bottom: -10, width: 5, background: C.red }} /></div>
          <span style={{ ...txt(30, 900, C.ink), opacity: pop(t, at + (r ? 1.2 : 1.8)) }}>{res}</span></div></div>)}
      <div style={{ position: 'absolute', left: 300, top: 720, ...txt(26, 800, C.mute), opacity: pop(t, e('twenty')), ...rtl }}>خط قرمز: حد ضرر کل ۱۰٪</div></>}
    {mode === 'daily' && <>
      {[['حد شرکت', 5, C.red, e('firm')], ['حد خودت', 1.5, C.green, e('own')]].map(([l, v, col, at], i) => <div key={i} style={{ position: 'absolute', left: 280 + i * 420, top: 260, width: 360, height: 400, ...glass(col), opacity: pop(t, at), ...center, flexDirection: 'column', gap: 16, ...rtl }}>
        <span style={txt(34, 900, C.ink)}>{l}</span><div style={{ width: 90, height: 240, borderRadius: 14, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(v / 5) * 100 * prog(t, at, 0.8)}%`, background: col }} /></div>
        <span style={{ ...txt(44, 900, col) }}>{`${faNum(String(v).replace('.', '٫'))}٪`}</span></div>)}
      <div style={{ position: 'absolute', left: 1140, top: 280, ...center, flexDirection: 'column', gap: 16, opacity: pop(t, e('two')) }}>
        <div style={{ display: 'flex', gap: 12 }}>{[0, 1].map(i => <div key={i} style={{ ...glass(C.red), padding: '8px 18px 12px', ...txt(28, 900, C.red), opacity: pop(t, e('two') + i * 0.4) }}>ضرر</div>)}</div>
        <div style={{ opacity: pop(t, e('off')), transform: `scale(${0.8 + 0.2 * pop(t, e('off'))})`, ...center, flexDirection: 'column', gap: 10 }}><Gly n="power" s={140} c={C.red} sw={8} /><span style={txt(32, 900, C.ink)}>کامپیوتر خاموش</span></div></div></>}
    {mode === 'time' && <>
      <svg style={{ position: 'absolute', left: 300, top: 240 }} width={420} height={420}><Clock x={210} y={210} r={170} h={10} m={(t * 90) % 60} k={pop(t, e('forget'))} /><line x1={40} y1={380} x2={380} y2={40} stroke={C.red} strokeWidth={14} strokeLinecap="round" opacity={pop(t, e('limit'))} /></svg>
      <Chip text="بیشتر شرکت‌ها: محدودیت زمانی سخت ندارند" k={pop(t, e('limit'))} x={760} y={320} size={32} />
      <Chip text="عجله = دشمن اصلی قبولی" k={pop(t, e('rush'))} x={760} y={430} size={40} tone={C.red} color={C.red} icon={<Gly n="fire" s={40} c={C.red} sw={8} />} /></>}
    {mode === 'tested' && <>
      <div style={{ position: 'absolute', left: 280, top: 250, display: 'flex', gap: 30, ...rtl }}>{[['rise', 'روی گذشته', e('past')], ['layers', 'روی حساب آزمایشی', e('demo')]].map(([g, l, at], i) => <div key={i} style={{ width: 420, height: 300, background: '#F6EEDC', borderRadius: 6, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(${i ? 2 : -2}deg)`, opacity: pop(t, at), ...center, flexDirection: 'column', gap: 12 }}>
        {ICON(g, 100, '#1E7A6E', 7)}<span style={txt(34, 900, '#3A2E10')}>{l}</span><span style={txt(30, 900, '#1E7A6E')}>نتیجه مثبت ✓</span></div>)}</div>
      <Chip text="آزمون، جای امتحان روش جدید نیست" k={pop(t, e('notnew'))} x={280} y={630} size={38} tone={C.red} color={C.red} /></>}
    {mode === 'small' && <>
      <div style={{ position: 'absolute', left: 280, top: 250, display: 'flex', gap: 22, alignItems: 'flex-end', direction: 'ltr' }}>{[['۱۰,۰۰۰', 120, true], ['۲۵,۰۰۰', 170, true], ['۵۰,۰۰۰', 230, false], ['۱۰۰,۰۰۰', 300, false]].map(([l, h, first], i) => <div key={i} style={{ width: 230, height: h + 90, ...glass(first ? C.green : 'rgba(255,255,255,0.2)'), opacity: pop(t, (first ? e('small') : e('bigger')) + i * 0.2) * (first ? 1 : 0.85), ...center, flexDirection: 'column', gap: 10 }}>
        <span style={{ fontFamily: NUM, fontWeight: 900, fontSize: 38, color: first ? C.green : C.ink, direction: 'ltr' }}>{`${l}$`}</span>{first && <span style={txt(24, 900, C.green)}>اولین آزمون</span>}</div>)}</div>
      <Chip text="هزینه کمتر، تجربه همان" k={pop(t, e('cheaper'))} x={280} y={665} size={34} tone={C.green} color={C.green} />
      <Chip text="اولین برداشت ← حساب بزرگ‌تر" k={pop(t, e('bigger'))} x={780} y={665} size={34} tone={C.gold} color={C.gold2} icon={<Gly n="rise" s={34} c={C.gold2} sw={9} />} /></>}
    <SideList title="استراتژی قبولی" rows={STRAT} n={n} t={t} tick={e('tick')} />
    {shot.cap && <Cap text={shot.cap} k={pop(t, e('cap'))} y={742} size={32} />}
  </AbsoluteFill>;
}
// the courses: level 2 and level 3 playlists on this channel (links in the description)
export function courses({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  return <AbsoluteFill>
    <Chip text="می‌خواهی این روش‌ها را کامل یاد بگیری؟" k={pop(t, 0.2)} y={140} size={38} />
    {[['سطح ۲', ['تحلیل هفتگی', 'پرایس اکشن'], e('l2')], ['سطح ۳', ['چک‌لیست ورود', 'مدیریت معامله'], e('l3')]].map(([l, items, at], i) => <div key={i} style={{ position: 'absolute', left: 1000 - i * 680, top: 260, width: 600, height: 340, ...glass(C.gold), opacity: pop(t, at), transform: `translateY(${(1 - pop(t, at)) * 26}px)`, padding: '26px 30px', ...rtl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><Badge text={l} size={36} /><span style={txt(30, 800, C.mute)}>دوره در همین کانال</span></div>
      {items.map((it, j) => <div key={j} style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, ...txt(36, 900, C.ink) }}><OkMark ok s={36} />{it}</div>)}</div>)}
    <Chip text="لینک پلی‌لیست‌ها در توضیحات" k={pop(t, e('links'))} y={650} size={36} tone={C.green} color={C.green} icon={<Ico n="down" s={36} c={C.green} sw={9} />} />
  </AbsoluteFill>;
}
// summary rows (shot.rows = indices) and, on the second shot, «سود تضمینی وجود ندارد»
const SUMR = ['پراپ‌فرم = معامله با سرمایه شرکت + هزینه آزمون', 'مقیم افغانستان ✗ · مقیم خارج با اقامه ✓', 'همیشه قبل از خرید، فهرست کشورها را چک کن', '۵ معیار: سابقه، کشور، تتر، قانون ساده، بازار', 'احراز هویت با مدارک خودت؛ برداشت به کیف‌پول خودت', 'دوری از شرکت جعلی، فروش پاس، ربات معجزه', 'ریسک ۰٫۵٪، حد روزانه کوچک، بدون عجله، روش تست‌شده'];
export function summary({ shot }) {
  const t = useT(), rows = shot.rows, keys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'], ng = ev(shot, 'none', 1e9), ed = ev(shot, 'edu', 1e9);
  return <AbsoluteFill>
    <Chip text="جمع‌بندی" k={pop(t, 0.1)} x={260} y={130} size={40} />
    <div style={{ position: 'absolute', left: 260, top: 230, width: 1400, display: 'flex', flexDirection: 'column', gap: 14, ...rtl }}>
      {rows.map((r, j) => { const at = ev(shot, keys[r], 0.6 + j * 1.5), k = pop(t, at); return <div key={r} style={{ height: 80, ...glass(t > at ? C.gold : 'rgba(255,255,255,0.12)'), display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', opacity: 0.2 + 0.8 * k, transform: `translateX(${(1 - k) * 30}px)` }}>
        <div style={{ width: 50, height: 50, borderRadius: 25, background: t > at ? 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)' : 'rgba(255,255,255,0.08)', ...center, ...txt(28, 900, '#1b1203'), flex: 'none' }}>{faNum(r + 1)}</div><span style={txt(34, 900, t > at ? C.ink : C.mute)}>{SUMR[r]}</span></div>; })}</div>
    {shot.five && <div style={{ position: 'absolute', left: 260, top: 350, width: 1400, display: 'flex', flexWrap: 'wrap', gap: 16, ...rtl }}>{shot.five.map((c, i) => { const kk = pop(t, ev(shot, `f${i + 1}`, 2 + i)); return <div key={i} style={{ ...glass(C.green), padding: '10px 26px 14px', ...txt(34, 900, C.green), opacity: kk, transform: `translateY(${(1 - kk) * 16}px)` }}>{c}</div>; })}</div>}
    {ng < 1e8 && <div style={{ position: 'absolute', left: 0, right: 0, top: 600, ...center, opacity: pop(t, ng), transform: `scale(${0.9 + 0.1 * pop(t, ng)})` }}><div style={{ border: `5px solid ${C.red}`, borderRadius: 20, padding: '8px 40px 14px', background: 'rgba(13,17,23,0.85)', ...txt(60, 900, C.red), ...rtl }}>سود تضمینی وجود ندارد</div></div>}
    <Chip text="این ویدیو آموزشی است، نه توصیه مالی" k={pop(t, ed)} y={730} size={32} />
  </AbsoluteFill>;
}
// end: like («خوشحالمان کن»), subscribe + bell, Instagram follow, then the comment «از کدام کشور هستی؟» and share with a friend
export function ctaEnd({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9), k = pop(t, 0.2);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 660, top: 110, width: 600, height: 600 * 758 / 1320, borderRadius: 22, overflow: 'hidden', border: `3px solid ${C.gold}`, boxShadow: '0 30px 90px rgba(0,0,0,0.6)', opacity: k * (1 - 0.5 * pop(t, e('ig'))), transform: `translateY(${(1 - k) * 30}px)` }}><Img src={staticFile('yt_channel.jpg')} style={{ width: '100%', height: '100%' }} /></div>
    <div style={{ position: 'absolute', left: 400, right: 400, top: 470, height: 190, borderRadius: 28, ...glass(C.gold), opacity: pop(t, 0.5) }} />
    <ChannelButtons t={t} like={e('like')} sub={e('sub')} bell={e('bell')} y={510} />
    <div style={{ position: 'absolute', left: 1530, top: 500, ...txt(30, 900, C.gold2), opacity: pop(t, e('happy')), ...rtl }}>👍 خوشحالمان کن</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 690, ...center, opacity: pop(t, e('ig')), transform: `translateY(${(1 - pop(t, e('ig'))) * 30}px)` }}>
      <div style={{ ...glass(t > e('follow') ? C.gold : 'rgba(255,255,255,0.2)'), padding: '14px 34px 18px', display: 'flex', alignItems: 'center', gap: 22, ...rtl }}>
        <span style={txt(36, 900, C.ink)}>اینستاگرام</span><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 38, color: C.gold2, direction: 'ltr' }}>@kamalhaqjo</span>
        <span style={{ padding: '6px 22px 8px', borderRadius: 12, background: t > e('follow') ? C.green : 'rgba(255,255,255,0.12)', fontFamily: NUM, fontWeight: 800, fontSize: 30, color: '#fff', direction: 'ltr' }}>{t > e('follow') ? 'Following ✓' : 'Follow'}</span></div></div>
  </AbsoluteFill>;
}
export function ctaComment({ shot }) {
  const t = useT(), e = k0 => ev(shot, k0, 1e9);
  return <AbsoluteFill>
    <Panel x={300} y={170} w={1000} h={470} k={pop(t, 0.2)} title="کامنت‌ها">
      <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: pop(t, e('country')) }}><Ico n="user" s={64} c={C.gold2} sw={6} /><div style={{ ...glass(C.gold), padding: '12px 24px 16px', ...txt(36, 900, C.ink) }}>از کدام کشور هستی؟ 🌍</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: pop(t, e('which')) }}><Ico n="user" s={64} c={C.gold2} sw={6} /><div style={{ ...glass(C.gold), padding: '12px 24px 16px', ...txt(34, 900, C.ink) }}>کدام پراپ‌فرم را بیشتر بررسی کنیم؟</div></div>
        <div style={{ height: 70, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', ...txt(30, 800, C.mute), opacity: pop(t, e('country') + 0.5) }}>{'نوشتن کامنت…'.slice(0, Math.max(1, Math.floor(12 * prog(t, e('country') + 0.5, 1.2))))}</div></div></Panel>
    <div style={{ position: 'absolute', left: 1360, top: 220, width: 380, height: 380, ...glass(C.green), opacity: pop(t, e('share')), ...center, flexDirection: 'column', gap: 18, ...rtl }}>
      <Gly n="share" s={130} c={C.green} sw={6} /><span style={{ ...txt(32, 900, C.ink), textAlign: 'center', whiteSpace: 'normal', padding: '0 20px' }}>برای رفیقی بفرست که دنبال پراپ‌فرم است</span></div>
    <Chip text="شاید پولش را از یک کلاهبرداری نجات بدهی" k={pop(t, e('save'))} y={690} size={34} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
export function outroPF() { return <BrandOutro course="ویدیوی ویژه · پراپ‌فرم برای افغان‌ها" badge="ویدیوی ویژه" />; }

// ==== level 3, lesson 10: the anatomy of one winning trade on gold, in nine stages (the stage bar on top, Lesson.jsx). Days run left to
// right (Saturday to Friday); R lines: entry white dashed, stop red, break-even gold, target green; every chart and sketch «مثال فرضی». ====
const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const CL10 = ['جهت تایم بالا: صعودی', 'ناحیه مهم: اردر بلاک روزانه، منطقه ارزان', 'نقدینگی: کف آسیا و کف دو روز پیش', 'زمان: پنجره دوم', 'شکست ساختار در تایم پایین', 'ناحیه ورود: شکاف قیمتی پشت شکست', 'سود به ضرر: حدود ۴ به ۱'];
const STG = ['پلن هفتگی', 'روزهای صبر', 'آماده‌سازی روزانه', 'نیویورک، پنجره دوم', 'چک‌لیست ۷ قدمی', 'حجم', 'مدیریت', 'خروج', 'ژورنال'];
const StageHead = ({ n, sub = null, t }) => <NumHead n={n} label={`مرحله ${faNum(n)}: ${STG[n - 1]}${sub ? ` · ${sub}` : ''}`} t={t} />;
// a week strip, days left to right; marks = [[day, event, label, tone]]
const Week = ({ t, y = 360, k = 1, marks = [], hot = [], dim = [] }) => <div style={{ position: 'absolute', left: 180, top: y, width: 1560, display: 'flex', gap: 14, direction: 'ltr', opacity: k }}>
  {DAYS.map((d, i) => { const m = marks.filter(x => x[0] === i), on = hot.includes(i);
    return <div key={i} style={{ flex: 1, height: 170, borderRadius: 18, ...glass(on ? C.gold : 'rgba(255,255,255,0.12)'), opacity: dim.includes(i) ? 0.35 : 1, ...center, flexDirection: 'column', gap: 10, ...rtl }}>
      <span style={txt(30, 900, on ? C.gold2 : C.ink)}>{d}</span>
      {m.map(([, at, lab, tone], j) => <span key={j} style={{ ...txt(22, 900, tone === 'green' ? C.green : tone === 'red' ? C.red : C.gold2), opacity: pop(t, at), whiteSpace: 'normal', textAlign: 'center', padding: '0 8px' }}>{lab}</span>)}</div>; })}</div>;
// 1. hook: a winning trade starts at the weekend, not at the buy button (the trade spans the week)
export function hookWeek({ shot }) {
  const t = useT(), wk = ev(shot, 'week', 1.0), bt = ev(shot, 'button', 3.0), g = ease(prog(t, wk, 1.6));
  return <AbsoluteFill>
    <Big text="یک معامله سودده از آخر هفته شروع می‌شود…" k={pop(t, 0.1)} y={150} size={58} />
    <Week t={t} y={340} k={pop(t, 0.3)} hot={[0, 4, 5]} marks={[[0, wk, 'پلن', ''], [2, wk + 0.4, 'صبر', ''], [3, wk + 0.6, 'صبر', ''], [4, bt, 'ورود', 'green'], [5, wk + 1.0, 'خروج', '']]} />
    <div style={{ position: 'absolute', left: 180, top: 540, width: 1560 * 6 / 7 * g, height: 18, borderRadius: 9, background: `linear-gradient(90deg, ${C.gold}, ${C.gold2})`, boxShadow: '0 0 20px rgba(232,201,106,0.5)' }} />
    <div style={{ position: 'absolute', left: 180, top: 572, ...txt(30, 900, C.gold2), opacity: pop(t, wk + 0.8), ...rtl }}>معامله</div>
    <div style={{ position: 'absolute', left: 180 + 4.5 * (1560 + 14) / 7 - 120, top: 620, width: 240, ...center, flexDirection: 'column', gap: 10, opacity: pop(t, bt) }}>
      <div style={{ padding: '10px 34px 14px', borderRadius: 16, background: C.green, ...txt(36, 900, '#fff') }}>خرید</div>
      <span style={{ ...txt(26, 900, C.mute), ...rtl }}>نه از این لحظه</span></div>
  </AbsoluteFill>;
}
// 2. today: the anatomy of one winning trade on gold, step by step; every level 2 and 3 lesson in one trade
export function agenda10({ shot }) {
  const t = useT(), keys = ['plan', 'prep', 'entry', 'manage', 'exit', 'journal'], labs = ['پلن هفتگی', 'آماده‌سازی روزانه', 'ورود', 'مدیریت', 'خروج', 'ژورنال'], lv = ev(shot, 'levels', 1e9);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 150, ...center, flexDirection: 'column', gap: 16, opacity: pop(t, 0.1), ...rtl }}>
      <div style={badge}>سطح ۳ · درس ۱۰</div><div style={txt(70, 900, C.ink)}>کالبدشکافی یک معامله <span style={{ color: C.green }}>سودده</span> روی طلا</div></div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 420, ...center, gap: 14, direction: 'ltr' }}>{labs.map((l, i) => { const at = ev(shot, keys[i], 1.5 + i * 0.6), k = pop(t, at);
      return <React.Fragment key={i}>{i > 0 && <span style={{ ...txt(34, 900, C.gold2), opacity: k }}>→</span>}<div style={{ ...glass(t > at ? C.gold : 'rgba(255,255,255,0.12)'), padding: '14px 24px 18px', ...txt(32, 900, t > at ? C.ink : C.mute), opacity: 0.25 + 0.75 * k, transform: `translateY(${(1 - k) * 16}px)` }}>{l}</div></React.Fragment>; })}</div>
    <Chip text="همه درس‌های سطح ۲ و ۳، در یک معامله" k={pop(t, lv)} y={600} size={38} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// 3. remember: an educational example; the goal is the process, not copying the trade
export function disclaim({ shot }) {
  const t = useT(), ex = ev(shot, 'example', 0.4), gl = ev(shot, 'goal', 1.8), cp = ev(shot, 'copy', 3.2);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 200, ...center, flexDirection: 'column', gap: 22, opacity: pop(t, ex) }}><Ico n="shield" s={150} c={C.gold2} sw={6} /><span style={txt(60, 900, C.ink)}>یک نمونه آموزشی</span></div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 560, ...center, gap: 30, ...rtl }}>
      <div style={{ ...glass(C.green), padding: '14px 32px 18px', display: 'flex', alignItems: 'center', gap: 14, ...txt(40, 900, C.green), opacity: pop(t, gl) }}><OkMark ok s={40} />یاد گرفتن فرایند</div>
      <div style={{ ...glass(C.red), padding: '14px 32px 18px', display: 'flex', alignItems: 'center', gap: 14, ...txt(40, 900, C.red), opacity: pop(t, cp) }}><OkMark ok={false} s={40} />کپی کردن معامله</div></div>
  </AbsoluteFill>;
}
// stage 1a: the weekly chart: higher highs and lows; last week broke the previous high and pulled back a little
export function weekly10({ shot }) {
  const t = useT(), up = ev(shot, 'up', 1.4), hh = ev(shot, 'hh', 3.0), bk = ev(shot, 'broke', 5.2), pb = ev(shot, 'back', 6.6);
  const P = [[320, 680], [420, 560], [480, 610], [600, 470], [660, 520], [790, 380], [860, 430], [1000, 300], [1060, 345]], d = prog(t, up - 0.6, Math.max(1.5, bk - up + 0.6)), p2 = prog(t, pb - 0.3, 0.8);
  return <AbsoluteFill>
    <StageHead n={1} sub="شنبه" t={t} />
    <SVG><Sketch x={280} y={240} w={1100} h={540} k={pop(t, 0.3)} title="طلا · هفتگی" tf="W1" />
      <line x1={790} x2={1340} y1={380} y2={380} stroke={C.gold2} strokeWidth={3} strokeDasharray="10 8" opacity={pop(t, bk - 0.6)} />
      <Path pts={P.slice(0, 8).map((q, i) => [q[0], q[1], seg(d, 7, i - 1)])} w={6} c={C.green} />
      <Path pts={P.slice(7).map((q, i) => [q[0], q[1], i ? p2 : 1])} w={6} c={C.green} />
      {[[420, 560, 'HH'], [600, 470, 'HH'], [790, 380, 'HH'], [480, 610, 'HL'], [660, 520, 'HL']].map(([x, y, l], i) => <text key={i} x={x} y={l === 'HH' ? y - 18 : y + 38} textAnchor="middle" style={nv(24, l === 'HH' ? C.green : C.blue, 800)} opacity={pop(t, hh + i * 0.15)}>{l}</text>)}
      <text x={1180} y={370} textAnchor="middle" direction="rtl" style={sv(26, 900, C.gold2)} opacity={pop(t, bk)}>سقف قبلی شکست</text></SVG>
    <Chip text="هفتگی صعودی: سقف‌ها و کف‌ها بالاتر" k={pop(t, up)} x={1420} y={300} size={28} tone={C.green} color={C.green} />
    <Chip text="کمی برگشت" k={pop(t, pb)} x={1420} y={400} size={28} />
    <Hypo x={300} y={740} />
  </AbsoluteFill>;
}
// stage 1b: the daily chart: a fresh order block under price in the cheap half of the last leg up; under it the low of two days ago = liquidity
export function daily10({ shot }) {
  const t = useT(), ob = ev(shot, 'ob', 1.0), ch = ev(shot, 'cheap', 2.6), lw = ev(shot, 'low', 4.6), lq = ev(shot, 'liq', 6.0);
  const P = [[320, 620], [430, 690], [520, 600], [600, 640], [760, 340], [860, 400], [940, 430]], d = prog(t, 0.2, 2.0);
  return <AbsoluteFill>
    <StageHead n={1} sub="شنبه" t={t} />
    <SVG><Sketch x={280} y={240} w={1100} h={540} k={pop(t, 0.1)} title="طلا · روزانه" tf="D1" />
      <PDBox x={420} y={340} w={920} h={350} k={pop(t, ch)} zp={0} zd={1} eq={prog(t, ch, 0.8)} pct={0} tagSize={32} />
      <OBBox x={580} y={560} w={760} h={60} k={pop(t, ob)} lock={prog(t, ob, 0.7)} label="اردر بلاک تازه" />
      <line x1={600} x2={1340} y1={640} y2={640} stroke={LQ} strokeWidth={3} strokeDasharray="10 8" opacity={pop(t, lw)} />
      <Liq x={570} y={656} w={120} rows={1} n={5} k={pop(t, lq)} />
      <text x={760} y={706} textAnchor="middle" direction="rtl" style={sv(26, 900, LQ)} opacity={pop(t, lw)}>کف دو روز پیش = نقدینگی</text>
      <Path pts={P.map((q, i) => [q[0], q[1], seg(d, P.length - 1, i - 1)])} w={6} />
      <circle cx={940} cy={430} r={10} fill={C.ink} opacity={pop(t, 2.2)} /><text x={960} y={420} style={sv(24, 900, C.ink)} direction="rtl" textAnchor="end" opacity={pop(t, 2.2)}>قیمت</text></SVG>
    <Hypo x={300} y={740} />
  </AbsoluteFill>;
}
// stage 1c: the written plan: the main scenario (IF... THEN buy, target last week's high), scenario two (daily close under the OB = void),
// the calendar (red news only on Friday)
export function plan10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d);
  const IF = [['sweep', 'کف دو روز پیش زده شود'], ['inob', 'وارد اردر بلاک روزانه شود'], ['bos', 'در نیویورک ساختار به بالا بشکند']];
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <SVG>{Array.from({ length: 40 }, (_, i) => <line key={'v' + i} x1={i * 50} x2={i * 50} y1={0} y2={1080} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}{Array.from({ length: 22 }, (_, i) => <line key={'h' + i} x1={0} x2={1920} y1={i * 50} y2={i * 50} stroke="rgba(255,255,255,0.07)" strokeWidth={i % 5 ? 1 : 2} />)}</SVG>
    <div style={{ position: 'absolute', left: 300, top: 140, width: 900, height: 660, background: '#F6EEDC', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(-1deg) translateY(${(1 - pop(t, 0.1)) * 30}px)`, opacity: pop(t, 0.1), padding: '22px 34px', ...rtl }}>
      <div style={txt(36, 900, '#5A4A1A')}>پلن هفتگی طلا · شنبه</div>
      <div style={{ ...txt(30, 900, '#1E7A6E'), marginTop: 20, opacity: pop(t, e('main', 0.6)) }}>سناریوی اصلی: اگر…</div>
      {IF.map(([k0, l], i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, ...txt(28, 800, '#3A2E10'), opacity: pop(t, e(k0, 1.2 + i * 0.8)) }}><span style={{ ...txt(28, 900, '#8A6A1A') }}>{faNum(i + 1)}.</span>{l}</div>)}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, opacity: pop(t, e('buy', 4)) }}><span style={{ padding: '4px 20px 8px', borderRadius: 10, background: '#1E7A6E', ...txt(30, 900, '#fff') }}>آنگاه خرید</span><span style={txt(28, 900, '#3A2E10')}>هدف: سقف هفته گذشته</span></div>
      <div style={{ marginTop: 26, ...txt(28, 900, '#B3261E'), opacity: pop(t, e('second', 6)) }}>سناریوی دوم: بسته شدن روزانه زیر اردر بلاک = باطل</div></div>
    <div style={{ position: 'absolute', left: 1270, top: 220, width: 380, height: 360, background: '#F6EEDC', borderRadius: 10, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', opacity: pop(t, e('cal', 8)), transform: 'rotate(2deg)', padding: '18px 22px', ...rtl }}>
      <div style={txt(30, 900, '#5A4A1A')}>تقویم این هفته</div>
      {DAYS.map((d, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, ...txt(24, 800, '#3A2E10') }}><span>{d}</span><span style={{ width: 22, height: 22, borderRadius: 11, background: d === 'جمعه' ? '#D32F2F' : 'rgba(90,74,26,0.2)', display: 'inline-block' }} /></div>)}
      <div style={{ marginTop: 14, ...txt(24, 900, '#B3261E') }}>خبر قرمز فقط جمعه</div></div>
  </AbsoluteFill>;
}
// stage 2: Monday and Tuesday: price has not reached the zone; the ten-minute preparation, «فقط نگاه», no trade; patience is a step too
export function wait10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d);
  return <AbsoluteFill>
    <StageHead n={2} sub="دوشنبه و سه‌شنبه" t={t} />
    <Week t={t} y={260} k={pop(t, 0.2)} hot={[2, 3]} dim={[0, 1, 4, 5, 6]} marks={[[2, e('look', 3), 'فقط نگاه', ''], [3, e('look', 3) + 0.4, 'فقط نگاه', ''], [2, e('prep', 2), 'آماده‌سازی ۱۰ دقیقه ✓', 'green'], [3, e('prep', 2) + 0.4, 'آماده‌سازی ۱۰ دقیقه ✓', 'green']]} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 470, ...center, gap: 26, ...rtl }}>
      <div style={{ ...glass(C.gold), padding: '12px 28px 16px', display: 'flex', alignItems: 'center', gap: 14, ...txt(34, 900, C.ink), opacity: pop(t, e('notyet', 1)) }}><Ico n="eye" s={40} c={C.gold2} sw={8} />قیمت هنوز به ناحیه نرسیده</div>
      <div style={{ ...glass(C.green), padding: '12px 28px 16px', ...txt(34, 900, C.green), opacity: pop(t, e('none', 4)) }}>معامله: ۰</div></div>
    <Chip text="این دو روز هم بخشی از همین معامله است" k={pop(t, e('part', 5.5))} y={600} size={34} />
    <Chip text="صبر، خودش یک قدم است" k={pop(t, e('patience', 7))} y={700} size={42} tone={C.green} color={C.green} icon={<Ico n="pause" s={40} c={C.green} sw={9} />} />
  </AbsoluteFill>;
}
// stage 3: Wednesday morning: Asia builds a small range; London takes the Asia low, then the low of two days ago, and enters the daily OB;
// a small bounce
export function wedPrep({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), as = e('asia', 1.6), ln = e('london', 3.4), l2 = e('low2', 4.6), ob = e('ob', 5.8), bk = e('back', 7.2);
  const A = [[320, 470], [380, 440], [430, 480], [480, 450], [540, 475], [600, 455]], L = [[600, 455], [660, 520], [700, 500], [760, 590], [800, 570], [860, 655], [900, 640]], B = [[900, 640], [960, 600], [1010, 610]];
  return <AbsoluteFill>
    <StageHead n={3} sub="چهارشنبه" t={t} />
    <SVG><Sess x={300} y={230} w={1040} h={60} on={[t > as ? 1 : 0, t > ln ? 1 : 0, 0]} k={pop(t, 0.3)} />
      <Sketch x={280} y={320} w={1100} h={470} k={pop(t, 0.4)} title="طلا · ۱۵ دقیقه" tf="M15" />
      <rect x={320} y={432} width={280} height={60} fill="rgba(184,196,255,0.12)" stroke="#B8C4FF" strokeWidth={2.5} strokeDasharray="8 6" opacity={pop(t, as)} />
      <text x={460} y={420} textAnchor="middle" direction="rtl" style={sv(24, 900, '#B8C4FF')} opacity={pop(t, as)}>محدوده آسیا</text>
      <OBBox x={820} y={620} w={520} h={70} k={pop(t, 0.6)} label="OB روزانه" glow={t > ob ? 1 : 0} />
      <line x1={330} x2={1340} y1={600} y2={600} stroke={LQ} strokeWidth={3} strokeDasharray="10 8" opacity={pop(t, 0.8)} /><text x={1330} y={590} textAnchor="start" direction="rtl" style={sv(22, 900, LQ)} opacity={pop(t, 0.8)}>کف دو روز پیش</text>
      <Path pts={A.map((q, i) => [q[0], q[1], seg(prog(t, as - 0.6, 1.4), A.length - 1, i - 1)])} w={5} />
      <Path pts={L.map((q, i) => [q[0], q[1], seg(prog(t, ln - 0.3, Math.max(1.4, ob - ln + 0.3)), L.length - 1, i - 1)])} w={5} />
      <Path pts={B.map((q, i) => [q[0], q[1], seg(prog(t, bk - 0.3, 0.9), B.length - 1, i - 1)])} w={5} c={C.green} />
      <Ring x={660} y={520} at={ln + 0.4} t={t} c="#B8C4FF" /><Ring x={760} y={590} at={l2} t={t} c={LQ} r0={14} dr={60} /></SVG>
    <Chip text="لندن کف آسیا را زد" k={pop(t, ln)} x={1420} y={340} size={26} />
    <Chip text="کف دو روز پیش هم زده شد" k={pop(t, l2)} x={1420} y={420} size={26} tone={LQ} color={LQ} />
    <Chip text="وارد اردر بلاک روزانه" k={pop(t, ob)} x={1420} y={500} size={26} tone={C.gold} color={C.gold2} />
    <Chip text="کمی برگشت" k={pop(t, bk)} x={1420} y={580} size={26} tone={C.green} color={C.green} />
    <Hypo x={300} y={752} />
  </AbsoluteFill>;
}
// stage 3b: the journal note of the morning
export function wedJournal({ shot }) {
  const t = useT(), rows = [['ready', 'طلا · روز آماده‌باش', ''], ['liq', 'نقدینگی پایین جمع شد', 'g'], ['zone', 'قیمت در ناحیه است', 'g'], ['wait', 'منتظر شکست ساختار به بالا در نیویورک', ''], ['news', 'خبر مهم: ندارد', 'g']];
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <div style={{ position: 'absolute', left: 460, top: 150, width: 1000, height: 640, background: '#F6EEDC', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(1deg) translateY(${(1 - pop(t, 0.1)) * 30}px)`, opacity: pop(t, 0.1), padding: '26px 40px', ...rtl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...txt(40, 900, '#5A4A1A') }}><Ico n="book" s={46} c="#5A4A1A" sw={8} />ژورنال · چهارشنبه صبح</div>
      {rows.map(([k0, l, g], i) => { const at = ev(shot, k0, 0.8 + i * 1.4); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 26, ...txt(36, 800, '#3A2E10'), opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * 20}px)` }}>
        <span style={{ width: 36, height: 36, borderRadius: 8, border: '3px solid #5A4A1A', ...center, flex: 'none' }}>{g && t > at && <Ico n="check" s={30} c="#1E7A6E" sw={13} />}</span>{l}</div>; })}</div>
  </AbsoluteFill>;
}
// stage 4 (CHART, XAUUSD M5, hypothetical): 9:50 New York: a strong move up, a candle closes above the last high (BOS), a price gap (FVG)
// is left behind; no hurry: wait for the return into the gap
const C5 = (() => { const c = makeCandles([[0, 4130], [4, 4123], [7, 4127], [10, 4120], [12, 4133], [15, 4127], [19, 4134]], 57);
  // the break by hand: the low candle, the strong candle closing above the last high (4127), the gap 4123-4126.5, the retest into it
  [[10, 4122.5, 4120.8, 4123, 4120], [11, 4121, 4131, 4131.5, 4120.6], [12, 4131, 4132.5, 4133, 4126.5], [13, 4132.5, 4130, 4133, 4129.5], [14, 4130, 4127.8, 4130.4, 4127.2], [15, 4127.8, 4129.4, 4129.8, 4125.6],
   [16, 4129.4, 4130.8, 4131.2, 4129], [17, 4130.8, 4130.2, 4131.6, 4129.8], [18, 4130.2, 4132.6, 4133, 4130], [19, 4132.6, 4134, 4134.3, 4132.2]].forEach(([i, o, cl, h, l]) => { c[i] = { o, c: cl, h, l }; });
  return c; })();
const F5 = [4123, 4126.5];
export function nyBOS({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), tm = e('time', 0.6), st = e('strong', 2.4), cl = e('close', 3.8), bs = e('bos', 5.0), fv = e('fvg', 6.6), nh = e('nohurry', 8.6), rt = e('retrace', 10.0);
  const view = [0, 22, 4117, 4137], PWD = 1280, PH = 524, [X, Y] = mapXY(view, PWD, PH);
  const upTo = 10.6 + 2.3 * prog(t, st - 0.3, Math.max(1, cl - st + 0.4)) + 3.0 * prog(t, rt - 0.4, 1.6), brk = t > bs;
  return <AbsoluteFill>
    <StageHead n={4} sub="ساعت ۹:۵۰" t={t} />
    <Platform y={220} h={600} k={pop(t, 0)} w={PWD} sym="XAUUSD" tf="M5" frame={TFC.M15} name="طلا · پنج دقیقه">
      <StructChart t={t} cs={C5} upTo={upTo} view={view} w={PWD} h={PH} />
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={PWD} height={PH}>
        <line x1={X(7)} x2={X(22)} y1={Y(4127)} y2={Y(4127)} stroke={brk ? C.green : C.gold2} strokeWidth={3} strokeDasharray={brk ? undefined : '10 8'} opacity={pop(t, 1.0)} />
        <text x={X(20)} y={Y(4127) - 14} textAnchor="middle" direction="rtl" style={sv(22, 900, brk ? C.green : C.gold2)} opacity={pop(t, 1.0)}>{brk ? 'شکست ساختار ↑' : 'سقف آخر'}</text>
        <FVGBox x={X(10) + 6} y={Y(F5[1])} w={X(22) - X(10) - 6} h={Y(F5[0]) - Y(F5[1])} k={pop(t, fv)} label="شکاف قیمتی" glow={t > rt ? 1 : 0} />
        {t > rt + 1.2 && <g opacity={pop(t, rt + 1.2)}><circle cx={X(15)} cy={Y(C5[15].c)} r={11} fill={C.green} /><Ring x={X(15)} y={Y(C5[15].c)} at={rt + 1.2} t={t} c={C.green} /></g>}</svg></Platform>
    <div style={{ position: 'absolute', left: 1430, top: 230, display: 'flex', flexDirection: 'column', gap: 16, ...rtl }}>
      {[['۹:۵۰ نیویورک · پنجره دوم', tm, C.gold], ['حرکت قوی به بالا', st, C.green], ['شمع بالای سقف آخر بسته شد', cl, C.green], ['شکاف قیمتی پشت حرکت', fv, FV], ['عجله نکردیم', nh, C.gold], ['برگشت به شکاف قیمتی', rt, C.green]].map(([l, at, c], i) => <div key={i} style={{ ...glass(c), padding: '10px 20px 14px', ...txt(26, 900, C.ink), opacity: pop(t, at), transform: `translateX(${(1 - pop(t, at)) * 20}px)` }}>{l}</div>)}</div>
  </AbsoluteFill>;
}
// stage 5: the seven-step checklist: a row turns gold on its name and ticks on the spoken «تیک» (k1..k7); shot.done = rows ticked before the
// shot; row 7 shows the stop, the target and about 4:1; 7 of 7 -> entry
export function check10({ shot }) {
  const t = useT(), done = shot.done || 0, all = ev(shot, 'all', 1e9), en = ev(shot, 'entry', 1e9);
  return <AbsoluteFill>
    <StageHead n={5} t={t} />
    <div style={{ position: 'absolute', left: 260, top: 220, width: 1040, borderRadius: 22, ...glass(C.gold), padding: '16px 26px 20px', opacity: pop(t, 0.2), ...rtl }}>
      {CL10.map((r, i) => { const on = i < done ? -1 : ev(shot, `c${i + 1}`, 1e9), tk = i < done ? -1 : ev(shot, `k${i + 1}`, 1e9), d = t > tk, cur = t > on - 0.1 && !d;
        return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: i ? 8 : 0, padding: '7px 14px', borderRadius: 12, background: cur ? 'rgba(232,201,106,0.14)' : 'transparent' }}>
          <div style={{ width: 42, height: 42, borderRadius: 9, border: `3px solid ${d ? C.green : cur ? C.gold2 : C.mute}`, ...center, flex: 'none', transform: `scale(${d && tk > 0 ? 1 + 0.3 * (1 - pop(t, tk + 0.25)) : 1})` }}>{d && <Ico n="check" s={36} c={C.green} sw={12} />}</div>
          <span style={txt(31, 900, d ? C.ink : cur ? C.gold2 : C.mute)}>{`${faNum(i + 1)}. ${r}`}</span></div>; })}</div>
    <div style={{ position: 'absolute', left: 1360, top: 230, width: 430, display: 'flex', flexDirection: 'column', gap: 14, ...rtl }}>
      {[['sl', 'حد ضرر: زیر پایین‌ترین نقطه لندن', C.red], ['tp', 'هدف: سقف هفته گذشته', C.green], ['rr', 'نسبت: حدود ۴ به ۱', C.gold]].map(([k0, l, c], i) => <div key={i} style={{ ...glass(c), padding: '10px 20px 14px', ...txt(27, 900, C.ink), opacity: pop(t, ev(shot, k0, 1e9)) * (1 - 0.6 * pop(t, all)) }}>{l}</div>)}</div>
    <div style={{ position: 'absolute', left: 1360, top: 470, width: 430, ...center, flexDirection: 'column', gap: 22, opacity: pop(t, all) }}>
      <span style={{ ...txt(92, 900, C.green), ...rtl }}>۷ از ۷</span>
      <div style={{ padding: '12px 50px 18px', borderRadius: 20, background: C.green, ...txt(46, 900, '#fff'), opacity: pop(t, en), transform: `scale(${0.85 + 0.15 * pop(t, en)})`, ...rtl }}>ورود</div></div>
  </AbsoluteFill>;
}
// stage 6: position size: 1% risk; size = risk in dollars ÷ stop distance (a hypothetical account); stop and target set at once
export function size10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), rk = e('risk', 0.6), fm = e('formula', 2.2), ex = e('exact', 5.0), st = e('set', 6.4);
  const box = (lab, val, at, tone = C.gold, w = 330) => <div style={{ width: w, height: 170, ...glass(tone), opacity: 0.2 + 0.8 * pop(t, at), transform: `translateY(${(1 - pop(t, at)) * 20}px)`, ...center, flexDirection: 'column', gap: 6, ...rtl }}><span style={txt(26, 800, C.mute)}>{lab}</span><span style={txt(44, 900, C.ink)}>{val}</span></div>;
  return <AbsoluteFill>
    <StageHead n={6} t={t} />
    <Big text="حجم = ؟" k={pop(t, 0.6) * (1 - pop(t, rk - 0.4))} y={560} size={120} color={C.gold2} />
    <Chip text="ریسک: ۱٪ حساب" k={pop(t, rk)} x={260} y={230} size={36} tone={C.red} color={C.red} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 330, ...center, gap: 22, ...rtl, opacity: pop(t, 0.5) * (0.75 + 0.25 * pop(t, fm)), transform: `translateY(${(1 - pop(t, 0.5)) * 40}px) scale(${0.94 + 0.06 * pop(t, 1.6)})` }}><span style={txt(44, 900, C.gold2)}>حجم</span><span style={txt(44, 900, C.mute)}>=</span>
      {box('ریسک به دلار', '۱۰۰ دلار', fm + 0.4)}<span style={txt(56, 900, C.gold2)}>÷</span>{box('فاصله حد ضرر', '۸ دلار', fm + 0.9)}<span style={txt(56, 900, C.gold2)}>=</span>{box('حجم', '۱۲٫۵ اونس', fm + 1.4, C.green)}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 530, ...center, ...txt(26, 800, C.mute), opacity: pop(t, fm + 1.6), ...rtl }}>مثال فرضی: حساب ۱۰,۰۰۰ دلاری · ۱۲٫۵ اونس ≈ ۰٫۱۲ لات</div>
    <Chip text="حجم دقیق وارد شد" k={pop(t, ex)} x={400} y={610} size={32} tone={C.green} color={C.green} icon={<OkMark ok s={32} />} />
    <Chip text="حد ضرر و هدف، همان لحظه" k={pop(t, st)} x={1000} y={610} size={32} tone={C.green} color={C.green} icon={<OkMark ok s={32} />} />
  </AbsoluteFill>;
}
// stage 7 (R lines): at +1R and a new high the stop moves to the entry (no risk); at 11:30, near the London close, +2R: half closed
export function manage10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), mv = e('move', 0.6), one = e('one', 2.6), be = e('be', 4.6), nr = e('norisk', 6.0), tm = e('time', 7.6), two = e('two', 9.6), hf = e('half', 10.8), rs = e('rest', 12.4);
  const U1 = [[300, 0], [380, 0.4], [430, 0.2], [520, 1.0], [560, 0.8], [600, 1.2]], U2 = [[600, 1.2], [680, 0.9], [740, 1.6], [790, 1.4], [880, 2.0], [920, 1.8]];
  const bmv = ease(prog(t, be, 1.0)), slR = -1 + bmv, v = t > two ? 2 : t > one ? 1 + 0.2 * Math.sin((t - one) * 2) : 1.2 * prog(t, mv, Math.max(1, one - mv));
  return <AbsoluteFill>
    <StageHead n={7} t={t} />
    <SVG><Lv r={4} c={C.green} lab="هدف: سقف هفته گذشته" x2={1100} k={pop(t, 0.3)} />
      <Lv r={2} c="rgba(38,166,154,0.6)" lab="+۲R" dash="8 7" w={2.5} x2={1100} k={pop(t, tm)} />
      <Lv r={1} c="rgba(237,230,214,0.35)" lab="+۱R" dash="6 8" w={2} x2={1100} k={pop(t, one - 0.4)} />
      <Lv r={0} c="rgba(237,230,214,0.6)" lab={bmv > 0.5 ? null : 'ورود'} dash="9 7" w={3} x2={1100} k={pop(t, 0.2)} />
      <Lv r={slR} c={bmv > 0.98 ? C.gold2 : C.red} lab={bmv > 0.98 ? 'حد ضرر = نقطه ورود' : 'حد ضرر'} x2={1100} k={pop(t, 0.3)} />
      <Path pts={rPts(U1, prog(t, mv - 0.3, Math.max(1, one - mv + 0.5)))} w={6} />
      <Path pts={rPts(U2, prog(t, tm - 0.3, Math.max(1.2, two - tm + 0.4)), U2.length, 1)} w={6} />
      <g opacity={pop(t, one + 0.6)}><circle cx={600} cy={ry(1.2)} r={10} fill={C.green} /><text x={600} y={ry(1.2) - 20} textAnchor="middle" direction="rtl" style={sv(22, 900, C.green)}>سقف جدید</text></g>
      <Arrow x1={270} y1={ry(-1) - 8} x2={270} y2={ry(0) + 12} c={C.gold2} w={6} head={16} p={prog(t, be, 0.8)} />
      {t > hf && <g opacity={pop(t, hf)}><circle cx={880} cy={ry(2)} r={12} fill={C.green} /><Ring x={880} y={ry(2)} at={hf} t={t} c={C.green} /><rect x={790} y={ry(2) - 74} width={180} height={44} rx={10} fill={C.green} /><text x={880} y={ry(2) - 43} textAnchor="middle" direction="rtl" style={sv(24, 900, '#fff')}>نصف بسته شد</text></g>}</SVG>
    <div style={{ position: 'absolute', left: 1440, top: 230, width: 330, borderRadius: 20, ...glass(C.green), padding: '16px 24px 20px', opacity: pop(t, 0.4), ...rtl }}>
      <div style={txt(28, 900, C.ink)}>خرید · طلا</div>
      <div style={{ fontFamily: NUM, fontWeight: 900, fontSize: 70, color: C.green, direction: 'ltr', textAlign: 'right', marginTop: 6 }}>{fR(v)}</div>
      <div style={{ ...txt(24, 800, C.mute), marginTop: 8 }}>{t > hf ? '۵۰٪ باقی · هدف اصلی' : t > nr ? 'بدون ریسک' : 'باز'}</div></div>
    <Chip text="بدون ریسک" k={pop(t, nr)} x={1440} y={520} size={30} tone={C.gold} color={C.gold2} icon={<Ico n="shield" s={30} c={C.gold2} sw={9} />} />
    <Chip text="۱۱:۳۰، نزدیک بسته شدن لندن" k={pop(t, tm)} x={1440} y={610} size={26} icon={<Ico n="clock" s={28} c={C.gold2} sw={9} />} />
    <Chip text="بقیه با هدف اصلی" k={pop(t, rs)} x={1440} y={700} size={28} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// stage 8: Thursday the target (last week's high) is hit; half at +2R and half at +4R = about +3R; 1% risk -> about 3% profit
export function exit10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), th = e('thu', 0.4), hit = e('hit', 2.6), tot = e('total', 4.0), pct = e('pct', 6.2);
  const U3 = [[300, 2], [420, 2.4], [480, 2.1], [600, 3.0], [660, 2.7], [800, 3.6], [860, 3.4], [960, 4.0]];
  return <AbsoluteFill>
    <StageHead n={8} sub="پنج‌شنبه" t={t} />
    <SVG><Lv r={4} c={C.green} lab="هدف: سقف هفته گذشته" x2={1000} k={pop(t, 0.2)} /><Lv r={2} c="rgba(38,166,154,0.5)" lab="+۲R" dash="8 7" w={2.5} x2={1000} k={pop(t, 0.3)} /><Lv r={0} c={C.gold2} lab="حد ضرر = ورود" x2={1000} k={pop(t, 0.3)} />
      <Path pts={rPts(U3, prog(t, th, Math.max(1.4, hit - th)))} w={6} />
      {t > hit && <g opacity={pop(t, hit)}><circle cx={960} cy={ry(4)} r={14} fill={C.green} /><Ring x={960} y={ry(4)} at={hit} t={t} c={C.green} /><text x={960} y={ry(4) - 24} textAnchor="middle" direction="rtl" style={sv(28, 900, C.green)}>هدف خورد</text></g>}</SVG>
    <div style={{ position: 'absolute', left: 1240, top: 400, width: 560, borderRadius: 20, ...glass(C.green), padding: '18px 28px 22px', opacity: pop(t, tot), ...rtl }}>
      {[['نیمه اول در +۲R', '+۱R'], ['نیمه دوم در +۴R', '+۲R']].map(([a, b], i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: i ? 12 : 0, ...txt(32, 800, C.ink) }}><span>{a}</span><span style={{ fontFamily: NUM, direction: 'ltr', color: C.green, fontWeight: 900 }}>{b}</span></div>)}
      <div style={{ borderTop: '2px solid rgba(255,255,255,0.15)', marginTop: 16, paddingTop: 14, display: 'flex', justifyContent: 'space-between', ...txt(40, 900, C.green) }}><span>نتیجه کل</span><span style={{ fontFamily: NUM, direction: 'ltr' }}>≈ +3R</span></div></div>
    <Big text="ریسک ۱٪ ← حدود ۳٪ سود" k={pop(t, pct)} x={1240} w={560} y={660} size={42} color={C.gold2} />
  </AbsoluteFill>;
}
// stage 9: the journal: before / after pictures saved; per plan; 7 of 7; feeling at entry; what was good; what could be better: nothing
export function journal10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d);
  const rows = [['plan', 'طبق پلن', 'g'], ['seven', '۷ از ۷', 'g'], ['feel', 'حس لحظه ورود: کمی ترس که شکست واقعی نباشد', ''], ['good', 'خوب: صبر دو روزه و صبر برای برگشت به شکاف', 'g'], ['better', 'می‌شد بهتر باشد: هیچ', '']];
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <div style={{ position: 'absolute', left: 300, top: 120, width: 1320, height: 700, background: '#F6EEDC', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', opacity: pop(t, 0.1), transform: `rotate(-0.6deg) translateY(${(1 - pop(t, 0.1)) * 30}px)`, padding: '22px 36px', ...rtl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...txt(38, 900, '#5A4A1A') }}><Ico n="book" s={44} c="#5A4A1A" sw={8} />ژورنال · خرید طلا</div>
      <div style={{ display: 'flex', gap: 24, marginTop: 18, opacity: pop(t, e('pics', 0.8)) }}>{['قبل', 'بعد'].map((l, i) => <div key={i} style={{ width: 300, height: 150, background: '#131722', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
        <svg width={300} height={150}><Path pts={(i ? [[10, 120], [60, 100], [90, 110], [150, 70], [200, 80], [290, 20]] : [[10, 40], [60, 70], [90, 60], [150, 110], [200, 100], [250, 120]])} w={4} c={i ? C.green : C.ink} /></svg>
        <span style={{ position: 'absolute', right: 10, top: 6, ...txt(22, 900, C.gold2) }}>{l}</span></div>)}</div>
      {rows.map(([k0, l, g], i) => { const at = e(k0, 2 + i * 1.6); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, ...txt(32, 800, '#3A2E10'), opacity: pop(t, at) }}>
        <span style={{ width: 32, height: 32, borderRadius: 7, border: '3px solid #5A4A1A', ...center, flex: 'none' }}>{g && t > at && <Ico n="check" s={28} c="#1E7A6E" sw={13} />}</span>{l}</div>; })}</div>
  </AbsoluteFill>;
}
// the whole trade seen from above: the entry is about 5%; the rest is plan, patience, preparation, checklist, management and journal
export function bigPicture({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), fv = e('five', 2.4), rs = e('rest', 4.0), sm = e('smallest', 9.0);
  const SEG = [['پلن', 18], ['صبر', 17], ['آماده‌سازی', 16], ['چک‌لیست', 14], ['ورود', 5], ['مدیریت', 16], ['ژورنال', 14]];
  return <AbsoluteFill>
    <Chip text="حالا از بالا نگاه کن" k={pop(t, 0.2)} y={140} size={40} />
    <div style={{ position: 'absolute', left: 200, top: 330, width: 1520, height: 150, display: 'flex', gap: 6, direction: 'ltr' }}>
      {SEG.map(([l, w], i) => { const en = l === 'ورود', k = en ? pop(t, fv) : pop(t, rs + i * 0.35);
        return en ? <div key={i} style={{ width: `${w}%`, height: '100%', borderRadius: 14, background: C.green, ...center, ...txt(22, 900, '#fff'), opacity: Math.max(0.15, k), boxShadow: `0 0 ${20 + 10 * Math.sin(t * 4)}px ${C.green}` }}>{l}</div>
          : <div key={i} style={{ width: `${w * 0.95}%`, height: '100%', borderRadius: 14, background: `rgba(232,201,106,${0.14 + 0.1 * (i % 2)})`, border: `2px solid ${C.gold}`, opacity: 0.15 + 0.85 * k, ...center, ...txt(28, 900, C.ink) }}>{l}</div>; })}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 500, ...center, gap: 40, ...rtl }}><span style={{ ...txt(36, 900, C.green), opacity: pop(t, fv) }}>ورود: حدود ۵٪</span><span style={{ ...txt(36, 900, C.gold2), opacity: pop(t, rs) }}>بقیه: ۹۵٪</span></div>
    <Chip text="ورود، کوچک‌ترین قسمت معامله است" k={pop(t, sm)} y={640} size={44} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// even if the stop had been hit it would still be a good trade: the result does not show quality, the process does
export function processNote({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), wn = e('won', 0.6), sl = e('sl', 2.4), gd = e('good', 4.0), rs = e('result', 6.0), pr = e('process', 8.0);
  const card = (x, at, ok, lab, r) => <div style={{ position: 'absolute', left: x, top: 220, width: 560, height: 330, ...glass(ok ? C.green : C.red), opacity: pop(t, at), ...center, flexDirection: 'column', gap: 16, ...rtl }}>
    <span style={txt(36, 900, C.ink)}>{lab}</span><span style={{ fontFamily: NUM, fontWeight: 900, fontSize: 80, color: ok ? C.green : C.red, direction: 'ltr' }}>{r}</span>
    <div style={{ ...glass(C.gold), padding: '8px 22px 12px', display: 'flex', alignItems: 'center', gap: 10, ...txt(30, 900, C.gold2), opacity: pop(t, gd) }}><OkMark ok s={30} />طبق پلن = معامله خوب</div></div>;
  return <AbsoluteFill>
    {card(1080, wn, true, 'هدف خورد', '+3R')}{card(280, sl, false, 'اگر حد ضرر خورده بود', '−1R')}
    <Chip text="نتیجه یک معامله، کیفیتش را نشان نمی‌دهد" k={pop(t, rs)} y={610} size={36} tone={C.red} color={C.ink} />
    <Chip text="فرایند نشان می‌دهد" k={pop(t, pr)} y={705} size={42} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// practice: rewrite your last trade (demo or paper) with the nine stages; which stage did you skip?
export function practice10({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), ls = e('last', 0.8), dm = e('demo', 2.2), nn = e('nine', 3.6), sk = e('skip', 1e9), miss = [1, 8];
  return <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 45%, #1F5A44, #123628 70%, #0C241B)' }}>
    <div style={{ position: 'absolute', left: 300, top: 140, width: 780, height: 680, background: '#F6EEDC', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.5)', transform: `rotate(-1.2deg) translateY(${(1 - pop(t, ls)) * 30}px)`, opacity: pop(t, ls), padding: '20px 32px', ...rtl }}>
      <div style={txt(34, 900, '#5A4A1A')}>آخرین معامله من، در ۹ مرحله</div>
      {STG.map((s, i) => { const at = nn + 0.5 + i * 0.6, ms = miss.includes(i); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, ...txt(28, 800, '#3A2E10'), opacity: pop(t, nn + i * 0.2) }}>
        <span style={{ width: 30, height: 30, borderRadius: 6, border: `3px solid ${ms && t > sk ? '#B3261E' : '#5A4A1A'}`, ...center, flex: 'none' }}>{t > at && !ms && <Ico n="check" s={26} c="#1E7A6E" sw={13} />}{ms && t > sk && <span style={txt(22, 900, '#B3261E')}>؟</span>}</span>{`${faNum(i + 1)}. ${s}`}</div>; })}</div>
    <Chip text="روی حساب آزمایشی یا کاغذی" k={pop(t, dm)} x={1160} y={260} size={32} tone={C.green} color={C.green} />
    <Chip text="کدام مرحله را جا انداختی؟" k={pop(t, sk)} x={1160} y={380} size={38} tone={C.red} color={C.ink} />
  </AbsoluteFill>;
}
// summary: the nine stages light one by one along the sentence; the entry is the smallest part
export function summary9({ shot }) {
  const t = useT(), keys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'], sm = ev(shot, 'smallest', 1e9);
  return <AbsoluteFill>
    <H shot={shot} at={0.1} />
    <div style={{ position: 'absolute', left: 150, top: 290, width: 1620, display: 'flex', gap: 10, direction: 'ltr' }}>
      {STG.map((s, i) => { const at = ev(shot, keys[i], 1 + i), k = pop(t, at), on = t > at; return <div key={i} style={{ flex: 1, height: 200, borderRadius: 16, ...glass(on ? (i === 4 ? C.green : C.gold) : 'rgba(255,255,255,0.12)'), opacity: 0.25 + 0.75 * k, transform: `translateY(${(1 - k) * 20}px)`, ...center, flexDirection: 'column', gap: 12, padding: '0 6px' }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: on ? 'linear-gradient(180deg,#FFE48A,#D4AF37 55%,#9C7A1E)' : 'rgba(255,255,255,0.08)', ...center, ...txt(28, 900, on ? '#1b1203' : C.mute) }}>{faNum(i + 1)}</div>
        <span style={{ ...txt(24, 900, on ? C.ink : C.mute), whiteSpace: 'normal', textAlign: 'center', direction: 'rtl' }}>{s}</span></div>; })}</div>
    <Chip text="ورود، کوچک‌ترین قسمت آن است" k={pop(t, sm)} y={600} size={42} tone={C.green} color={C.green} />
  </AbsoluteFill>;
}
// next lesson: the same with a losing trade; good loss vs bad loss
export function nextLoss({ shot }) {
  const t = useT(), e = (k0, d) => ev(shot, k0, d), ls = e('loss', 1.0), lr = e('learn', 3.4), gd = e('good', 6.0), bd = e('bad', 7.0);
  return <AbsoluteFill>
    <H shot={shot} at={0.1} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 260, ...center, opacity: pop(t, ls) }}><span style={{ fontFamily: NUM, fontWeight: 900, fontSize: 120, color: C.red, direction: 'ltr' }}>−1R</span></div>
    <Chip text="از ضررها بیشتر یاد می‌گیری تا از سودها" k={pop(t, lr)} y={430} size={36} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 540, ...center, gap: 40, ...rtl }}>
      <div style={{ ...glass(C.green), padding: '16px 36px 20px', display: 'flex', alignItems: 'center', gap: 14, ...txt(42, 900, C.green), opacity: pop(t, gd) }}><OkMark ok s={44} />ضرر خوب</div>
      <div style={{ ...glass(C.red), padding: '16px 36px 20px', display: 'flex', alignItems: 'center', gap: 14, ...txt(42, 900, C.red), opacity: pop(t, bd) }}><OkMark ok={false} s={44} />ضرر بد</div></div>
  </AbsoluteFill>;
}
export function outro10() { return <BrandOutro course="سطح ۳ · درس ۱۰: کالبدشکافی یک معامله سودده" badge="سطح ۳" />; }
