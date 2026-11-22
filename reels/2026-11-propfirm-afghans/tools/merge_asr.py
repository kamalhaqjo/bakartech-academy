#!/usr/bin/env python3
"""Joins the Whisper passes of the two voice files (timing/asr_a.json, timing/asr_b.json, each with pieces_asr) into timing/asr.json for
input/voice.mp3 = voice_a + 0.7 s + voice_b cut at 521.70 s (the closing «از آکادمی بکر تیک» left out; the voice ends on «مالی»).
usage: merge_asr.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); P = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(P("timing", "asr_a.json"))); B = json.load(open(P("timing", "asr_b.json")))
OFF, CUT_B = round(A["voice_s"] + 0.7, 4), 521.70
out = []
for s in A["sentences"]: out.append(dict(s))
for s in B["sentences"]:
    if s["start"] >= CUT_B: continue
    s = dict(s); keep = [k for k, p in enumerate(s["pieces"]) if p[0] < CUT_B]
    if len(keep) < len(s["pieces"]):                       # the last sentence: drop the brand pieces
        s["pieces"] = [s["pieces"][k] for k in keep]; s["end"] = min(s["pieces"][-1][1], CUT_B)
        if "pieces_asr" in s: s["pieces_asr"] = [s["pieces_asr"][k] for k in keep]
        s["asr"] = " ".join(s.get("pieces_asr", [])) or s["asr"].split(" از ")[0]
    s["start"] = round(s["start"] + OFF, 3); s["end"] = round(s["end"] + OFF, 3); s["pieces"] = [[round(a + OFF, 3), round(b + OFF, 3)] for a, b in s["pieces"]]
    out.append(s)
for i, s in enumerate(out): s["i"] = i
json.dump({"voice_s": round(OFF + CUT_B, 3), "model": A.get("model"), "sentences": out}, open(P("timing", "asr.json"), "w"), ensure_ascii=False, indent=1)
print(len(out), "sentences; last:", out[-1]["asr"], out[-1]["end"])
