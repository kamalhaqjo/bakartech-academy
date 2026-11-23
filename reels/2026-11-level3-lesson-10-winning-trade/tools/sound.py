#!/usr/bin/env python3
"""Sound design for the synced lesson timelines (TAFAKR master prompt, part 6). No music unless the timeline has a "music" section:
  music  build/music.wav from ../../tools/music.py (original score), levelled to sit about 12 dB under the voice in the pauses and ducked 6 dB more under speech
  bed    deep sub-bass atmospheric hum + soft room tone, evolving slowly, ducked a little under the voice, with deliberate silences
  lock   crystalline HUD lock-on chime          sweep  short data-stream sweep          tick  crisp technical click
  ui     holographic activation chirp           up/down  rising / falling glide          beep, glitch  warning cues
  whoosh / swoosh  transitions                   pop, ding  like / end card          click  mouse click (chart drawings)   bounce  ball on a floor / ceiling (v = impact speed)
  sample  a recorded effect from the owner's library (../brand/sfx: whoosh, click, riser, impact) at its level under the voice ("db"); "end": true ends it on the cue
Each cue can carry a stereo position ("pan", -1..1) so the sound sits where the element appears on screen.
usage: sound.py <project-dir>   -> build/mix.wav + build/audio_report.json"""
import json, os, sys
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "tools"))
import audio as A
SR, DB = A.SR, A.DB
proj = sys.argv[1]; P = lambda *a: os.path.join(proj, *a)
tl = json.load(open(P("timing", "timeline.json"))); total = tl["duration"]; N = int(round(total * SR)); rs = np.random.RandomState(21)

v0 = A.decode(P(tl.get("voice_src", "assets/voice.mp3")))
if "voice_in" in tl:                                                    # excerpt of the narration (pilot cuts), 10 ms edge fades
    v0 = v0[int(round(tl["voice_in"] * SR)):int(round(tl["voice_out"] * SR))]; e = int(0.01 * SR); v0[:e] *= np.linspace(0, 1, e); v0[-e:] *= np.linspace(1, 0, e)
if "voice_splice" in tl:                                                # cut a stretch out of the narration (a line in the middle), 30 ms fades at the seam
    ia, ib = int(round(tl["voice_splice"][0] * SR)), int(round(tl["voice_splice"][1] * SR)); f = int(0.03 * SR)
    v0 = v0.copy(); v0[ia - f:ia] *= np.linspace(1, 0, f); v0[ib:ib + f] *= np.linspace(0, 1, f); v0 = np.concatenate([v0[:ia], v0[ib:]])
if "voice_cut" in tl:                                                   # mute the narration from a point on (a word read wrong), 80 ms fade
    c = int(round(tl["voice_cut"] * SR)); f = int(0.08 * SR)
    if c < len(v0): v0[c:c + f] *= np.linspace(1, 0, len(v0[c:c + f])); v0[c + f:] = 0
lv0, _ = A.lufs(np.stack([v0, v0], 1)); g = float(np.clip(-15.4 - lv0, -6.0, 3.0)); v = v0 * DB(g)
assert np.abs(v).max() <= DB(-1.2), "voice would need limiting"
voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]

def env_follow(x, attack=0.06, release=0.5, thr_db=-50):
    hop = SR // 200; fr = x[: len(x) // hop * hop].reshape(-1, hop); e = np.sqrt((fr ** 2).mean(1)) + 1e-9; act = (20 * np.log10(e) > thr_db).astype(float)
    ka, kr = np.exp(-1 / (attack * 200)), np.exp(-1 / (release * 200)); y = 0.0; out = np.empty(len(act))
    for i, a in enumerate(act): k = ka if a > y else kr; y = k * y + (1 - k) * a; out[i] = y
    return np.interp(np.arange(len(x)) / hop - 0.5, np.arange(len(out)), out)

# ---- bed: sub-bass hum (not music: no melody, no chords) ----
t = np.arange(N) / SR
lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.045 * t + 1.0)
hum = (np.sin(2 * np.pi * 41.2 * t) + 0.55 * np.sin(2 * np.pi * 55.0 * t + 0.7) + 0.18 * np.sin(2 * np.pi * 82.4 * t + 2.1)) * lfo
room = sg.sosfilt(sg.butter(2, [70, 320], btype="band", fs=SR, output="sos"), rs.randn(N)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t))
air = sg.sosfilt(sg.butter(2, 5000, btype="high", fs=SR, output="sos"), rs.randn(N)) * 0.04
bedL = hum + 1.4 * room + air; bedR = hum + 1.4 * np.roll(room, 997) + np.roll(air, 1733)
bed = np.stack([bedL, bedR], 1)
gain = (1.0 + (DB(-3.0) - 1.0) * env_follow(voice))
fade = np.minimum(1, t / 1.5) * np.minimum(1, (total - t) / 2.5); gain = gain * fade
for a, b in tl.get("silences", []):                                    # deliberate silence before a revealed truth
    i0, i1 = int(a * SR), int(b * SR); r = int(0.08 * SR); w = np.ones(N)
    w[i0:i1] = 0.0; w[max(0, i0 - r):i0] = np.linspace(1, 0, min(r, i0)); w[i1:i1 + r] = np.linspace(0, 1, len(w[i1:i1 + r])); gain = gain * w
