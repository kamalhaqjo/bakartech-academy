#!/usr/bin/env python3
"""Prop-firm special timing: word onsets from the Whisper pass (timing/asr.json, made by ../2026-11-lesson-2-crypto/tools/asr.py + asr_pieces.py)
-> timing/words.json, then word-synced subtitle lines (<= 7 words and <= 38 characters for the 1920x1080 frame, the spoken «بکار تیک» shown as Bakartech.)
-> timing/lines.json, out/subtitles.srt, out/subtitles.vtt. The closing «از آکادمی بکرتک» is cut from the voice (plan voice_cut), so it is left
out of the subtitles too and the line ends on «مالی.». If the brand line sits before other closing words, it is spliced out of the
voice instead (timing/splice.json: {"a", "b"} in seconds, the cut audio from a to b) and every word after it moves b - a earlier.  usage: timing.py"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__)); P = lambda *a: os.path.join(HERE, *a)
WORDS_PY = os.path.join(HERE, "..", "2026-11-lesson-2-crypto", "tools", "words.py")
subprocess.run([sys.executable, WORDS_PY, P("timing", "asr.json"), P("input", "narration_spoken.txt"), P("timing", "words.json"), "--match"], check=True)
W = json.load(open(P("timing", "words.json"), encoding="utf-8"))["words"]

toks = []                                   # merge «بکار تیک» into the Latin brand for the subtitles
i = 0
while i < len(W):
    w = W[i]
    if w["w"] == "بکار" and i + 1 < len(W) and W[i + 1]["w"].startswith("تیک"):
        toks.append({"t": "Bakartech" + W[i + 1]["w"][len("تیک"):], "s": w["s"], "e": W[i + 1]["e"], "sent": w["sent"]}); i += 2
    else:
        toks.append({"t": w["w"], "s": w["s"], "e": w["e"], "sent": w["sent"]}); i += 1

# the closing brand line «از آکادمی بَکَر تِک.» (the owner rule: cut from the voice and the subtitles; the line ends on «مالی.»)
norm_t = lambda t: re.sub(r"[\u064B-\u065F\u200c.،,]", "", t)          # drop harakat, ZWNJ and punctuation to compare the brand words
BRAND = (["از", "آکادمی", "بکر", "تک"], ["از", "آکادمی", "بکرتک"], ["از", "آکادمی", "بکر", "تیک"], ["از", "آکادمی", "Bakartech"])   # the script writes the brand in several ways
TAIL = next((len(b) for b in BRAND if len(toks) >= len(b) and [norm_t(t["t"]) for t in toks[-len(b):]] == b), 0)
CUT_TAIL = TAIL > 0
if CUT_TAIL: toks = toks[:-TAIL]; toks[-1]["t"] = toks[-1]["t"].rstrip("،") + "."
CUT_MID = None                              # the brand line in the middle of the closing («... مالی، از آکادمی بَکَر تِک. ممنون ...»)
for k in range(len(toks) - 4, 0, -1):
    if [norm_t(t["t"]) for t in toks[k:k + 4]] == ["از", "آکادمی", "بکر", "تک"]: CUT_MID = k; break
if CUT_MID and os.path.exists(P("timing", "splice.json")):
    sp = json.load(open(P("timing", "splice.json"))); shift = sp["b"] - sp["a"]
    toks = toks[:CUT_MID] + toks[CUT_MID + 4:]; toks[CUT_MID - 1]["t"] = toks[CUT_MID - 1]["t"].rstrip("،") + "."
    for t in toks[CUT_MID:]: t["s"] = round(t["s"] - shift, 3); t["e"] = round(t["e"] - shift, 3)
elif CUT_MID: CUT_MID = None                # no splice measured yet: keep the line (first pass)
MAXW, MAXC = 7, 38
# phrases end at a pause (> 0.35 s), a sentence end or a new Whisper sentence; a long phrase is split into the fewest lines that fit,
# with the break points chosen so the lines are balanced and prefer to end on a comma (no one-word orphans)
phrases, cur = [], []
for k, t in enumerate(toks):
    if cur and (cur[-1]["sent"] != t["sent"] or t["s"] - cur[-1]["e"] > 0.35): phrases.append(cur); cur = []
    cur.append(t)
    if t["t"][-1] in ".؟!:" : phrases.append(cur); cur = []
if cur: phrases.append(cur)
txt = lambda ts: " ".join(x["t"] for x in ts)
fits = lambda ts: len(ts) <= MAXW and len(txt(ts)) <= MAXC
def split(ph):
    n = len(ph); best = {0: (0.0, [])}
    gap = lambda i: ph[i + 1]["s"] - ph[i]["e"] if i + 1 < n else 9.0       # pause after word i
    brk = lambda k: 0 if k == n or gap(k - 1) >= 0.12 else 25 if ph[k - 1]["t"][-1] in "،," else 60
    alone = lambda j: gap(j) >= 0.12 and (j == 0 or gap(j - 1) >= 0.12)   # a word spoken on its own may stand alone
    for k in range(1, n + 1):
        opts = []
        for j in range(max(0, k - MAXW), k):
            if j in best and fits(ph[j:k]):
                L = len(txt(ph[j:k])); c = best[j][0] + 1000 + (MAXC - L) ** 2 * 0.2 + brk(k) + (300 if k - j == 1 and n > 1 and not alone(j) else 0)
                opts.append((c, best[j][1] + [(j, k)]))
        if opts: best[k] = min(opts, key=lambda o: o[0])
    return [ph[j:k] for j, k in best[n][1]]
lines = [l for ph in phrases for l in split(ph)]
out = []
for n, l in enumerate(lines):
    s, e = l[0]["s"], l[-1]["e"]
    if out and s < out[-1]["end"] + 0.02: s = out[-1]["end"] + 0.02
    out.append({"n": n, "start": round(s, 3), "end": round(e, 3), "words": [{"t": x["t"], "s": round(x["s"], 3), "e": round(x["e"], 3)} for x in l]})
json.dump({"lines": out}, open(P("timing", "lines.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

bad = [(l["n"], " ".join(w["t"] for w in l["words"])) for l in out if len(l["words"]) > MAXW or len(" ".join(w["t"] for w in l["words"])) > MAXC]
narr = open(P("input", "narration_spoken.txt"), encoding="utf-8").read().strip()      # what the recording actually says (minus the cut tail)
narr = re.sub(r"،?\s*از آکادمی بَ?کَ?ا?ر\s?تِ?ی?ک\.?$", ".", narr) if CUT_TAIL else narr
narr = (re.sub(r"،?\s*از آکادمی بَکَر تِک\.", ".", narr) if CUT_MID else narr).split()
said = " ".join(w["t"] for l in out for w in l["words"]).replace("Bakartech", "بکار تیک").split()
print(f"{len(W)} words, {len(out)} subtitle lines; limits {'ok' if not bad else bad[:4]}; subtitles == spoken text: {said == narr}")

ts = lambda s, c: f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{s % 60:06.3f}".replace(".", c)
os.makedirs(P("out"), exist_ok=True)
with open(P("out", "subtitles.srt"), "w", encoding="utf-8") as f:
    for l in out: f.write(f"{l['n'] + 1}\n{ts(l['start'], ',')} --> {ts(l['end'], ',')}\n{' '.join(w['t'] for w in l['words'])}\n\n")
with open(P("out", "subtitles.vtt"), "w", encoding="utf-8") as f:
    f.write("WEBVTT\n\n")
    for l in out: f.write(f"{ts(l['start'], '.')} --> {ts(l['end'], '.')}\n{' '.join(w['t'] for w in l['words'])}\n\n")
