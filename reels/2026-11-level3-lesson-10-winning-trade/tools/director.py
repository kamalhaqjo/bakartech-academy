#!/usr/bin/env python3
"""Level 3, lesson 10 director (the anatomy of one winning trade on gold, in nine stages), from the owner's script: the hook (a winning trade
starts at the weekend), the agenda, the disclaimer, then the nine stages with a stage bar on top (weekly plan, two days of patience, the
Wednesday preparation, New York's second window with the M5 break and gap, the seven-step checklist ticking on each «تیک», the size
formula, management in R, the exit, the journal), the big picture (the entry is about 5%), process over result, the practice, the summary,
the end and the next lesson (a losing trade). Rules: charts under 30% of the time, no two shots of a kind in a row, the picture changes every
4-7 s, every cut and event locked to the narration (timing/asr.json + words.json). «از آکادمی بکر تیک» is cut from the voice and the
subtitles (the line ends on «مالی»). Writes remotion/src/shots.json and remotion/audio/timing/timeline.json.
Anchors: a sentence index (the cut in the pause before it), [sentence, word(, nth)] (just before that word), ("gap", sentence, word) or seconds.
usage: director.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__)); L = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(L("timing", "asr.json")))["sentences"]
W = json.load(open(L("timing", "words.json"), encoding="utf-8"))["words"]
LINES = json.load(open(L("timing", "lines.json"), encoding="utf-8"))["lines"]
FPS, VOICE_CUT = 30, 480.45                     # «مالی» ends at 480.37, «از آکادمی بکر تیک» starts at 480.53 (pauses of input/voice.mp3)
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
         "stat": "نمودار مقایسه (stat-chart)", "paper": "میز کاغذی (paper-desk)", "preview": "پیش‌نمایش", "title": "کارت فصل"}
# id, start anchor, type, component, camera, on-screen text, events {key: word anchor}, extra fields
S = [
 ("P01", 0, "typo", "hookWeek", "push", [], {"week": (0, "آخر"), "button": (1, "دکمه")}, {}),
 ("P02", 2, "recap", "agenda10", "pan", [], {"plan": (3, "پلن"), "prep": (3, "آماده‌سازی"), "entry": (3, "ورود"), "manage": (3, "مدیریت"), "exit": (3, "خروج"), "journal": (3, "ژورنال"), "levels": (3, "همه")}, {}),
 ("P03", 4, "info", "disclaim", "push", [], {"example": (4, "نمونه"), "goal": (5, "هدف"), "copy": (5, "کپی")}, {}),
 ("P04", 6, "object", "weekly10", "pan", [], {"up": (7, "صعودی"), "hh": (8, "سقف‌ها"), "broke": (9, "شکسته"), "back": (9, "برگشته")}, {"stage": 1}),
 ("P05", 10, "map", "daily10", "push", [], {"ob": (10, "اردر"), "cheap": (10, "ارزان"), "low": (11, "کف"), "liq": (11, "نقدینگی")}, {"stage": 1}),
 ("P06", 12, "paper", "plan10", "pan", [], {"main": (12, "سناریوی"), "sweep": (12, "اگر"), "inob": (12, "وارد"), "bos": (12, "نیویورک"), "buy": (12, "آنگاه"), "second": (14, "سناریوی"), "cal": (15, "تقویم")}, {"stage": 1}),
 ("P07", 16, "ui", "wait10", "push", [], {"notyet": (17, "قیمت"), "prep": (17, "آماده‌سازی"), "look": (17, "فقط"), "none": (17, "هیچ"), "part": (18, "این"), "patience": (19, "صبر")}, {"stage": 2}),
 ("P08", 20, "scene", "wedPrep", "pan", [], {"asia": (21, "آسیا"), "london": (22, "لندن"), "low2": (22, "دو"), "ob": (22, "وارد"), "back": (23, "کمی")}, {"stage": 3}),
 ("P09", 24, "paper", "wedJournal", "push", [], {"ready": (24, "طلا"), "liq": (25, "نقدینگی"), "zone": (26, "قیمت"), "wait": (26, "منتظر"), "news": (27, "خبر")}, {"stage": 3}),
 ("P10", 28, "chart", "nyBOS", "pan", [], {"time": (30, "ساعت"), "strong": (30, "قوی"), "close": (30, "شمع"), "bos": (31, "شکست"), "fvg": (32, "شکاف"), "nohurry": (33, "عجله"), "retrace": (34, "صبر")}, {"stage": 4}),
 ("P11", 35, "ui", "check10", "push", [], {"c1": (38, "جهت"), "k1": (39, "تیک"), "c2": (41, "ناحیه"), "k2": (42, "تیک"), "c3": (43, "جمع"), "k3": (45, "تیک"), "c4": (46, "زمان"), "k4": (47, "تیک")}, {"stage": 5}),
 ("P12", 48, "info", "check10", "pan", [], {"c5": (48, "شکست"), "k5": (50, "تیک"), "c6": (52, "ناحیه"), "k6": (54, "تیک"), "c7": (55, "نسبت"), "sl": (55, "حد"), "tp": (56, "هدف"), "rr": (57, "نسبت"), "k7": (58, "تیک"), "all": (59, "هفت"), "entry": (60, "ورود")}, {"stage": 5, "done": 4}),
 ("P13", 61, "stat", "size10", "push", [], {"risk": (63, "ریسک"), "formula": (64, "فرمول"), "exact": (65, "حجم"), "set": (65, "حد")}, {"stage": 6}),
 ("P14", 66, "chart", "manage10", "pan", [], {"move": (67, "قیمت"), "one": (67, "یک"), "be": (67, "ورود"), "norisk": (68, "بدون"), "time": (69, "یازده"), "two": (69, "دو"), "half": (70, "نصف"), "rest": (71, "بقیه")}, {"stage": 7}),
 ("P15", 72, "object", "exit10", "push", [], {"thu": (74, "پنج‌شنبه"), "hit": (75, "هدف"), "total": (76, "نتیجه"), "pct": (77, "یعنی")}, {"stage": 8}),
 ("P16", 78, "paper", "journal10", "pan", [], {"pics": (80, "عکس"), "plan": (81, "طبق"), "seven": (82, "هفت"), "feel": (83, "حس"), "good": (85, "چیزی"), "better": (86, "چیزی")}, {"stage": 9}),
 ("P17", 88, "info", "bigPicture", "push", [], {"five": (90, "شاید"), "rest": (91, "بقیه‌اش"), "smallest": (92, "ورود")}, {}),
 ("P18", 93, "typo", "processNote", "pan", [], {"won": (93, "این"), "sl": (93, "اگر"), "good": (93, "خوب"), "result": (95, "نتیجه"), "process": (95, "فرایند")}, {}),
 ("P19", 96, "paper", "practice10", "push", [], {"last": (97, "آخرین"), "demo": (97, "حساب"), "nine": (97, "نه"), "skip": (101, "ببین")}, {}),
 ("P20", 102, "recap", "summary9", "pan", ["خلاصه درس امروز"], {"s1": (104, "پلن"), "s2": (104, "صبر"), "s3": (104, "آماده‌سازی"), "s5": (104, "چک‌لیست"), "s4": (104, "وارد"), "s6": (104, "حجم"), "s7": (104, "مدیریت"), "s8": (104, "ادامه"), "s9": (104, "ژورنال"), "smallest": (105, "ورود")}, {}),
 ("P21", 106, "cta", "ctaEnd", "push", [], {"like": (106, "لایک"), "happy": (106, "خوشحالمان"), "sub": (107, "دنبال"), "bell": (107, "زنگوله"), "ig": (107, "اینستاگرامم"), "follow": (107, "فالو")}, {}),
 ("P22", 108, "preview", "nextLoss", "pan", ["درس بعد: کالبدشکافی یک معامله ضررده"], {"loss": (108, "ضررده"), "learn": (109, "ضررها"), "good": (109, "خوب"), "bad": (109, "بد")}, {}),
 ("P23", (110, "من"), "brand", "outro10", "push", [], {}, {}),
]

def T(v): return v if isinstance(v, float) else cut(v) if (isinstance(v, tuple) and v[0] == "gap") else word(*v)
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
# sounds follow the events of each shot: a riser and an impact on the hook and every chapter card, a whoosh on the other cuts, a correct
# on each tick, a pop on the refusals and warnings, a slide on the caption bars, ticks and taps in between
BAD = {"copy", "second", "nohurry", "sl", "skip", "bad", "loss"}
sfx = riser_into(0.9, "impact_01_boom", -11)
for k, sh in enumerate(shots):
    if sh["type"] == "title" or sh["id"] in ("P04", "P10", "P11", "P15", "P17"): sfx += riser_into(sh["from"] + 0.05, "impact_01_boom", -12)
    elif k: sfx.append(whoosh(sh["id"]) if sh["type"] != "chart" else slide(sh["from"] + 0.2, -13))
    for j, (key, v) in enumerate(sorted(sh["ev"].items(), key=lambda kv: kv[1])):
        t = sh["from"] + v
        if key == "tick" or (key[0] == "k" and key[1:].isdigit()) or key in ("all", "hit", "entry"): sfx.append(correct(t + 0.2))
        elif key == "cap": sfx.append(slide(t, -15))
        elif key in BAD: sfx.append(pop_(t, -13))
        else: sfx.append(tick(t) if j % 2 == 0 else tap(t, -15))
sfx += riser_into(VOICE_CUT + 0.5, "impact_03_reverb_cut4s", -9)                 # the logo hit after «مالی»
sfx.sort(key=lambda s: s["t"])
imp = [s["t"] for s in sfx if "impact" in s["file"]]; assert all(b - a >= 15 for a, b in zip(imp, imp[1:])), imp
ST = [next(sh["from"] for sh in shots if sh.get("stage") == n) for n in range(1, 10)]
music = {"bpm": 80, "sections": [[0.0, 1], [F("P02"), 2], [F("P04"), 1]] + [[x, 2 + (k % 2)] for k, x in enumerate(ST[1:])] + [[F("P17"), 1], [F("P19"), 2], [F("P20"), 1], [F("P21"), 2], [F("P23"), 1]],
         "accents": [0.9, F("P04"), F("P10"), F("P11"), F("P15"), F("P17"), F("P23")]}
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
