#!/usr/bin/env python3
"""Level 3, lesson 11 director (good loss and bad loss: two losing trades taken apart), from the owner's script: the hook (everyone shows
their wins; today a losing trade), level 3 lesson 1 (losses are shown; the best lose often, small), two losses today, trade 1 the good loss
(Dow Jones: plan, Tuesday's New York M5 break, 7/7, size, 1% risk, the stop hit at −1%, the journal, «where was the mistake? nowhere», 100
repeats with a positive expectancy, a business cost like a shop's rent), trade 2 the bad loss (gold the same week, not in the zone, 12:30 FOMO
buy without the checklist, a tight stop for size, the stop dragged lower, −2.5%), the six mistakes, the comparison, the five steps after a
loss, never change the system after one or two losses, the practice, the summary, the end and the next lesson (re-entry or revenge). A parts
bar on top (good loss, bad loss, compare, after a loss). Rules: charts under 30% of the time, no two shots of a kind in a row, the picture
changes every 4-7 s, every cut and event locked to the narration (timing/asr.json + words.json). «از آکادمی بکر تیک» is cut from the voice
and the subtitles (the line ends on «مالی»). Writes remotion/src/shots.json and remotion/audio/timing/timeline.json.
Anchors: a sentence index (the cut in the pause before it), [sentence, word(, nth)] (just before that word), ("gap", sentence, word) or seconds.
usage: director.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); L = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(L("timing", "asr.json")))["sentences"]
W = json.load(open(L("timing", "words.json"), encoding="utf-8"))["words"]
LINES = json.load(open(L("timing", "lines.json"), encoding="utf-8"))["lines"]
FPS, VOICE_CUT = 30, 411.98                     # «مالی» ends at 411.78, «از آکادمی بکر تیک» starts at 412.10 (pauses of input/voice.mp3)
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
 ("P01", 0, "typo", "hookWins", "push", [], {"wins": (0, "همه"), "today": (1, "امروز"), "loss": (1, "ضررده"), "learn": (2, "همین")}, {}),
 ("P02", 3, "info", "realLoss", "pan", [], {"lesson1": (3, "درس"), "market": (4, "بازار"), "best": (4, "بهترین"), "part": (4, "بخش"), "diff": (5, "فرقشان"), "small": (5, "کوچک"), "learn": (5, "یاد")}, {}),
 ("P03", 6, "recap", "twoLosses", "push", [], {"two": (6, "دو"), "good": (7, "خوب"), "bad": (7, "بد"), "both": (8, "هر"), "differ": (8, "کاملا")}, {}),
 ("P04", 9, "title", "tradeTitle", "push", [], {}, {"n": 1, "part": 1}),
 ("P05", 10, "object", "dowPlan", "pan", [], {"dow": (10, "داو"), "weekly": (11, "پلن"), "main": (12, "سناریوی"), "ob": (13, "اردر"), "liq": (13, "نقدینگی")}, {"part": 1}),
 ("P06", 14, "chart", "dowNY", "pan", [], {"tue": (14, "سه"), "zone": (14, "قیمت"), "t930": (15, "ساعت"), "low": (15, "کف"), "wait": (16, "پانزده"), "t955": (17, "ساعت"), "bos": (17, "شکست"), "ob": (18, "برگشت")}, {"part": 1}),
 ("P07", 19, "ui", "dowCheck", "push", [], {"check": (19, "چک"), "size": (20, "حجم"), "risk": (21, "ریسک"), "entry": (22, "ورود")}, {"part": 1}),
 ("P08", 23, "chart", "dowLoss", "pan", [], {"up": (23, "قیمت"), "notone": (23, "نرسید"), "back": (24, "برگشت"), "hit": (24, "خورد"), "loss": (25, "ضرر")}, {"part": 1}),
 ("P09", 26, "paper", "dowJournal", "push", [], {"q": (26, "چه"), "plan": (27, "طبق"), "seven": (28, "هفت"), "sl": (29, "حد"), "size": (30, "حجم"), "after": (31, "بعد")}, {"part": 1}),
 ("P10", 32, "typo", "whereMistake", "pan", [], {"q": (33, "اشتباه"), "none": (35, "هیچ"), "good": (36, "این")}, {"part": 1}),
 ("P11", 37, "stat", "hundred", "push", [], {"some": (37, "بعضی"), "this": (37, "این"), "hundred": (38, "صد"), "exp": (38, "امید"), "total": (38, "مجموع")}, {"part": 1}),
 ("P12", 39, "scene", "shopRent", "pan", [], {"cost": (39, "هزینه"), "rent": (40, "اجاره")}, {"part": 1}),
 ("P13", 41, "title", "tradeTitle", "push", [], {}, {"n": 2, "part": 2}),
 ("P14", 42, "object", "goldNotYet", "pan", [], {"gold": (42, "طلا"), "week": (43, "همان"), "up": (44, "پلن"), "notyet": (44, "هنوز")}, {"part": 2}),
 ("P15", 45, "chart", "goldFomo", "push", [], {"thu": (45, "پنج"), "spike": (45, "تند"), "think": (46, "دیدیم"), "miss": (46, "جا"), "buy": (47, "بدون"), "tight": (48, "حد"), "bigsize": (48, "حجم")}, {"part": 2}),
 ("P16", 49, "ui", "slMoved", "pan", [], {"back": (49, "قیمت"), "drag": (50, "پایین"), "hope": (50, "امید"), "never": (51, "برنگشت"), "loss": (52, "ضرر")}, {"part": 2}),
 ("P17", 53, "teardown", "mistakes6", "push", [], {"q": (54, "چند"), "m1": (55, "اشتباه"), "t1": (56, "سناریو"), "s1": (57, "قیمت"), "m2": (58, "اشتباه"), "t2": (59, "بیرون"), "s2": (60, "ساعت"), "m3": (61, "اشتباه"), "t3": (62, "بدون")}, {"part": 2}),
 ("P18", 63, "info", "mistakes6", "pan", [], {"m4": (63, "اشتباه"), "t4": (64, "ترس"), "s4": (65, "دلیل"), "m5": (66, "اشتباه"), "t5": (67, "حجم")}, {"part": 2, "done": 3}),
 ("P19", 68, "object", "worstSL", "push", [], {"m6": (68, "اشتباه"), "worst": (68, "بدترین"), "drag": (69, "جابه"), "turn": (70, "این"), "six": (71, "شش")}, {"part": 2}),
 ("P20", 72, "stat", "compare11", "pan", [], {"c1": (73, "معامله"), "z1": (73, "هیچ"), "c2": (74, "معامله"), "z2": (74, "شش"), "if": (75, "اگر"), "num": (75, "عدد"), "bothbad": (75, "هر"), "works": (76, "اولی"), "aside": (76, "دومی")}, {"part": 3}),
 ("P21", 77, "typo", "afterLoss", "push", [], {"important": (77, "مهم"), "after": (77, "بعد")}, {"part": 4}),
 ("P22", 78, "scene", "step1Away", "pan", [], {"away": (79, "پنج"), "water": (80, "آب"), "breathe": (80, "نفس")}, {"part": 4}),
 ("P23", 81, "paper", "step2Journal", "push", [], {"write": (82, "ژورنال"), "num": (83, "عدد"), "q": (83, "آیا")}, {"part": 4}),
 ("P24", 84, "map", "step34", "pan", [], {"s3": (84, "قدم"), "yes": (85, "اگر"), "goodl": (86, "این"), "keep": (87, "هیچ"), "s4": (88, "قدم"), "no": (89, "اگر"), "rule": (89, "کدام"), "note": (90, "یک"), "next": (90, "دفعه")}, {"part": 4}),
 ("P25", 91, "object", "step5Two", "push", [], {"s5": (91, "قدم"), "rule": (92, "قانون"), "two": (93, "دومین"), "over": (93, "تمام")}, {"part": 4}),
 ("P26", 94, "info", "dontSwitch", "pan", [], {"never": (95, "هرگز"), "two": (95, "یک"), "swap": (95, "عوض"), "scale": (96, "یک"), "judge": (96, "پنجاه"), "many": (97, "خیلی"), "nolearn": (97, "هیچ")}, {"part": 4}),
 ("P27", 98, "paper", "practice11", "push", [], {"open": (99, "ژورنالت"), "split": (99, "دو"), "gcol": (99, "خوب"), "bcol": (99, "بد"), "rule": (100, "بنویس"), "count": (101, "بعد"), "most": (102, "کدام"), "first": (103, "همان"), "fix": (103, "درست")}, {}),
 ("P28", 104, "recap", "summary11", "pan", ["خلاصه درس امروز"], {"two": (105, "دو"), "good": (106, "ضرر"), "cost": (106, "هزینه"), "bad": (107, "ضرر"), "b1": (108, "سناریوی"), "b2": (108, "بیرون"), "b3": (108, "بدون"), "b4": (108, "ترس"), "b5": (108, "حجم"), "b6": (108, "جابه"), "steps": (109, "بعد"), "sys": (110, "سیستم")}, {}),
 ("P29", 111, "cta", "ctaEnd", "push", [], {"like": (111, "لایک"), "happy": (111, "خوشحالمان"), "sub": (112, "دنبال"), "bell": (112, "زنگوله"), "ig": (113, "اینستاگرامم"), "follow": (113, "فالو")}, {}),
 ("P30", 114, "preview", "nextRevenge", "pan", ["درس بعد: ورود دوباره یا انتقام؟"], {"sl": (115, "حد"), "went": (115, "قیمت"), "again": (116, "آیا"), "when": (117, "کی"), "revenge": (117, "انتقام")}, {}),
 ("P31", (118, "من"), "brand", "outro11", "push", [], {}, {}),
]
IMPACT = ("P10", "P17", "P19", "P21", "P26")

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
BAD = {"loss", "hit", "notone", "never", "aside", "miss", "tight", "bigsize", "buy", "drag", "worst", "six", "revenge", "notyet", "bothbad", "nolearn", "over", "swap"}
GOOD = {"check", "entry", "none", "good", "works", "keep", "first", "all"}
sfx = riser_into(0.9, "impact_01_boom", -11)
for k, sh in enumerate(shots):
    if sh["type"] == "title" or sh["id"] in IMPACT: sfx += riser_into(sh["from"] + 0.05, "impact_01_boom", -12)
    elif k: sfx.append(whoosh(sh["id"]) if sh["type"] != "chart" else slide(sh["from"] + 0.2, -13))
    for j, (key, v) in enumerate(sorted(sh["ev"].items(), key=lambda kv: kv[1])):
        t = sh["from"] + v
        if key == "tick" or (key[0] == "k" and key[1:].isdigit()) or key in GOOD: sfx.append(correct(t + 0.2))
        elif key == "cap": sfx.append(slide(t, -15))
        elif key in BAD or (key[0] == "m" and key[1:].isdigit()): sfx.append(pop_(t, -13))
        else: sfx.append(tick(t) if j % 2 == 0 else tap(t, -15))
sfx += riser_into(VOICE_CUT + 0.5, "impact_03_reverb_cut4s", -9)                 # the logo hit after «مالی»
sfx.sort(key=lambda s: s["t"])
imp = [s["t"] for s in sfx if "impact" in s["file"]]; assert all(b - a >= 15 for a, b in zip(imp, imp[1:])), imp
music = {"bpm": 80, "sections": [[0.0, 1], [F("P02"), 2], [F("P04"), 1], [F("P05"), 2], [F("P13"), 1], [F("P14"), 3], [F("P17"), 2], [F("P20"), 3], [F("P21"), 1], [F("P22"), 2],
                               [F("P27"), 1], [F("P28"), 2], [F("P30"), 2], [F("P31"), 1]],
         "accents": [0.9] + [F(x) for x in ("P04",) + IMPACT[:1] + ("P13",) + IMPACT[1:]] + [F("P31")]}
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