bed = bed * gain[:, None]; bed /= np.abs(bed).max()
MUSIC = "music" in tl and os.path.exists(P("build", "music.wav"))
lv, _ = A.lufs(np.stack([voice, voice], 1)); bi, _ = A.lufs(bed); bed *= DB((lv - (25.0 if MUSIC else 21.0)) - bi)   # well under the voice; sub-bass reads quiet on LUFS
music = np.zeros((N, 2))
if MUSIC:
    _, mu = wf.read(P("build", "music.wav")); mu = mu.astype(float) / 32768; music[:min(N, len(mu))] = mu[:N]
    mi, _ = A.lufs(music); music *= DB((lv - 12.0) - mi)                                                 # the score sits ~12 dB under the voice...
    music *= (1.0 + (DB(-6.0) - 1.0) * env_follow(voice, attack=0.08, release=0.8))[:, None]               # ...and dips 6 dB more while he speaks

# ---- cue synths ----
duck = 1.0 + (DB(-4.0) - 1.0) * env_follow(voice)                        # library effects dip 4 dB more while he speaks (never on a voice peak)
LIB = {}
def sample(f, db):                                                      # WAV 48 kHz stereo at -16 LUFS, about the voice level, so "db" is the level under the voice
    if f not in LIB:
        sr, y = wf.read(P(f)); assert sr == SR, f"{f}: {sr} Hz"
        y = y.astype(float) / 32768.0 if y.dtype == np.int16 else y.astype(float)
        LIB[f] = np.stack([y, y], 1) if y.ndim == 1 else y[:, :2]
    return LIB[f] * DB(db)
def lock(pk=-29):
    n = int(0.42 * SR); tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 2637 * tt) + 0.6 * np.sin(2 * np.pi * 3951 * tt) + 0.3 * np.sin(2 * np.pi * 5274 * tt)) * np.exp(-tt / 0.11) + 0.5 * rs.randn(n) * np.exp(-tt / 0.003)
    return x / np.abs(x).max() * DB(pk)
def sweep(pk=-33):
    n = int(0.3 * SR); tt = np.arange(n) / SR; nz = rs.randn(n); out = np.zeros(n)
    for k in range(6):
        f = 900 * (5.5 ** (k / 5)); band = sg.sosfilt(sg.butter(2, [f * 0.8, f * 1.25], btype="band", fs=SR, output="sos"), nz)
        out += band * np.exp(-((tt / 0.3 - k / 6) ** 2) / 0.012)
    out *= np.sin(np.pi * tt / 0.3); return out / np.abs(out).max() * DB(pk)
def ui(pk=-30):
    n = int(0.32 * SR); tt = np.arange(n) / SR; f = 520 + 1500 * (tt / 0.32) ** 0.7; ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-tt / 0.16) * np.minimum(1, tt / 0.004) + 0.4 * np.sin(2 * np.pi * 3136 * tt) * np.exp(-((tt - 0.12) / 0.05) ** 2)
    return x / np.abs(x).max() * DB(pk)
def beep(pk=-31):
    n = int(0.075 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * 1180 * tt) * np.minimum(1, tt / 0.004) * np.minimum(1, (0.075 - tt) / 0.012); return x / np.abs(x).max() * DB(pk)
def glitch(pk=-28):
    n = int(0.16 * SR); x = rs.randn(n); x = np.repeat(x[::14], 14)[:n]; tt = np.arange(n) / SR
    x = x * np.sin(2 * np.pi * 70 * tt) * np.exp(-tt / 0.06) + 0.5 * np.sin(2 * np.pi * 520 * tt) * (np.sin(2 * np.pi * 38 * tt) > 0) * np.exp(-tt / 0.07)
    sub = np.sin(2 * np.pi * (60 - 25 * tt / 0.16) * tt) * np.exp(-tt / 0.12) * 0.8
    x = x / np.abs(x).max() + sub; return x / np.abs(x).max() * DB(pk)
def click(pk=-31):                                                      # soft mouse click (press + release) for lines drawn on a chart
    n = int(0.11 * SR); x = np.zeros(n)
    for t0, g in ((0.0, 1.0), (0.066, 0.55)):
        i0, m = int(t0 * SR), int(0.014 * SR); k = np.arange(m) / SR
        burst = sg.sosfilt(sg.butter(2, [1700, 5200], btype="band", fs=SR, output="sos"), rs.randn(m)) * np.exp(-k / 0.0016)
        x[i0:i0 + m] += (burst + 0.5 * np.sin(2 * np.pi * 1150 * k) * np.exp(-k / 0.003)) * g
    return x / np.abs(x).max() * DB(pk)
