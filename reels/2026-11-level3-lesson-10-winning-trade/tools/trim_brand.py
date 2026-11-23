#!/usr/bin/env python3
"""Drops the closing «از آکادمی بکر تیک» from timing/asr.json (the speech pieces that start after CUT seconds), so the last spoken line ends
on «مالی» like the narration text; director.py mutes the voice after the same point (VOICE_CUT).  usage: trim_brand.py [in.json] [CUT]"""
import json, sys
src = sys.argv[1] if len(sys.argv) > 1 else "timing/asr.json"; CUT = float(sys.argv[2]) if len(sys.argv) > 2 else 480.45
d = json.load(open(src)); s = d["sentences"][-1]; keep = [k for k, p in enumerate(s["pieces"]) if p[0] < CUT]
s["pieces"] = [s["pieces"][k] for k in keep]; s["end"] = min(s["pieces"][-1][1], CUT)
if "pieces_asr" in s: s["pieces_asr"] = [s["pieces_asr"][k] for k in keep]
s["asr"] = " ".join(s["pieces_asr"]) if s.get("pieces_asr") else s["asr"].split(" از ")[0]
json.dump(d, open("timing/asr.json", "w"), ensure_ascii=False, indent=1)
print("last line:", s["asr"], s["end"])
