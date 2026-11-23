// New pieces for lesson 14 (DIRECTOR.md, section 2), on top of the lesson 13 kit: PlatformMock (an unbranded trading platform: symbol list,
// chart, toolbar, trades panel, any region can be zoomed), OrderTicket (the new-order window), CursorClick (pointer + click ripple),
// StepProgress (the 6-step bar on top), LivePnL (the live profit / loss number). All pure functions of the shot time t.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FA, NUM, clamp, ease, prog, pop, glass } from './kit.jsx';

const center = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const txt = (size, weight = 700, color = C.ink, extra = {}) => ({ fontFamily: FA, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', ...extra });
const num = (size, color = C.ink, weight = 600) => ({ fontFamily: NUM, fontWeight: weight, fontSize: size, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });
const PB = '#131722', PB2 = '#1A1F2B', LINE = 'rgba(255,255,255,0.08)';

// ---- the platform: regions in frame pixels (RTL: the symbol list is on the right, read first) ----
export const WIN = { x: 110, y: 116, w: 1700, h: 720 };
export const REG = { toolbar: { x: 110, y: 116, w: 1700, h: 56 }, list: { x: 1430, y: 172, w: 380, h: 428 }, chart: { x: 110, y: 172, w: 1320, h: 428 }, trades: { x: 110, y: 600, w: 1700, h: 236 } };
// a calm uptrend with pullbacks (seeded), 72 candles, the last ones near the support at 4150
export const BARS = (() => {
  let a = 91; const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  const piv = [[0, 4060], [10, 4170], [17, 4120], [27, 4238], [34, 4180], [45, 4296], [52, 4214], [60, 4300], [66, 4150], [71, 4166]];
  const out = []; let p = piv[0][1];
  for (let i = 0; i < 72; i++) {
    const k = piv.findIndex(q => q[0] > i), [i0, p0] = piv[Math.max(0, k - 1)], [i1, p1] = piv[k < 0 ? piv.length - 1 : k];
    const target = i1 === i0 ? p1 : p0 + (p1 - p0) * (i - i0) / (i1 - i0), o = p, c = target + (r() - 0.5) * 10;
    out.push({ o, c, h: Math.max(o, c) + r() * 9, l: Math.min(o, c) - r() * 9 }); p = c;
  }
  return out;
})();
const LO = 4030, HI = 4330;
// toolbar controls (frame pixels, before any zoom): timeframe i, drawing tool j, the new-order button
const TF = ['M15', 'H1', 'H4', 'D1', 'W1'];
export const TB = { tf: i => REG.toolbar.x + 152 + i * 78, tool: j => REG.toolbar.x + 152 + 4 * 78 + 92 + j * 52, order: [REG.toolbar.x + REG.toolbar.w - 120, REG.toolbar.y + 28], y: REG.toolbar.y + 28 };
export function PlatformMock({ t, tf = 'H1', reveal = 72, highlight = [], layers = {}, pos = null, pnl = null, panelRise = 1, cursorTool = null, orderBtn = 0, dim = 0 }) {
  const ch = REG.chart, px = 70, Y = v => ch.y + 16 + (HI - v) / (HI - LO) * (ch.h - 40), dx = (ch.w - px - 20) / 72, X = i => ch.x + 14 + dx * i + dx / 2;
  const daily = tf === 'D1';
  const candles = BARS.slice(0, reveal).map((b, i) => { const s = daily ? 1.35 : 1, up = b.c >= b.o, col = up ? C.green : C.red, cy = (Y(b.o) + Y(b.c)) / 2;
    return <g key={i}><line x1={X(i)} x2={X(i)} y1={cy + (Y(b.h) - cy) * s} y2={cy + (Y(b.l) - cy) * s} stroke={col} strokeWidth={2} />
      <rect x={X(i) - dx * 0.32} width={dx * 0.64} y={Math.min(Y(b.o), Y(b.c)) - (s - 1) * 6} height={Math.max(2, Math.abs(Y(b.o) - Y(b.c)) * s)} fill={col} rx={1} /></g>; });
  const last = BARS[Math.min(reveal, 72) - 1], hl = (r, at, n) => { const k = prog(t, at, 0.4); if (k <= 0) return null; const R = REG[r];
    return <g key={r}><rect x={R.x + 4} y={R.y + 4} width={R.w - 8} height={R.h - 8} rx={10} fill="rgba(212,175,55,0.06)" stroke={C.gold2} strokeWidth={4} opacity={k} />
      <circle cx={R.x + R.w - 34} cy={R.y + 34} r={24 * k} fill={C.gold} /><text x={R.x + R.w - 34} y={R.y + 44} textAnchor="middle" style={num(28, '#131722')} opacity={k}>{n}</text></g>; };
  const L = (p, col, at, lab, dash) => { const k = prog(t, at, 0.5); return k > 0 && <g opacity={k}><line x1={ch.x + 10} x2={ch.x + (ch.w - px) * k} y1={Y(p)} y2={Y(p)} stroke={col} strokeWidth={3} strokeDasharray={dash ? '10 8' : 'none'} />
    <rect x={ch.x + ch.w - px - 4} y={Y(p) - 14} width={px} height={28} rx={4} fill={col} /><text x={ch.x + ch.w - px / 2 - 4} y={Y(p) + 7} textAnchor="middle" style={num(17, '#fff')}>{p.toFixed(2)}</text>
    {lab && <text x={ch.x + 30} y={Y(p) - 10} style={txt(22, 900, col)}>{lab}</text>}</g>; };
  const syms = [['XAUUSD', 4153.8, 4154.1], ['US30', 44210, 44212], ['EURUSD', 1.0842, 1.0843], ['GBPUSD', 1.2714, 1.2716], ['BTCUSD', 96210, 96260]];
  const tick = Math.sin(t * 5) > 0.6;
  return <div style={{ position: 'absolute', inset: 0 }}>
    <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 18, background: PB, border: '2px solid rgba(255,255,255,0.14)', boxShadow: '0 30px 90px rgba(0,0,0,0.6)', overflow: 'hidden' }} />
    {/* toolbar: timeframes (left), drawing tools, the new-order button (right) */}
    <div style={{ position: 'absolute', left: REG.toolbar.x, top: REG.toolbar.y, width: REG.toolbar.w, height: REG.toolbar.h, background: PB2, borderBottom: `1px solid ${LINE}`, borderRadius: '18px 18px 0 0' }} />
    {TF.map((s, i) => <div key={s} style={{ position: 'absolute', left: TB.tf(i) - 32, top: REG.toolbar.y + 9, width: 64, height: 38, borderRadius: 8, ...center, ...num(22, s === tf ? '#fff' : '#9AA1AE'), background: s === tf ? C.blue : 'transparent' }}>{s}</div>)}
    <div style={{ position: 'absolute', left: TB.tool(0) - 44, top: REG.toolbar.y + 13, width: 2, height: 30, background: LINE }} />
    {['line', 'rect', 'text'].map((k, j) => <div key={k} style={{ position: 'absolute', left: TB.tool(j) - 20, top: REG.toolbar.y + 8, width: 40, height: 40, borderRadius: 8, ...center, background: cursorTool === k ? 'rgba(212,175,55,0.25)' : 'transparent', border: cursorTool === k ? `2px solid ${C.gold2}` : '2px solid transparent' }}>
      <svg width={26} height={26}>{k === 'line' ? <line x1={3} y1={23} x2={23} y2={3} stroke="#C9CED8" strokeWidth={3} /> : k === 'rect' ? <rect x={3} y={6} width={20} height={14} fill="none" stroke="#C9CED8" strokeWidth={3} /> : <text x={6} y={21} style={num(20, '#C9CED8')}>T</text>}</svg></div>)}
    <div style={{ position: 'absolute', left: TB.order[0] - 95, top: REG.toolbar.y + 8, width: 190, height: 40, borderRadius: 10, ...center, ...txt(24, 900, '#1C1404'), background: C.gold, transform: `scale(${1 - 0.06 * orderBtn})`, boxShadow: orderBtn ? '0 0 30px rgba(212,175,55,0.7)' : 'none', direction: 'rtl' }}>سفارش جدید</div>
    {/* symbol list */}
    <div style={{ position: 'absolute', left: REG.list.x, top: REG.list.y, width: REG.list.w, height: REG.list.h, background: PB2, borderLeft: `1px solid ${LINE}`, direction: 'rtl' }}>
      <div style={{ display: 'flex', height: 52, alignItems: 'center', padding: '0 18px', borderBottom: `1px solid ${LINE}`, ...txt(22, 700, '#9AA1AE') }}><span style={{ flex: 1.3 }}>نماد</span><span style={{ flex: 1 }}>فروش</span><span style={{ flex: 1 }}>خرید</span></div>
      {syms.map(([s, b, a], i) => <div key={s} style={{ display: 'flex', height: 62, alignItems: 'center', padding: '0 18px', borderBottom: `1px solid ${LINE}`, background: i === 0 && layers.xau ? `rgba(212,175,55,${0.18 * prog(t, layers.xau, 0.4)})` : i === 1 && layers.dow ? `rgba(91,141,239,${0.16 * prog(t, layers.dow, 0.4)})` : 'transparent' }}>
        <span style={{ flex: 1.3, ...num(22, i === 0 ? C.gold2 : C.ink) }}>{s}</span>
        <span style={{ flex: 1, ...num(21, i === 0 && layers.xau && t > layers.xau && tick ? C.red : '#E6E8EC') }}>{b}</span><span style={{ flex: 1, ...num(21, i === 0 && layers.xau && t > layers.xau && !tick ? C.green : '#E6E8EC') }}>{a}</span></div>)}
    </div>
    {/* chart */}
    <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={ch.x} x2={ch.x + ch.w - px} y1={ch.y + 20 + i * 64} y2={ch.y + 20 + i * 64} stroke={LINE} />)}
      {Array.from({ length: 6 }, (_, i) => <text key={i} x={ch.x + ch.w - px + 8} y={ch.y + 26 + i * 64 + 6} style={num(16, '#7D8592', 500)}>{(HI - 20 - i * 46).toFixed(0)}</text>)}
      <g opacity={layers.candles ? 0.55 + 0.45 * prog(t, layers.candles, 0.5) : 1}>{candles}</g>
      {layers.trend != null && prog(t, layers.trend, 0.8) > 0 && <path d={`M${X(3)} ${Y(4090)} L${X(3) + (X(60) - X(3)) * prog(t, layers.trend, 0.8)} ${Y(4090) + (Y(4268) - Y(4090)) * prog(t, layers.trend, 0.8)}`} stroke={C.green} strokeWidth={7} strokeLinecap="round" opacity={0.85} />}
      {layers.sup != null && L(4150, C.green, layers.sup, 'حمایت', true)}{layers.res != null && L(4296, C.red, layers.res, 'مقاومت', true)}
      {pos && L(4154, '#E6E8EC', pos.at, 'ورود')}{pos && L(4110, C.red, pos.at + 0.4, 'حد ضرر')}{pos && L(4242, C.green, pos.at + 0.8, 'هدف')}
      {!pos && last && <g><rect x={ch.x + ch.w - px - 4} y={Y(last.c) - 14} width={px} height={28} rx={4} fill={last.c >= last.o ? C.green : C.red} /><text x={ch.x + ch.w - px / 2 - 4} y={Y(last.c) + 7} textAnchor="middle" style={num(17, '#fff')}>{last.c.toFixed(2)}</text></g>}
      {layers.candles != null && prog(t, layers.candles, 0.4) > 0 && <rect x={X(64) - 14} y={Y(4196)} width={X(71) - X(64) + 28} height={Y(4120) - Y(4196)} rx={10} fill="none" stroke={C.gold2} strokeWidth={3} opacity={prog(t, layers.candles, 0.4)} />}
      <text x={ch.x + 18} y={ch.y + 34} style={num(22, '#B2B5BE')}>{`XAUUSD · ${tf}`}</text>
    </svg>
    {/* trades panel (rises from the bottom when panelRise < 1 -> 1) */}
    <div style={{ position: 'absolute', left: REG.trades.x, top: REG.trades.y + (1 - panelRise) * 236, width: REG.trades.w, height: REG.trades.h, background: PB2, borderTop: `2px solid ${LINE}`, borderRadius: '0 0 18px 18px', direction: 'rtl', overflow: 'hidden', opacity: clamp(panelRise * 1.5) }}>
      <div style={{ display: 'flex', height: 48, alignItems: 'center', gap: 30, padding: '0 24px', ...txt(22, 900, '#9AA1AE') }}>
        {['معامله‌های باز', 'سود و ضرر', 'موجودی'].map((h, i) => <span key={h} style={{ color: layers.cols && t > layers.cols[i] ? C.gold2 : '#9AA1AE', borderBottom: layers.cols && t > layers.cols[i] ? `3px solid ${C.gold}` : '3px solid transparent', paddingBottom: 4 }}>{h}</span>)}</div>
      <div style={{ display: 'flex', height: 44, alignItems: 'center', padding: '0 24px', borderTop: `1px solid ${LINE}`, ...txt(19, 700, '#7D8592') }}>{['نماد', 'جهت', 'حجم', 'ورود', 'حد ضرر', 'هدف', 'سود و ضرر'].map(h => <span key={h} style={{ flex: 1 }}>{h}</span>)}</div>
      <div style={{ display: 'flex', height: 56, alignItems: 'center', padding: '0 24px', borderTop: `1px solid ${LINE}`, opacity: pos ? prog(t, pos.at, 0.4) : layers.row != null ? prog(t, layers.row, 0.4) : 0 }}>
        <span style={{ flex: 1, ...num(21, C.gold2) }}>XAUUSD</span><span style={{ flex: 1, ...txt(21, 900, C.green) }}>خرید</span><span style={{ flex: 1, ...num(21) }}>0.01</span>
        <span style={{ flex: 1, ...num(21) }}>4154.00</span><span style={{ flex: 1, ...num(21, C.red) }}>4110.00</span><span style={{ flex: 1, ...num(21, C.green) }}>4242.00</span>
        <span style={{ flex: 1 }}>{pnl != null ? <LivePnL t={t} t0={pnl} size={23} /> : <span style={num(21, '#7D8592')}>0.00</span>}</span></div>
      <div style={{ position: 'absolute', bottom: 12, right: 24, left: 24, display: 'flex', gap: 40, ...txt(20, 700, '#9AA1AE') }}>
        <span>موجودی: <span style={num(21, C.ink)}>1,000.00 $</span></span><span>حساب: <span style={{ color: C.gold2 }}>آزمایشی</span></span></div>
    </div>
    {highlight.map(([r, at, n]) => <svg key={r} style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>{hl(r, at, n)}</svg>)}
    {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(13,17,23,${0.65 * dim})` }} />}
  </div>;
}
// zoom the whole platform onto one region: k = 0 -> full view, 1 -> region fills ~1500 px around the content centre
export function zoomTo(region, k, fill = 1500, to = [960, 470]) {
  const R = REG[region], s = 1 + (Math.min(fill / R.w, 760 / R.h) - 1) * k, cx = R.x + R.w / 2, cy = R.y + R.h / 2;
  return { transform: `translate(${(to[0] - cx) * k}px, ${(to[1] - cy) * k}px) scale(${s})`, transformOrigin: `${cx}px ${cy}px` };
}
// the new-order window: volume, stop, target typed in (each [text, at] types over 0.6 s), the buy / sell buttons
// button centres for the default ticket (x 560, y 170, w 800): buy on the right (RTL), sell on the left
export const TICKET = { buy: [1150, 616], sell: [770, 616], vol: [746, 295], sl: [746, 392], tp: [746, 489] };
export function OrderTicket({ t, at = 0, vol, sl, tp, focus = null, buyAt = null, sellHover = 0, x = 560, y = 170, w = 800 }) {
  const k = pop(t, at), field = (lab, v, f) => { const [s, ta, td = 0.6] = v || ['', 1e9], n = Math.round(s.length * clamp((t - ta) / td)), on = focus === f && t > ta - 0.3;
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 96, padding: '0 34px', borderTop: `1px solid ${LINE}` }}>
      <span style={txt(36, 700, '#C9CED8')}>{lab}</span>
      <div style={{ width: 300, height: 64, borderRadius: 12, background: '#0F131C', border: `3px solid ${on ? C.gold2 : 'rgba(255,255,255,0.16)'}`, boxShadow: on ? '0 0 30px rgba(212,175,55,0.45)' : 'none', ...center, ...num(34, C.ink), direction: 'ltr' }}>
        {s.slice(0, n)}{on && n < s.length && Math.floor(t * 3) % 2 === 0 ? '|' : ''}</div></div>; };
  const wave = buyAt != null && t > buyAt ? clamp((t - buyAt) / 0.9) : 0;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, borderRadius: 22, background: '#171C27', border: '2px solid rgba(232,201,106,0.45)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', direction: 'rtl', opacity: k, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: '50% 30%' }}>
    <div style={{ height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', ...txt(36, 900, C.gold2) }}><span>سفارش جدید</span><span style={num(30, '#C9CED8')}>XAUUSD</span></div>
    {field('حجم (لات)', vol, 'vol')}{field('حد ضرر', sl, 'sl')}{field('هدف سود', tp, 'tp')}
    <div style={{ display: 'flex', gap: 24, padding: 30, borderTop: `1px solid ${LINE}` }}>
      <div style={{ flex: 1, height: 100, borderRadius: 16, background: C.green, ...center, ...txt(48, 900, '#fff'), position: 'relative', overflow: 'visible', boxShadow: wave ? `0 0 ${60 * (1 - wave)}px ${C.green}` : 'none' }}>خرید
        {wave > 0 && <div style={{ position: 'absolute', inset: -40 * wave, borderRadius: 16 + 40 * wave, border: `4px solid ${C.green}`, opacity: 1 - wave }} />}</div>
      <div style={{ flex: 1, height: 100, borderRadius: 16, background: C.red, ...center, ...txt(48, 900, '#fff'), boxShadow: sellHover ? `0 0 ${40 * sellHover}px ${C.red}` : 'none', outline: sellHover ? `4px solid rgba(255,255,255,${0.6 * sellHover})` : 'none', outlineOffset: 4 }}>فروش</div>
    </div>
  </div>;
}
// pointer moving through keyframes [[t, x, y], ...] (eased), ripples on the click times
export function CursorClick({ t, path, clicks = [] }) {
  let x = path[0][1], y = path[0][2];
  for (let i = 1; i < path.length; i++) { const [t0, x0, y0] = path[i - 1], [t1, x1, y1] = path[i]; if (t >= t0) { const k = ease((t - t0) / Math.max(0.01, t1 - t0)); x = x0 + (x1 - x0) * k; y = y0 + (y1 - y0) * k; } }
  const press = clicks.some(c => t > c && t < c + 0.18);
  return <>
    {clicks.map((c, i) => { const r = clamp((t - c) / 0.6); return r > 0 && r < 1 ? <div key={i} style={{ position: 'absolute', left: x - 50 * r, top: y - 50 * r, width: 100 * r, height: 100 * r, borderRadius: '50%', border: `3px solid ${C.gold2}`, opacity: 1 - r }} /> : null; })}
    <svg style={{ position: 'absolute', left: x - 4, top: y - 4, transform: `scale(${press ? 0.9 : 1})` }} width={54} height={70}><path d="M4 4 L4 56 L18 44 L28 66 L37 62 L27 40 L46 40 Z" fill="#fff" stroke="#111" strokeWidth={3} strokeLinejoin="round" /></svg>
  </>;
}
// the six steps of the first trade, on top of the frame; `step` (1-6) is the current one, `all` lights every step (the summary)
export const STEPS = ['حساب آزمایشی', 'صفحه پلتفرم', 'آماده‌سازی', 'سفارش', 'مدیریت', 'ژورنال'];
export function StepProgress({ step = 1, all = 0, fill = null, vis = null, y = 24, scale = 1, opacity = 1, band = false, labels = STEPS, tone = C.gold }) {
  const n = labels.length, W = 1040, gap = W / (n - 1);
  return <div style={{ position: 'absolute', left: 960 - W / 2 * scale - 40, top: y, width: W * scale + 80, height: 86 * scale, opacity, direction: 'rtl', pointerEvents: 'none' }}>
    {band && <div style={{ position: 'absolute', left: -160, right: -160, top: -y, height: y + 112 * scale, background: 'radial-gradient(ellipse at 50% 20%, rgba(13,17,23,0.92) 55%, rgba(13,17,23,0) 75%)' }} />}
    <div style={{ position: 'absolute', right: 40, top: 22 * scale, width: W * scale, height: 5 * scale, borderRadius: 3, background: 'rgba(255,255,255,0.12)' }} />
    <div style={{ position: 'absolute', right: 40, top: 22 * scale, width: W * scale * clamp(fill != null ? fill : Math.max(all, (step - 1) / (n - 1))), height: 5 * scale, borderRadius: 3, background: tone === C.gold ? `linear-gradient(270deg, ${C.gold2}, ${C.gold})` : tone }} />
    {labels.map((s, i) => { const done = all > i / n || i + 1 < step, cur = !all && i + 1 === step, col = done ? (tone === C.gold ? C.green : tone) : cur ? tone : 'rgba(255,255,255,0.18)';
      const v = vis ? vis(i) : 1;
      return <div key={i} style={{ position: 'absolute', right: 40 + i * gap * scale - 22 * scale, top: 0, width: 44 * scale, textAlign: 'center', opacity: v, transform: `translateY(${(1 - v) * 16 * scale}px)` }}>
        <div style={{ width: 44 * scale, height: 44 * scale, borderRadius: '50%', background: col, ...center, ...num(22 * scale, done || cur ? '#131722' : C.ink), boxShadow: cur ? `0 0 24px ${tone}` : 'none' }}>{done ? (tone === C.gold ? '✓' : '!') : i + 1}</div>
        <div style={{ position: 'absolute', top: 50 * scale, left: '50%', transform: 'translateX(-50%)', ...txt(19 * scale, cur ? 900 : 700, cur ? (tone === C.gold ? C.gold2 : tone) : done ? C.ink : C.mute) }}>{s}</div></div>; })}
  </div>;
}
// live floating profit / loss (dollars), swinging between green and red with the price
export function LivePnL({ t, t0 = 0, size = 40 }) {
  const s = t - t0, v = 9 * Math.sin(1.25 * s) + 4 * Math.sin(3.3 * s + 1) + 1.2 * s, col = v >= 0 ? C.green : C.red;
  return <span style={{ ...num(size, col), direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block' }}>{`${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)} $`}</span>;   // isolated: an RTL row must not move the sign
}
export const Hourglass = ({ t, at = 0, x, y, flip = null }) => {
  const r = flip != null ? 180 * ease((t - flip) / 0.8) : 0, p = clamp((t - at) / 4);
  return <svg style={{ position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, transformOrigin: '50% 50%' }} width={200} height={300} viewBox="0 0 260 380">
    <rect x={20} y={0} width={220} height={20} rx={8} fill={C.gold} /><rect x={20} y={360} width={220} height={20} rx={8} fill={C.gold} />
    <path d="M40 20 L220 20 L140 190 L220 360 L40 360 L120 190 Z" fill="rgba(255,255,255,0.06)" stroke={C.gold2} strokeWidth={5} />
    <path d={`M${60 + 50 * p} ${40 + 120 * p} L${200 - 50 * p} ${40 + 120 * p} L130 185 Z`} fill={C.gold2} opacity={0.9} /><path d={`M${130 - 75 * p} 350 L${130 + 75 * p} 350 L130 ${350 - 120 * p} Z`} fill={C.gold2} opacity={0.9} /></svg>;
};