def bounce(v=5.0):                                                      # rubber ball on a wooden floor / plaster ceiling; harder impacts are louder
    n = int(0.16 * SR); tt = np.arange(n) / SR; f = 95 + 140 * np.exp(-tt / 0.02)
    thud = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.05)
    knock = np.sin(2 * np.pi * 620 * tt) * np.exp(-tt / 0.012) * 0.45
    m = int(0.006 * SR); tick = np.zeros(n); tick[:m] = sg.sosfilt(sg.butter(2, [1200, 4500], btype="band", fs=SR, output="sos"), rs.randn(m)) * np.exp(-np.arange(m) / SR / 0.0015) * 0.6
    x = (thud + knock + tick) * np.minimum(1, tt / 0.0008)
    return x / np.abs(x).max() * DB(-23 + 20 * np.log10(np.clip(v / 8.0, 0.08, 1.0)))
SYN = {"lock": lock, "click": click, "sweep": sweep, "ui": ui, "beep": beep, "glitch": glitch, "tick": lambda: A.tick(-27), "pop": A.pop, "ding": A.ding,
       "up": lambda: A.glide(420, 940, peak_db=-30), "down": lambda: A.glide(760, 300, peak_db=-30)}
sfx = np.zeros((N, 2)); cnt = {}
for s in tl["sfx"]:
    ty = s["type"]; key = ty if ty != "sample" else os.path.basename(s["file"]); cnt[key] = cnt.get(key, 0) + 1
    if ty == "sample":
        x = sample(s["file"], s.get("db", -10.0)); i0 = int(round(s["t"] * SR)) - (len(x) if s.get("end") else 0)
        if i0 < 0: x = x[-i0:].copy(); f = min(len(x), int(0.03 * SR)); x[:f] *= np.linspace(0, 1, f)[:, None]; i0 = 0   # a riser that would start before 0: cut its head (30 ms fade) so it still ends on the cue
        e = min(N, i0 + len(x)); sfx[i0:e] += x[: e - i0] * duck[i0:e, None]; continue
    if ty == "whoosh": x = A.whoosh(s["dur"], peak_db=-25, seed=int(s["t"] * 10) % 97)
    elif ty == "swoosh": x = A.whoosh(s["dur"], peak_db=-31, seed=int(s["t"] * 10) % 89 + 7)
    elif ty == "bounce": x = bounce(s.get("v", 5.0))
    else: x = SYN[ty]()
    i0 = int(round(s["t"] * SR)); e = min(N, i0 + len(x)); x = x[: e - i0]
    if ty in ("whoosh", "swoosh"): ramp = np.linspace(-0.6, 0.6, len(x)); l, r = np.cos((ramp + 1) * np.pi / 4), np.sin((ramp + 1) * np.pi / 4)
    else: pan = s.get("pan", 0.0); l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    sfx[i0:e, 0] += x * l * 1.41; sfx[i0:e, 1] += x * r * 1.41
# the effects never push the voice over the ceiling: where voice + score + bed leave too little headroom, only the effects dip (10 ms windows,
# a running minimum then a moving average, so the gain stays at or under what each sample allows and never clicks)
from scipy.ndimage import minimum_filter1d, uniform_filter1d
base = np.stack([voice, voice], 1) + music + bed; W = int(0.01 * SR)
head = np.clip(DB(-1.6) - np.abs(base), 0, None); need = np.abs(sfx)
fxg = np.where(need > head, head / np.maximum(need, 1e-9), 1.0).min(1)
fxg = uniform_filter1d(minimum_filter1d(fxg, 2 * W + 1), W + 1); sfx_cut = float(20 * np.log10(max(fxg.min(), 1e-6)))
mix = base + sfx * fxg[:, None]; pk = np.abs(mix).max()
rep = {"mode": tl["mode"], "total_s": total, "voice_gain_db": round(g, 2), "voice_peak_dbfs": round(20 * np.log10(np.abs(v).max()), 2), "music": "original score (tools/music.py), ducked under the voice" if MUSIC else "none (sound design only: sub-bass bed + HUD cues)", "voice_lufs": round(lv, 2),
       **({"music_lufs": round(A.lufs(music)[0], 2)} if MUSIC else {}), "bed_lufs": round(A.lufs(bed)[0], 2), "silences": tl.get("silences", []), "sfx_count": cnt, "sfx_dipped_max_db": round(sfx_cut, 1), "mix_sample_peak_dbfs": round(20 * np.log10(pk), 2)}
if pk > DB(-1.5): mix = mix * (DB(-1.5) / pk); rep["mix_scaled_to_peak_-1.5dBFS"] = True
rep["mix_lufs"] = round(A.lufs(mix)[0], 2)
wf.write(P("build", "mix.wav"), SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16)); json.dump(rep, open(P("build", "audio_report.json"), "w"), indent=1); print(json.dumps(rep, indent=1))
