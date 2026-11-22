// Level 2 kit (from level 2, lesson 1 on): the fixed level-2 colours (important high gold, important low blue, break of structure green,
// change of character red; from lesson 2 on, zones violet), the structure chart (natural candles drawn through the pivots, revealed left to
// right, with high / low marks, zones, broken levels, stop / target lines and their labels inside an unbranded platform frame that carries
// the «مثال فرضی» tag and the hypothetical-example note), the schematic zigzag, line icons and the gold road.
// Every piece is a pure function of the shot's local time t.
import React from 'react';
import { C, FA, NUM, clamp, ease, prog, pop } from './kit.jsx';

export const L2 = { high: '#E8C96A', low: '#5B8DEF', bos: '#26A69A', choch: '#E63212', zone: '#B2A0F8', sl: '#EF5350', tp: '#E8C96A' };
export const center = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
export const txt = (size, weight = 700, color = C.ink, extra = {}) => ({ fontFamily: FA, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', ...extra });
export const sv = (size, weight, fill) => ({ fontFamily: FA, fontWeight: weight, fontSize: size, fill });
export const nv = (size, fill, weight = 600) => ({ fontFamily: NUM, fontWeight: weight, fontSize: size, fill });
const rnd = s => { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };

// natural candles through the pivots [[index, price], ...]: a noisy bridge between each pair, the pivot candle's wick is the true extreme,
// no candle inside a leg passes either end of it; `strong` = {index: true} makes that candle a full-bodied impulse
export function makeCandles(piv, seed = 7, strong = {}) {
  const r = rnd(seed), out = [];
  let prev = piv[0][1];
  for (let k = 0; k < piv.length - 1; k++) {
    const [i0, p0] = piv[k], [i1, p1] = piv[k + 1], n = i1 - i0, hi = Math.max(p0, p1), lo = Math.min(p0, p1), span = hi - lo;
    let walk = 0;
    for (let j = 1; j <= n; j++) {
      const u = j / n; walk += (r() - 0.5) * span * 0.32;
      let c = p0 + (p1 - p0) * u + walk * Math.sin(Math.PI * u) * 0.8;
      if (j === n) c = p1 + (p1 > p0 ? -1 : 1) * span * (0.06 + 0.08 * r());
      c = clamp(c, lo + span * 0.02, hi - span * 0.02);
      let o = prev; const i = i0 + j;
      if (strong[i]) o = clamp(p1 > p0 ? Math.min(o, c - span * 0.45) : Math.max(o, c + span * 0.45), lo + span * 0.01, hi - span * 0.01);   // a full body, still inside its leg
      let h = Math.max(o, c) + r() * span * 0.07, l = Math.min(o, c) - r() * span * 0.07;
      h = Math.min(h, hi); l = Math.max(l, lo);
      if (j === n) { if (p1 > p0) h = p1; else l = p1; }
      out[i] = { o, c, h, l }; prev = c;
    }
  }
  out[piv[0][0]] = { o: piv[0][1] + (piv[1][1] > piv[0][1] ? 1 : -1) * 0.5, c: piv[0][1] + (piv[1][1] > piv[0][1] ? 3 : -3), h: Math.max(piv[0][1] + 4, piv[0][1]), l: Math.min(piv[0][1], piv[0][1] - 4) };
  if (piv[1][1] > piv[0][1]) out[piv[0][0]].l = piv[0][1]; else out[piv[0][0]].h = piv[0][1];
  return out.map(c => c || null);
}
// the unbranded platform frame (dark #131722, grid, price axis on the right with the live price tag, symbol and timeframe on top)
// timeframe colours from level 2 lesson 5 on (owner's storyboard): D1 gold, H1 blue, M15 white; `frame` paints the platform border in that colour
export const TFC = { D1: '#E8C96A', H1: '#5B8DEF', M15: '#F2F2F2' };
export function Platform({ x = 110, y = 196, w = 1700, h = 620, sym = 'XAUUSD', tf = 'H1', name = null, note = true, children, k = 1, frame = null }) {
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#131722', border: frame ? `2.5px solid ${frame}` : '1.5px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 90px rgba(0,0,0,0.6)', opacity: k, transform: `translateY(${(1 - k) * 24}px)` }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 46, background: '#0F121A', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px' }}>
      <span style={{ fontFamily: NUM, fontWeight: 600, fontSize: 22, color: '#D1D4DC' }}>{sym}</span>
      <span style={{ fontFamily: NUM, fontWeight: 600, fontSize: 18, color: '#131722', background: TFC[tf] || C.gold2, borderRadius: 6, padding: '2px 8px' }}>{tf}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>{name && <span style={txt(22, 700, 'rgba(237,230,214,0.7)')}>{name}</span>}
        {note && <span style={{ ...txt(18, 900, C.gold2), border: '1.5px solid rgba(232,201,106,0.6)', borderRadius: 8, padding: '1px 10px 3px' }}>مثال فرضی</span>}</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 46, bottom: note ? 30 : 0 }}>{children}</div>
    {note && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: '#0F121A', borderTop: '1px solid rgba(255,255,255,0.06)', ...center, ...txt(17, 500, 'rgba(237,230,214,0.55)'), direction: 'rtl' }}>تصویر آموزشی فرضی؛ نمودار زنده یا پیشنهاد معامله نیست</div>}
  </div>;
}
// the structure chart inside the platform: cs = makeCandles(...), upTo = candles shown (fractional: the last one grows),
// marks = [{ i, kind: 'high' | 'low', label, at }], levels = [{ i0, i1, price, kind: 'high' | 'low' | 'bos' | 'choch', label, at, dur }],
// arrows = [{ i, kind, at, dir: 1 | -1 }] (a clear move away from a pivot), view = [i0, i1, pLo, pHi]
export function StructChart({ t, cs, upTo, view, w = 1700, h = 574, marks = [], levels = [], arrows = [], zones = [], dim = 0, tick = true }) {
  const [a, b, lo, hi] = view, PW = w - 110, X = i => 20 + (i - a + 0.5) * PW / (b - a + 1), Y = p => 20 + (hi - p) / (hi - lo) * (h - 40), dx = PW / (b - a + 1);
  const n = Math.floor(upTo), fr = upTo - n, last = cs[Math.min(n, cs.length - 1)];
  const grid = []; for (let g = 0; g < 7; g++) grid.push(lo + (hi - lo) * (g + 0.5) / 7);
  const col = kind => L2[kind] || C.gold2;
  const live = n > 0 && cs[Math.min(n, cs.length) - 1] ? cs[Math.min(n, cs.length) - 1].c : cs[a].c;
  return <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
    {grid.map((p, g) => <g key={g}><line x1={0} x2={PW + 20} y1={Y(p)} y2={Y(p)} stroke="rgba(255,255,255,0.05)" /><text x={PW + 34} y={Y(p) + 7} style={nv(18, 'rgba(209,212,220,0.55)', 500)}>{p.toFixed(2)}</text></g>)}
    {Array.from({ length: 9 }, (_, g) => <line key={g} x1={20 + g * PW / 8} x2={20 + g * PW / 8} y1={0} y2={h} stroke="rgba(255,255,255,0.035)" />)}
    <line x1={PW + 22} x2={PW + 22} y1={0} y2={h} stroke="rgba(255,255,255,0.08)" />
    {zones.map((z, j) => { const p = prog(t, z.at, 0.8), x0 = X(z.i0), x1 = x0 + (X(z.i1) - x0) * p, lk = pop(t, z.at + 0.5);
      return p > 0 && <g key={'z' + j}><rect x={x0} y={Y(z.p1)} width={Math.max(0, x1 - x0)} height={Y(z.p0) - Y(z.p1)} fill={`${z.col || L2.zone}${z.col ? '33' : '2E'}`} stroke={z.col || L2.zone} strokeWidth={2} strokeDasharray="8 6" />
        {z.label && <text x={z.right ? x1 - 14 : x0 + 14} y={z.labelY ?? Y(z.p1) + 32} direction="rtl" textAnchor={z.right ? 'start' : 'end'} style={{ ...sv(26, 900, z.col || L2.zone), opacity: lk }}>{z.label}</text>}</g>; })}
    <g opacity={1 - 0.6 * dim}>{cs.map((c, i) => { if (!c || i < a || i > b || i > n) return null; const g = i === n ? fr : 1; if (g <= 0) return null;
      const cl = c.o + (c.c - c.o) * g, up = cl >= c.o, colr = up ? '#26A69A' : '#EF5350', x = X(i), hh = c.o + (Math.max(c.h, c.o) - c.o) * g, ll = c.o - (c.o - Math.min(c.l, c.o)) * g;
      return <g key={i}><line x1={x} x2={x} y1={Y(Math.max(hh, c.o, cl))} y2={Y(Math.min(ll, c.o, cl))} stroke={colr} strokeWidth={2} /><rect x={x - dx * 0.32} width={dx * 0.64} y={Y(Math.max(c.o, cl))} height={Math.max(2, Math.abs(Y(c.o) - Y(cl)))} fill={colr} rx={1.5} /></g>; })}</g>
    {levels.map((l, j) => { const p = prog(t, l.at, l.dur || 0.7), x0 = X(l.i0), x1 = x0 + (X(l.i1) - x0) * p, cc = col(l.kind), lk = pop(t, l.at + (l.dur || 0.7) - 0.1);
      return p > 0 && <g key={j}><line x1={x0} x2={x1} y1={Y(l.price)} y2={Y(l.price)} stroke={cc} strokeWidth={l.kind === 'bos' || l.kind === 'choch' ? 4 : 3} strokeDasharray={l.kind === 'bos' || l.kind === 'choch' ? 'none' : l.kind === 'sl' || l.kind === 'tp' ? '6 6' : '12 9'} opacity={0.95} />
        {l.label && <g opacity={lk}><rect x={(x0 + X(l.i1)) / 2 - l.label.length * 11 - 20} y={Y(l.price) + (l.below ? 12 : -56)} width={l.label.length * 22 + 40} height={44} rx={10} fill="rgba(13,17,23,0.92)" stroke={cc} strokeWidth={2} />
          <text x={(x0 + X(l.i1)) / 2} y={Y(l.price) + (l.below ? 44 : -24)} textAnchor="middle" direction="rtl" style={sv(26, 900, cc)}>{l.label}</text></g>}</g>; })}
    {arrows.map((ar, j) => { const p = prog(t, ar.at, 0.6), c = cs[ar.i], x = X(ar.i), y0 = ar.dir < 0 ? Y(c.h) - 10 : Y(c.l) + 10, len = 110 * p * (ar.dir < 0 ? 1 : -1);
      return p > 0 && <g key={j} stroke={col(ar.kind)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.95}><path d={`M ${x + 28} ${y0 + 14 * Math.sign(len)} L ${x + 28 + 60 * p} ${y0 + len}`} />{p > 0.9 && <path d={`M ${x + 70} ${y0 + len - 14 * Math.sign(len)} L ${x + 88} ${y0 + len} L ${x + 64} ${y0 + len + 4 * Math.sign(len)}`} />}</g>; })}
    {marks.map((m, j) => { const k = pop(t, m.at), c = cs[m.i], x = X(m.i), hiM = m.kind === 'high', y = hiM ? Y(c.h) - 22 : Y(c.l) + 22, cc = col(m.kind);
      return k > 0.01 && <g key={j} opacity={k} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * k})`}>
        <circle r={12} fill={cc} stroke="#131722" strokeWidth={3} />{k > 0.5 && <circle r={12 + 14 * clamp((t - m.at) / 0.6)} fill="none" stroke={cc} strokeWidth={2} opacity={1 - clamp((t - m.at) / 0.6)} />}
        {m.label && <text y={hiM ? -24 : 48} textAnchor="middle" direction="rtl" style={sv(26, 900, cc)}>{m.label}</text>}</g>; })}
    {tick && n > a && <g><rect x={PW + 24} y={Y(live) - 15} width={84} height={30} rx={4} fill={(last && last.c >= last.o) ? '#26A69A' : '#EF5350'} /><text x={PW + 66} y={Y(live) + 7} textAnchor="middle" style={nv(17, '#fff')}>{live.toFixed(2)}</text></g>}
  </svg>;
}
// a schematic zigzag: pts = [[x, y, kind], ...] in frame pixels (kind 'high' | 'low' | null), drawn up to `draw` (0-1), points pop as the line reaches them
export function Zig({ pts, draw, stroke = C.ink, width = 7, dots = true, labels = {}, dim = 0 }) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = seg.reduce((s, v) => s + v, 0);
  let acc = 0; const at = [0, ...seg.map(v => (acc += v) / tot)];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  return <g opacity={1 - 0.6 * dim}><path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    {dots && pts.map(([x, y, kind], i) => { const k = clamp((draw - at[i]) * 12 + 0.2); return kind && k > 0 && <g key={i} opacity={k}><circle cx={x} cy={y} r={13} fill={L2[kind]} stroke="#0D1117" strokeWidth={3} />
      {labels[i] && <text x={x} y={kind === 'high' ? y - 26 : y + 46} textAnchor="middle" direction="rtl" style={sv(28, 900, L2[kind])}>{labels[i]}</text>}</g>; })}</g>;
}
// line icons (100 x 100)
export const Ico = ({ n, s = 60, c = C.gold2, sw = 7 }) => <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>{{
  check: <path d="M18 52 L40 74 L82 28" />,
  cross: <><line x1={24} y1={24} x2={76} y2={76} /><line x1={76} y1={24} x2={24} y2={76} /></>,
  clock: <><circle cx={50} cy={50} r={36} /><path d="M50 28 L50 50 L66 60" /></>,
  shield: <path d="M50 10 L84 22 L84 50 C84 72 68 86 50 92 C32 86 16 72 16 50 L16 22 Z" />,
  up: <><path d="M50 84 L50 18" /><path d="M26 40 L50 16 L74 40" /></>,
  down: <><path d="M50 16 L50 82" /><path d="M26 60 L50 84 L74 60" /></>,
  warn: <><path d="M50 12 L90 84 L10 84 Z" /><line x1={50} y1={40} x2={50} y2={62} /><circle cx={50} cy={74} r={2} /></>,
  book: <><path d="M50 26 C40 18 24 16 12 18 L12 80 C24 78 40 80 50 88 C60 80 76 78 88 80 L88 18 C76 16 60 18 50 26 Z" /><line x1={50} y1={26} x2={50} y2={88} /></>,
  candle: <><line x1={30} y1={12} x2={30} y2={88} /><rect x={20} y={28} width={20} height={40} rx={3} /><line x1={70} y1={8} x2={70} y2={80} /><rect x={60} y={20} width={20} height={44} rx={3} /></>,
  pause: <><rect x={26} y={20} width={14} height={60} rx={4} /><rect x={60} y={20} width={14} height={60} rx={4} /></>,
  eye: <><path d="M8 50 C24 24 76 24 92 50 C76 76 24 76 8 50 Z" /><circle cx={50} cy={50} r={13} /></>,
  layers: <><path d="M50 14 L90 34 L50 54 L10 34 Z" /><path d="M10 50 L50 70 L90 50" /><path d="M10 66 L50 86 L90 66" /></>,
  flag: <><line x1={22} y1={10} x2={22} y2={92} /><path d="M24 14 L80 26 L24 48 Z" /></>,
  user: <><circle cx={50} cy={36} r={18} /><path d="M18 88 C20 64 34 58 50 58 C66 58 80 64 82 88" /></>,
  map: <><path d="M12 24 L38 14 L62 26 L88 16 L88 76 L62 86 L38 74 L12 84 Z" /><line x1={38} y1={14} x2={38} y2={74} /><line x1={62} y1={26} x2={62} y2={86} /></>,
  target: <><circle cx={50} cy={50} r={38} /><circle cx={50} cy={50} r={22} /><circle cx={50} cy={50} r={6} fill={c} /></>,
}[n]}</svg>;
// a gold road through points (cut points in frame pixels), drawn from the right (Persian reading order)
export const curve = pts => { let d = `M ${pts[0][0] + 200} ${pts[0][1] + 30} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i], m = (a - c) / 2; d += ` C ${a - m} ${b}, ${c + m} ${e}, ${c} ${e}`; }
  return d; };
