#!/usr/bin/env python3
"""Contact sheet of the lesson 15 Remotion shots (DIRECTOR.md QA step): out/stills/<id>.png in a 6-column grid with id, type and time -> out/contact_sheet.png.
usage: contact_sheet.py"""
import json, os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); P = lambda *a: os.path.join(HERE, *a)
d = json.load(open(P("src", "shots.json"), encoding="utf-8"))
TW, TH, LB, G, COLS = 480, 270, 34, 14, 8
TYPE = {"title": "chapter card", "map": "map-route", "teardown": "teardown", "stat": "stat-chart", "paper": "paper-desk", "preview": "preview", "typo": "typography", "scene": "scene", "recap": "recap", "info": "infographic", "ui": "UI", "object": "object motion", "platform": "platform", "zoom": "UI zoom",
        "chart": "chart", "preview": "preview", "cta": "CTA", "brand": "brand", "flash": "flashback"}
COL = {"title": (255, 200, 60), "map": (38, 166, 154), "teardown": (232, 201, 106), "stat": (91, 141, 239), "paper": (60, 140, 90), "preview": (200, 200, 200), "typo": (232, 201, 106), "scene": (210, 160, 110), "recap": (180, 180, 180), "info": (91, 141, 239), "ui": (150, 120, 230), "object": (240, 140, 80), "platform": (38, 166, 154),
       "zoom": (90, 200, 190), "chart": (38, 166, 154), "preview": (200, 120, 160), "cta": (230, 80, 60), "brand": (212, 175, 55), "flash": (200, 170, 140)}
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
rows = (len(d["shots"]) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * (TW + G) + G, rows * (TH + LB + G) + G + 50), (13, 17, 23))
dr = ImageDraw.Draw(sheet)
dr.text((G, 14), f"Prop firms for Afghans (special) - {len(d['shots'])} shots (Remotion, DIRECTOR.md)", font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24), fill=(232, 201, 106))
mm = lambda t: f"{int(t // 60)}:{t % 60:04.1f}"
for i, s in enumerate(d["shots"]):
    x, y = G + (i % COLS) * (TW + G), 50 + G + (i // COLS) * (TH + LB + G)
    im = Image.open(P("out", "stills", f"{s['id']}.png")).convert("RGB").resize((TW, TH), Image.LANCZOS); sheet.paste(im, (x, y))
    dr.rectangle([x, y + TH, x + TW, y + TH + LB], fill=(22, 27, 36)); dr.rectangle([x, y + TH, x + 8, y + TH + LB], fill=COL[s["type"]])
    dr.text((x + 16, y + TH + 7), f"{s['id']}  {TYPE[s['type']]}  {mm(s['from'])}-{mm(s['to'])}", font=font, fill=(237, 230, 214))
sheet.save(P("out", "contact_sheet.png")); print("out/contact_sheet.png", sheet.size)
