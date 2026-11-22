// One component per shot of DIRECTOR.md (level 3, lesson 9: entry or wait, one complete decision on gold with the seven-step checklist).
// Each reads its shot (text, events in seconds from the cut) and the local time t; content stays in y 100-840 (the logo and «سطح ۳» badge
// top left, the subtitles at the bottom). The seven steps: a ticked step is green, a failing one red, the current row gold; the order block
// gold, liquidity purple, the cheap half green. Example symbol XAUUSD (gold), every chart and sketch tagged «مثال فرضی». Time runs left to
// right everywhere. Helpers above the lesson block come from the earlier lessons.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FA, NUM, clamp, ease, prog, pop, useT, glass, Headline, StampLabel, ChecklistTick, BrandOutro, faNum } from './kit.jsx';
import { ChannelButtons, Building, Coin } from './kit15.jsx';
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
