#!/usr/bin/env python3
"""Level 3, lesson 9 director (entry or wait: one complete decision on gold with the seven-step checklist), from the owner's script:
the price reaches your zone, enter now or wait?; the level 3 pieces put together; the scene (weekly up, a fresh daily order block in the
cheap half, two equal lows = liquidity) and the main scenario; the trading day in London; the seven steps one by one with a bar on top
(direction, zone, liquidity, time = wait in London then NY after the first 15 minutes, confirmation on M15, news, reward to risk 3:1);
seven ticks = enter with a fixed 1% risk; the other side of the coin (no break = no trade, journal why); the common mistake (the checklist
filled after the entry); the practice; the summary; the next lesson (managing the open trade). Rules: charts under 30% of the time, no two
shots of a kind in a row, the picture changes every 4-7 s, every cut and event locked to the narration (timing/asr.json + words.json).
«از آکادمی بکار تیک» is cut from the voice (the owner's rule), the line ends on «مالی».
Writes remotion/src/shots.json and remotion/audio/timing/timeline.json.
Anchors: a sentence index (the cut in the pause before it), [sentence, word(, nth)] (just before that word), ("gap", sentence, word) or seconds.
usage: director.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__)); L = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(L("timing", "asr.json")))["sentences"]
W = json.load(open(L("timing", "words.json"), encoding="utf-8"))["words"]
LINES = json.load(open(L("timing", "lines.json"), encoding="utf-8"))["lines"]
FPS, VOICE_CUT = 30, 302.80                     # «مالی» ends at 302.70, «از آکادمی بکار تیک» starts at 302.98 (energy of input/voice.mp3)
OUT = round(VOICE_CUT + 4.4, 2)

def widx(sent, w, nth=1):
    hits = [i for i, x in enumerate(W) if x["sent"] == sent and x["w"].rstrip("،.؟!:؛").startswith(w)]
    assert len(hits) >= nth, f"word {w!r} not in sentence {sent}"
    return hits[nth - 1]
word = lambda sent, w, nth=1: W[widx(sent, w, nth)]["s"]
def cut(a):
    if isinstance(a, float): return a
    if isinstance(a, int): return 0.0 if a == 0 else round((A[a - 1]["end"] + A[a]["start"]) / 2, 3)
    if a[0] == "gap": i = widx(*a[1:]); return round((W[i - 1]["e"] + W[i]["s"]) / 2, 3)
    return round(word(*a) - 0.08, 3)

TYPES = {"typo": "تایپوگرافی سینمایی", "scene": "صحنه‌سازی", "info": "اینفوگرافیک", "ui": "UI متحرک", "object": "موشن‌گرافیک اشیا",
         "chart": "چارت", "cta": "CTA", "brand": "پایان برند", "recap": "مرور", "map": "نقشه (map-route)", "teardown": "کالبدشکافی (teardown)",
         "stat": "نمودار مقایسه (stat-chart)", "paper": "میز کاغذی (paper-desk)", "preview": "پیش‌نمایش"}
# id, start anchor, type, component, camera, on-screen text, events {key: word anchor}, extra fields
S = [
 ("S01", 0, "typo", "hookZone", "push", [], {"heart": (0, "دلت"), "now": (0, "همین"), "really": (0, "واقعا"), "today": (0, "امروز"), "step": (0, "قدم")}, {}),
 ("S02", (1, "من"), "recap", "recapL3", "pan", [], {"windows": (2, "پنجره"), "today": (2, "امروز"), "together": (2, "کنار"), "real": (2, "واقعی")}, {}),
 ("S03", 3, "object", "sceneSetup", "push", [], {"weekly": (4, "هفتگی"), "daily": (4, "روزانه"), "ob": (4, "اردر"), "cheap": (4, "ارزان"), "eq": (5, "دو"), "liq": (5, "نقدینگی")}, {}),
 ("S03b", 6, "info", "scenario", "pan", [], {"main": (6, "سناریوی"), "sweep": (7, "بزند"), "ob": (7, "وارد"), "ny": (7, "نیویورک"), "bos": (7, "بشکند"), "buy": (7, "خرید")}, {}),
 ("S04", 8, "scene", "tradeDay", "push", [], {"day": (8, "روز"), "london": (9, "لندن"), "reach": (9, "رسیده"), "rush": (10, "عجله"), "list": (10, "چک‌لیست")}, {}),
 ("S05", 11, "ui", "step1Dir", "pan", [], {"w1": (12, "هفتگی"), "d1": (12, "روزانه"), "yes": (13, "بله"), "tick": (13, "تیک")}, {"step": 1}),
 ("S06", 14, "info", "step2Zone", "push", [], {"fresh": (16, "تازه"), "cheap": (16, "ارزان"), "yes": (17, "بله"), "intact": (17, "دست"), "tick": (18, "تیک")}, {"step": 2}),
 ("S07", 19, "object", "step3Liq", "pan", [], {"before": (21, "قبل"), "taken": (21, "جمع"), "yes": (22, "بله"), "eq": (22, "دو"), "tick": (23, "تیک")}, {"step": 3}),
 ("S08", 24, "scene", "step4Wait", "push", [], {"window": (25, "پنجره"), "no": (26, "نه"), "london": (26, "لندن"), "first": (27, "اولین"), "wait": (28, "صبر"), "three": (29, "سه"), "noentry": (29, "وارد")}, {"step": 4}),
 ("S09", 30, "ui", "step4NY", "pan", [], {"hour": (30, "ساعت"), "ny": (30, "نیویورک"), "m15": (31, "پانزده"), "watch": (31, "نگاه"), "lower": (32, "پایین‌تر"), "back": (32, "برمی‌گردد"), "inwin": (33, "پنجره"), "tick": (34, "تیک")}, {"step": 4}),
 ("S10", 35, "chart", "step5Chart", "push", [], {"m15": (37, "پانزده"), "up": (37, "بالا"), "high": (38, "سقف"), "close": (38, "بسته"), "tick": (39, "تیک")}, {"step": 5}),
 ("S11", 40, "info", "step6News", "pan", [], {"half": (42, "نیم"), "cal": (43, "تقویم"), "none": (44, "خبری"), "tick": (45, "تیک")}, {"step": 6}),
 ("S12", 46, "chart", "step7RR", "pan", [], {"rr": (47, "نسبت"), "entry": (48, "ورود"), "sl": (48, "حد"), "tp": (48, "هدف"), "three": (49, "سه"), "two": (49, "دو"), "ok": (49, "قبول"), "tick": (50, "تیک")}, {"step": 7}),
 ("S13", 51, "typo", "sevenTicks", "push", [], {"seven": (51, "هفت"), "now": (52, "فقط"), "entry": (52, "ورود"), "risk": (53, "ریسک"), "one": (53, "یک"), "sure": (54, "مطمئن"), "conf": (55, "اطمینان")}, {}),
 ("S14", 56, "scene", "otherSide", "pan", [], {"coin": (56, "سکه"), "five": (57, "پنجم"), "below": (57, "زیر"), "void": (58, "باطل"), "notrade": (59, "معامله"), "journal": (59, "ژورنال"), "right": (60, "درست"), "lesson": (61, "روزهای")}, {}),
 ("S15", 62, "ui", "mistakeAfter", "push", ["اشتباه رایج"], {"after": (63, "بعد"), "prove": (63, "ثابت"), "before": (64, "قبل"), "justify": (64, "توجیه")}, {}),
 ("S16", 65, "paper", "practice3", "pan", [], {"week": (66, "هفته"), "ny": (66, "نیویورک"), "chart": (66, "چارت"), "own": (66, "سناریوی"), "fill": (66, "پر"), "paper": (67, "کاغذ"), "demo": (67, "حساب"), "journal": (68, "ژورنال"), "decision": (68, "ورود"), "notorder": (69, "دستور")}, {}),
 ("S17", 70, "info", "summaryL3", "push", ["خلاصه درس امروز"], {"seven": (71, "هفت"), "s1": (72, "جهت"), "s2": (72, "ناحیه"), "s3": (72, "نقدینگی"), "s4": (72, "زمان")}, {"rows": [0, 1, 2, 3]}),
 ("S17b", 73, "object", "summaryL3", "pan", ["خلاصه درس امروز"], {"s5": (73, "تأیید"), "s6": (74, "خبر"), "s7": (75, "نسبت"), "wait": (76, "صبر"), "risk": (76, "ریسک")}, {"rows": [4, 5, 6]}),
 ("S18", 77, "cta", "ctaIG", "push", [], {"like": (77, "لایک"), "sub": (77, "دنبال"), "bell": (77, "زنگوله")}, {}),
 ("S19", 78, "preview", "nextManageL3", "push", ["درس بعد: مدیریت معامله باز"], {"manage": (79, "مدیریت"), "sl": (80, "حد"), "breathe": (80, "نفس")}, {}),
 ("S20", (81, "من"), "brand", "outro", "push", ["کمال حقجو", "Bakartech"], {}, {}),
]

def T(v): return cut(v) if (isinstance(v, tuple) and v[0] == "gap") else word(*v)
TAIL = next((i for i, w in enumerate(W) if w["s"] >= VOICE_CUT), len(W))
shots = []
for k, (sid, at, ty, comp, cam, text, ev, extra) in enumerate(S):
    t0 = cut(at); t1 = cut(S[k + 1][1]) if k + 1 < len(S) else OUT
    e = {key: round(T(v) - t0, 3) for key, v in ev.items()}
    for key, v in e.items(): assert -0.5 < v < t1 - t0 + 0.2, (sid, key, v, t1 - t0)
    spoken = " ".join(w["w"] for i, w in enumerate(W) if t0 - 0.05 <= w["s"] < t1 - 0.05 and i < TAIL)
    shots.append({"id": sid, "type": ty, "comp": comp, "cam": cam, "from": t0, "to": round(t1, 3), "text": text, "ev": e, **extra, "spoken": spoken})
for a, b in zip(shots, shots[1:]):
    assert a["type"] != b["type"], f"{a['id']} and {b['id']} are both {a['type']}"
    assert b["from"] > a["from"] + 1.5, (a["id"], b["id"])
by = {s["id"]: s for s in shots}; E = lambda sid, k: by[sid]["from"] + by[sid]["ev"][k]; F = lambda sid: by[sid]["from"]

# ---- sound: the owner's library (levels as in the lessons before), one impact per 15 s on the cuts, a riser ends on its hit ----
LIB = "../../../brand/sfx/"
cue = lambda f, t, db, **k: {"type": "sample", "file": LIB + f, "db": db, "t": round(t, 3), **k}
whoosh = lambda sid: cue("whoosh/whoosh_01_soft.wav", F(sid) - 0.398, -11)
slide = lambda t, db=-12: cue("whoosh/whoosh_05_slide.wav", t, db)
tap = lambda t, db=-14: cue("click/click_01_tap.wav", t, db)
tick = lambda t, db=-15: cue("click/click_02_tap_short.wav", t, db)
pop_ = lambda t, db=-11: cue("click/click_03_badge_pop.wav", t, db)
correct = lambda t, db=-14: cue("click/click_05_correct.wav", t, db)
gears = lambda t, db=-15: cue("gears/gears_01.wav", t, db)
impact = lambda t, db=-10, f="impact_01_boom": cue(f"impact/{f}.wav", t, db)
def riser_into(t, imp=None, db=-10): return [cue("riser/riser_02_short.wav", t, -9, end=True), impact(t, db, imp) if imp else pop_(t)]
sfx = riser_into(0.9, "impact_01_boom", -11) + [pop_(E("S01", "heart"), -13), tick(E("S01", "now")), tap(E("S01", "really")), slide(E("S01", "today"), -14), tick(E("S01", "step"))]
sfx += [whoosh("S02"), tick(F("S02") + 0.4)] + [tick(E("S02", "windows") + i * 0.25, -16) for i in range(3)] + [tap(E("S02", "today")), slide(E("S02", "together"), -13), correct(E("S02", "real"))]
sfx += [whoosh("S03"), tick(E("S03", "weekly")), slide(E("S03", "daily"), -14), tap(E("S03", "ob")), tick(E("S03", "cheap")), pop_(E("S03", "eq"), -13), tick(E("S03", "liq"))]
sfx += [whoosh("S03b"), tap(E("S03b", "main")), tick(E("S03b", "sweep")), tick(E("S03b", "ob")), tick(E("S03b", "ny")), slide(E("S03b", "bos"), -14), correct(E("S03b", "buy"))]
sfx += [whoosh("S04"), tick(E("S04", "day")), slide(E("S04", "london"), -14), tap(E("S04", "reach")), pop_(E("S04", "rush"), -12), slide(E("S04", "list"), -13)]
sfx += riser_into(F("S05") + 0.1, "impact_01_boom", -12) + [tick(E("S05", "w1")), tick(E("S05", "d1")), tap(E("S05", "yes")), correct(E("S05", "tick") + 0.3)]
sfx += [whoosh("S06"), tick(E("S06", "fresh")), tick(E("S06", "cheap")), tap(E("S06", "yes")), pop_(E("S06", "intact"), -13), correct(E("S06", "tick") + 0.3)]
sfx += [whoosh("S07"), tick(E("S07", "before")), slide(E("S07", "taken"), -14), tap(E("S07", "yes")), pop_(E("S07", "eq"), -13), correct(E("S07", "tick") + 0.3)]
sfx += [whoosh("S08"), tick(E("S08", "window")), pop_(E("S08", "no"), -12), tick(E("S08", "london")), tap(E("S08", "first"))] + riser_into(E("S08", "wait"), "impact_01_boom", -11) + [tick(E("S08", "three")), tap(E("S08", "noentry"))]
sfx += [whoosh("S09"), tick(E("S09", "hour")), slide(E("S09", "ny"), -14), tick(E("S09", "m15")), tap(E("S09", "watch")), slide(E("S09", "lower"), -15), tick(E("S09", "back")), pop_(E("S09", "inwin"), -13), correct(E("S09", "tick") + 0.3)]
sfx += [slide(F("S10") + 0.2, -13), tick(E("S10", "m15")), slide(E("S10", "up"), -14), pop_(E("S10", "high"), -12), tap(E("S10", "close")), correct(E("S10", "tick") + 0.3)]
sfx += [whoosh("S11"), tick(E("S11", "half")), slide(E("S11", "cal"), -14), tap(E("S11", "none")), correct(E("S11", "tick") + 0.3)]
sfx += [slide(F("S12") + 0.2, -13), tick(E("S12", "rr")), tap(E("S12", "entry")), tick(E("S12", "sl")), tick(E("S12", "tp")), pop_(E("S12", "three"), -12), tick(E("S12", "two")), correct(E("S12", "ok")), correct(E("S12", "tick") + 0.3)]
sfx += riser_into(E("S13", "seven"), "impact_01_boom", -11) + [tick(E("S13", "seven") + 0.4 + i * 0.12, -17) for i in range(7)] + [tap(E("S13", "now")), pop_(E("S13", "entry"), -12), tick(E("S13", "risk")), tick(E("S13", "one")), slide(E("S13", "sure"), -14), correct(E("S13", "conf"))]
sfx += [whoosh("S14"), slide(E("S14", "coin"), -13), tick(E("S14", "five")), pop_(E("S14", "below"), -12), tap(E("S14", "void")), tap(E("S14", "notrade")), tick(E("S14", "journal")), correct(E("S14", "right")), tick(E("S14", "lesson"))]
sfx += [whoosh("S15"), tap(E("S15", "after")), tick(E("S15", "prove")), slide(E("S15", "before"), -14), correct(E("S15", "justify"))]
sfx += [whoosh("S16"), tap(E("S16", "week"))] + [tick(E("S16", "week") + 0.3 + i * 0.15, -17) for i in range(5)] + [tick(E("S16", "ny")), slide(E("S16", "chart"), -15), tick(E("S16", "own")), tick(E("S16", "fill")), tick(E("S16", "paper")), tick(E("S16", "demo")), pop_(E("S16", "journal"), -13), tick(E("S16", "decision")), tap(E("S16", "notorder"))]
sfx += [whoosh("S17"), tap(E("S17", "seven"))] + [tick(E("S17", k)) for k in ("s1", "s2", "s3", "s4")] + [whoosh("S17b")] + [tick(E("S17b", k)) for k in ("s5", "s6", "s7")] + [pop_(E("S17b", "wait"), -12), tick(E("S17b", "risk"))]
sfx += [tap(E("S18", "like"), -13), tap(E("S18", "sub"), -13), pop_(E("S18", "bell"), -13)]
sfx += [slide(F("S19") + 0.2), tick(E("S19", "manage")), slide(E("S19", "sl"), -14), tick(E("S19", "breathe"))]
sfx += riser_into(VOICE_CUT + 0.5, "impact_03_reverb_cut4s", -9)                 # the logo hit after «مالی»
sfx.sort(key=lambda s: s["t"])
imp = [s["t"] for s in sfx if "impact" in s["file"]]; assert all(b - a >= 15 for a, b in zip(imp, imp[1:])), imp
music = {"bpm": 80, "sections": [[0.0, 1], [F("S02"), 2], [F("S03"), 1], [F("S05"), 3], [F("S08"), 1], [F("S09"), 3], [F("S13"), 2], [F("S14"), 1], [F("S16"), 2], [F("S17"), 1], [F("S18"), 2], [F("S20"), 1]],
         "accents": [0.9, F("S05"), E("S08", "wait"), E("S13", "seven"), F("S20")]}
R = L("remotion"); [os.makedirs(os.path.join(R, *p), exist_ok=True) for p in (("src",), ("audio", "timing"), ("audio", "build"))]
lines = [{"start": l["start"], "end": min(l["end"], VOICE_CUT), "words": [{"t": w["t"], "s": w["s"], "e": w["e"]} for w in l["words"]]} for l in LINES if l["start"] < VOICE_CUT]
json.dump({"fps": FPS, "duration": OUT, "size": [1920, 1080], "shots": shots, "lines": lines}, open(os.path.join(R, "src", "shots.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"mode": "lesson", "duration": OUT, "fps": FPS, "voice_src": "../../input/voice.mp3", "voice_cut": VOICE_CUT, "sfx": sfx, "silences": [], "music": music},
          open(os.path.join(R, "audio", "timing", "timeline.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
tot, cnt = {}, {}
for s in shots: tot[s["type"]] = tot.get(s["type"], 0) + (s["to"] - s["from"]); cnt[s["type"]] = cnt.get(s["type"], 0) + 1
json.dump({"types": TYPES, "count": cnt, "seconds": {k: round(v, 1) for k, v in tot.items()}}, open(L("timing", "variety.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(shots)} shots; {len(sfx)} sfx cues, impacts at {[round(x, 1) for x in imp]}; chart {tot.get('chart', 0):.0f} s of {OUT:.0f} s")
for s in shots: print(f"{s['id']:4} {s['type']:6} {s['from']:7.2f}-{s['to']:7.2f} {s['to'] - s['from']:5.1f}s  {s['spoken'][:62]}")
