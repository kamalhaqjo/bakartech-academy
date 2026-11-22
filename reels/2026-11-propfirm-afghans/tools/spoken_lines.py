#!/usr/bin/env python3
"""Split the script (input/narration.txt) into one line per Whisper sentence (timing/asr.json) -> input/narration_spoken.txt.
Whisper sentences end at pauses, and the narrator pauses at punctuation, so each sentence is a run of script clauses; the runs are chosen
together so the text matches what Whisper heard best. usage: spoken_lines.py"""
import difflib, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); P = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(P("timing", "asr.json")))["sentences"]
text = " ".join(open(P("input", "narration.txt"), encoding="utf-8").read().split())
# the closing brand line («از آکادمی بَکَر تِک») stays in the text: timing.py cuts it from the subtitles and plan voice_cut mutes it from the voice
clauses = [c.strip() for c in re.findall(r"[^.؟!:،؛]+[.؟!:،؛]?", text) if c.strip()]
norm = lambda s: re.sub(r"[\s‌،,.؟?!:؛«»]", "", s).replace("ي", "ی").replace("ك", "ک")
# global alignment (dynamic programming): split the clauses into len(A) consecutive runs so the characters Whisper heard are matched best;
# a sentence whose transcript was cut short still gets its last clause, because the next sentence would match it even worse
def matched(cand, heard): return sum(m.size for m in difflib.SequenceMatcher(None, norm(cand), heard, autojunk=False).get_matching_blocks())
H = [norm(a["asr"]) for a in A]; NS, NC, MAXN = len(A), len(clauses), 8
best = {(0, 0): (0, None)}
for si in range(NS):
    for k in range(NC):
        if (si, k) not in best: continue
        for n in range(1, MAXN + 1):
            if k + n > NC: break
            sc = best[(si, k)][0] + matched(" ".join(clauses[k:k + n]), H[si])
            if sc > best.get((si + 1, k + n), (-1,))[0]: best[(si + 1, k + n)] = (sc, (k, n))
assert (NS, NC) in best, "no alignment"
runs, si, k = [], NS, NC
while si: k0, n = best[(si, k)][1]; runs.append((k0, n)); si, k = si - 1, k0
lines = [" ".join(clauses[k0:k0 + n]) for k0, n in reversed(runs)]
for si, l in enumerate(lines): print(f"{si:2d} {difflib.SequenceMatcher(None, norm(l), H[si]).ratio():.2f} | {l}")
open(P("input", "narration_spoken.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
