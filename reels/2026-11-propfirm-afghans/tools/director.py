#!/usr/bin/env python3
"""Director of the prop-firm special («پراپ‌فرم برای افغان‌ها», about 16.6 minutes) from the owner's script and two voice files joined in
input/voice.mp3 (tools/merge_asr.py): the hook, seven sections each opened by a chapter card («بخش N از ۷»), the owner's 14 on-screen
texts on the sentences that say them, the summary and the fixed end (like, YouTube, Instagram, «از کدام کشور هستی؟», the brand card).
Rules: charts under 30% of the time, no two shots of a kind in a row, the picture changes every 4-7 s, every cut and event locked to the
narration (timing/asr.json + words.json). «از آکادمی بکر تیک» is cut from the voice (the owner's rule), the voice ends on «مالی».
Writes remotion/src/shots.json and remotion/audio/timing/timeline.json.
Anchors: a sentence index (the cut in the pause before it), [sentence, word(, nth)] (just before that word), ("gap", sentence, word) or seconds.
usage: director.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__)); L = lambda *a: os.path.join(HERE, "..", *a)
A = json.load(open(L("timing", "asr.json")))["sentences"]
W = json.load(open(L("timing", "words.json"), encoding="utf-8"))["words"]
LINES = json.load(open(L("timing", "lines.json"), encoding="utf-8"))["lines"]
FPS, VOICE_CUT = 30, 995.71                     # the joined voice ends on «مالی» (voice_b cut at 521.70 s + 474.01 s)
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
NODES1 = [["fee", "dollar", "هزینه آزمون", "۵۰ تا ۵۰۰ دلار", ""], ["test", "layers", "حساب آزمونی", "۱۰ · ۵۰ · ۱۰۰ هزار دلاری", ""], ["target", "target", "هدف سود، بدون شکستن قانون", None, ""], ["funded", "trophy", "حساب سرمایه‌دار", None, "green"], ["share", "dollar", "۸۰ تا ۹۰٪ سود مال تو", None, "green"]]
NODES2 = [["-", "dollar", "هزینه آزمون", "۵۰ تا ۵۰۰ دلار", ""], ["-", "layers", "حساب آزمونی", "۱۰ · ۵۰ · ۱۰۰ هزار دلاری", ""], ["target", "target", "هدف سود، بدون شکستن قانون", None, ""], ["funded", "trophy", "حساب سرمایه‌دار", None, "green"], ["share", "dollar", "۸۰ تا ۹۰٪ سود مال تو", None, "green"]]
S = [
 ("P01", 0, "typo", "hook100", "push", [], {"hundred": (0, "صد"), "acct": (1, "حساب"), "own": (2, "بدون"), "good": (3, "خیلی")}, {}),
 ("P02", 4, "stat", "failStat", "pan", [], {"but": (4, "اما"), "most": (4, "بیشتر"), "fail": (4, "رد")}, {}),
 ("P03", 13.98, "map", "afgQuestion", "push", [], {"us": (4, "افغان‌ها"), "q": (5, "آیا"), "wd": (5, "برداشت")}, {}),
 ("P04", 6, "recap", "agenda", "pan", [], {"firms": (6, "پراپ‌فرم‌ها"), "honest": (7, "صادقانه"), "what": (8, "اینکه"), "where": (8, "افغان‌ها"), "reg": (8, "ثبت‌نام"), "usdt": (8, "تتر"), "traps": (9, "دام‌ها"), "strat": (9, "استراتژی")}, {}),
 ("P05", 10, "typo", "burn", "push", [], {"end": (10, "آخر"), "mistake": (10, "اشتباه"), "burn": (10, "بسوزاند")}, {}),
 ("P06", 11, "recap", "hello", "push", [], {"name": (11, "کمال"), "title": (11, "مربی")}, {}),
 ("P07", 12, "title", "chapter", "push", [], {}, {"n": 1, "sec": 1}),
 ("P08", 13, "scene", "firmGives", "pan", [], {"firm": (13, "پراپ‌فرم"), "capital": (13, "سرمایه‌اش"), "notall": (14, "اما"), "prove": (15, "اول")}, {"sec": 1}),
 ("P09", 16, "info", "flow", "push", [], {"fee": (17, "هزینه"), "test": (18, "حساب")}, {"sec": 1, "nodes": NODES1}),
 ("P10", 19, "object", "flow", "pan", [], {"target": (19, "هدف"), "funded": (20, "سرمایه‌دار"), "share": (21, "هشتاد"), "cap": (21, "مال")}, {"sec": 1, "nodes": NODES2, "cap": "پراپ‌فرم = هزینه آزمون ← حساب سرمایه‌دار ← ۸۰ تا ۹۰٪ سود مال تو"}),
 ("P11", 22, "stat", "calc", "push", [], {"acct": (22, "صد"), "pct": (22, "پنج"), "five": (22, "پنج", 2), "four": (22, "چهار"), "own": (23, "بدون")}, {"sec": 1, "rows": [["acct", "حساب", "۱۰۰,۰۰۰ دلار", ""], ["pct", "سود", "۵٪", ""], ["five", "یعنی", "۵,۰۰۰ دلار", ""], ["four", "سهم تو (حدود ۸۰٪)", "≈ ۴,۰۰۰ دلار", "green"]], "ops": ["×", "=", "→"], "chips": [["own", "بدون یک دلار از پول خودت در بازار", "green"]]}),
 ("P12", 24, "info", "revenue", "pan", [], {"q": (24, "شرکت"), "fees": (26, "هزینه"), "most": (27, "بیشتر"), "share": (28, "سهم")}, {"sec": 1}),
 ("P13", 29, "object", "discipline", "push", [], {"design": (30, "طراحی"), "calm": (30, "منظم"), "rush": (31, "عجله"), "firm": (31, "درآمد")}, {"sec": 1}),
 ("P14", 32, "title", "chapter", "push", [], {}, {"n": 2, "sec": 2}),
 ("P15", 35, "typo", "listen", "push", [], {"listen": (35, "این"), "lose": (35, "خیلی‌ها")}, {"sec": 2}),
 ("P16", 36, "map", "afgBanned", "pan", [], {"truth": (36, "حقیقت"), "live": (37, "افغانستان"), "list": (37, "فهرست")}, {"sec": 2}),
 ("P17", 38, "ui", "kycFail", "push", [], {"reg": (38, "ثبت‌نام"), "test": (38, "آزمون"), "kyc": (38, "احراز"), "fail": (38, "رد"), "lost": (39, "پول")}, {"sec": 2}),
 ("P18", 40, "map", "residence", "pan", [], {"truth": (40, "حقیقت"), "criterion": (41, "ملاک"), "nation": (41, "نه"), "res": (42, "اقامه"), "sa": (42, "عربستان"), "ae": (42, "امارات"), "tr": (42, "ترکیه"), "eu": (42, "اروپا"), "pass": (42, "پاسپورت"), "wd": (42, "برداشت")}, {"sec": 2}),
 ("P19", 43, "info", "ownRules", "push", [], {"truth": (43, "حقیقت"), "both": (45, "بعضی‌ها"), "before": (46, "قبل")}, {"sec": 2}),
 ("P20", 47, "ui", "ownRules", "pan", [], {"faq": (47, "سؤال‌های"), "banned": (47, "ممنوع"), "res": (48, "محل"), "pass": (48, "پاسپورتت"), "support": (49, "پشتیبانی‌شان"), "save": (49, "ذخیره")}, {"sec": 2, "pre": True}),
 ("P21", 50, "scene", "fakeWarn", "push", [], {"warn": (50, "هشدار"), "addr": (51, "آدرس"), "friend": (51, "رفیق"), "no": (52, "این"), "never": (52, "هرگز")}, {"sec": 2}),
 ("P22", 53, "ui", "mismatch", "pan", [], {"doc": (53, "مدرک"), "selfie": (53, "عکس"), "addr": (53, "مدرک", 2), "mismatch": (54, "اطلاعات"), "denied": (54, "رد"), "closed": (54, "بسته"), "months": (55, "ماه‌ها")}, {"sec": 2}),
 ("P23", 56, "object", "otherName", "push", [], {"other": (56, "حساب"), "right": (57, "راه")}, {"sec": 2}),
 ("P24", 58, "paper", "skillAsset", "pan", [], {"despair": (58, "ناامید"), "demo": (60, "حساب"), "back": (60, "روشت"), "journal": (60, "ژورنال"), "chance": (61, "پراپ‌فرم"), "skill": (62, "مهارت")}, {"sec": 2}),
 ("P25", 63, "title", "chapter", "push", [], {}, {"n": 3, "sec": 3}),
 ("P26", 65, "scene", "manyFirms", "pan", [], {"hundreds": (65, "صدها"), "open": (65, "تازه"), "close": (65, "بسته"), "five": (66, "پنج"), "cap": (66, "خودت")}, {"sec": 3}),
 ("P27", 67, "ui", "crit", "push", [], {"years": (68, "چند"), "real": (68, "برداشت‌های"), "reviews": (69, "نظرهای"), "danger": (70, "شرکت"), "tick": (70, "خطرناک")}, {"sec": 3, "n": 1, "mode": "track"}),
 ("P28", 71, "object", "crit", "pan", [], {"res": (73, "محل"), "pass": (73, "پاسپورت"), "before": (73, "همان"), "tick": (73, "پاسپورت")}, {"sec": 3, "n": 2, "mode": "country"}),
 ("P29", 74, "info", "crit", "push", [], {"usdt": (76, "تتر"), "tron": (76, "ترون"), "eth": (76, "اتریوم"), "rise": (77, "رایز"), "bank": (78, "حواله"), "check": (78, "پس"), "tick": (78, "ممکن")}, {"sec": 3, "n": 3, "mode": "usdt"}),
 ("P30", 79, "stat", "crit", "pan", [], {"daily": (80, "حد"), "max": (80, "حد", 2), "target": (80, "هدف"), "extra": (80, "قانون‌های"), "simple": (81, "قانون‌های"), "tick": (81, "بیشتر")}, {"sec": 3, "n": 4, "mode": "rules"}),
 ("P31", 82, "ui", "crit", "push", [], {"gold": (84, "طلا"), "dow": (84, "داو"), "mt5": (84, "متاتریدر"), "tick": (84, "کار")}, {"sec": 3, "n": 5, "mode": "platform"}),
 ("P32", 85, "teardown", "firmExample", "pan", [], {"kyc": (86, "احراز"), "usdt": (87, "برداشت"), "rise": (87, "رایز"), "banned": (88, "افغانستان"), "cap": (88, "ممنوع")}, {"sec": 3}),
 ("P33", 89, "typo", "sameRule", "push", [], {"yes": (89, "افغان"), "no": (90, "مقیم"), "change": (91, "قانون‌ها")}, {"sec": 3}),
 ("P34", 92, "title", "chapter", "push", [], {}, {"n": 4, "sec": 4}),
 ("P35", 94, "info", "rulesIntro", "pan", [], {"phases": (94, "بیشتر"), "three": (94, "سه"), "cap": (94, "اصلی")}, {"sec": 4}),
 ("P36", 95, "stat", "equity", "push", [], {"line": (96, "هدف"), "up": (97, "مثلا"), "hit": (97, "مرحله"), "p2": (97, "پنج"), "n1": (98, "هشت"), "n2": (98, "پنج")}, {"sec": 4, "mode": "target", "head": [1, "قانون ۱: هدف سود"], "notes": [["n1", "مرحله ۱: ۸٪ = ۸,۰۰۰ دلار", "green"], ["n2", "مرحله ۲: ۵٪ = ۵,۰۰۰ دلار", "green"]]}),
 ("P37", 99, "chart", "equity", "pan", [], {"line": (100, "مثلا"), "day": (101, "یعنی"), "fail": (101, "رد"), "n1": (101, "پنج"), "n2": (102, "حتی")}, {"sec": 4, "mode": "daily", "head": [2, "قانون ۲: حد ضرر روزانه"], "notes": [["n1", "۵٪ = ۵,۰۰۰ دلار در یک روز", "red"], ["n2", "حتی اگر دیروز سود کرده باشی", "red"]]}),
 ("P38", 103, "stat", "equity", "push", [], {"line": (104, "مثلا"), "slide": (105, "یعنی"), "over": (105, "تمام"), "n1": (104, "ده")}, {"sec": 4, "mode": "max", "head": [3, "قانون ۳: حد ضرر کل"], "notes": [["n1", "۱۰٪: حساب به ۹۰,۰۰۰ دلار برسد = تمام", "red"]]}),
 ("P39", 106, "chart", "equity", "pan", [], {"open": (107, "حد"), "line": (107, "موجودی"), "closed": (107, "معامله‌های"), "fail": (108, "رد"), "n1": (107, "موجودی"), "n2": (107, "باز"), "n3": (109, "بخوان")}, {"sec": 4, "mode": "floating", "head": [0, "یک نکته مهم"], "notes": [["n1", "حد روزانه از موجودی اول روز", ""], ["n2", "معامله‌های باز هم حساب می‌شوند", "red"], ["n3", "در قانون‌های همان شرکت بخوان", ""]]}),
 ("P40", 110, "ui", "extraRules", "push", [], {"days": (111, "حداقل"), "news": (111, "خبر"), "weekend": (111, "آخر"), "unread": (112, "قانون")}, {"sec": 4}),
 ("P41", 113, "title", "chapter", "push", [], {}, {"n": 5, "sec": 5}),
 ("P42", 115, "ui", "kycPhone", "pan", [], {"doc": (117, "پاسپورت"), "clear": (118, "عکس"), "corners": (118, "همه"), "tick": (118, "پیدا")}, {"sec": 5, "n": 1, "mode": "doc", "notes": [["doc", "پاسپورت · کارت شناسایی · کارت اقامه", ""], ["clear", "عکس واضح، بدون نور و سایه", ""], ["corners", "همه گوشه‌ها پیدا", ""]]}),
 ("P43", 119, "object", "kycPhone", "push", [], {"live": (120, "زنده"), "light": (121, "روشن"), "glasses": (121, "عینک"), "tick": (121, "کلاه")}, {"sec": 5, "n": 2, "mode": "selfie", "notes": [["live", "عکس یا ویدیوی زنده از صورت", ""], ["light", "در جای روشن", ""], ["glasses", "بدون عینک و کلاه", ""]]}),
 ("P44", 122, "info", "kycPhone", "pan", [], {"addr": (123, "مدرک"), "name": (123, "خودت"), "tick": (123, "خودت")}, {"sec": 5, "n": 3, "mode": "address", "notes": [["addr", "قبض برق یا صورت‌حساب بانکی", ""], ["name", "به نام خودت", "green"]]}),
 ("P45", 124, "typo", "attempts", "push", [], {"limit": (124, "تعداد"), "three": (124, "سه"), "right": (125, "پس"), "name": (125, "اسمت"), "cap": (125, "نوشته")}, {"sec": 5}),
 ("P46", 126, "ui", "withdraw", "pan", [], {"req": (127, "درخواست"), "usdt": (128, "تتر"), "tick": (128, "کن")}, {"sec": 5, "n": 4, "mode": "request", "notes": [["req", "درخواست برداشت", ""], ["usdt", "روش: تتر", "green"]]}),
 ("P47", 129, "scene", "withdraw", "push", [], {"addr": (130, "آدرس"), "two": (131, "دو"), "w1": (133, "فقط"), "own": (133, "خودت"), "w1x": (133, "نه")}, {"sec": 5, "n": 5, "mode": "wallet", "notes": [["two", "دو هشدار", "red"], ["w1", "۱. فقط کیف‌پول خودت", "green"], ["w1x", "نه کیف‌پول کس دیگر", "red"]]}),
 ("P48", 134, "ui", "withdraw", "pan", [], {"net": (135, "شبکه"), "tron": (136, "ترون"), "wrong": (137, "اشتباه"), "double": (138, "دو"), "tick": (138, "چک"), "cap": (138, "چک")}, {"sec": 5, "n": 5, "mode": "network", "cap": "برداشت: کیف‌پول خودت · شبکه درست (TRC20) · دو بار چک", "notes": [["net", "۲. شبکه درست", "green"], ["tron", "آدرس ترون ← شبکه ترون", "green"], ["wrong", "شبکه اشتباه = گم شدن پول", "red"], ["double", "اولین بار: دو بار چک کن", ""]]}),
 ("P49", 139, "object", "cashOut", "push", [], {"usdt": (139, "تتر"), "wallet": (139, "کیف‌پولت"), "exch": (139, "صرافی‌های"), "cash": (139, "نقد")}, {"sec": 5}),
 ("P50", 140, "title", "chapter", "push", [], {}, {"n": 6, "sec": 6, "chips": ["شرکت جعلی", "فروش پاس", "ربات معجزه", "خرید پشت‌سرهم"]}),
 ("P51", 142, "ui", "trap", "pan", [], {"discount": (143, "تخفیف"), "promise": (143, "وعده‌های"), "pass": (144, "آزمون"), "denied": (144, "رد"), "check": (145, "قبل"), "tick": (145, "کن")}, {"sec": 6, "n": 1}),
 ("P52", 146, "scene", "trap", "push", [], {"say": (147, "کسانی"), "money": (148, "پول"), "rule": (149, "خلاف"), "found": (150, "کشف"), "void": (150, "باطل"), "scam": (151, "کلاهبردارند"), "tick": (151, "کلاهبردارند")}, {"sec": 6, "n": 2}),
 ("P53", 152, "object", "trap", "pan", [], {"bot": (153, "ربات‌ها"), "two": (153, "دو"), "banned": (154, "ممنوع"), "risk": (154, "ریسک"), "tick": (154, "کار")}, {"sec": 6, "n": 3}),
 ("P54", 155, "info", "trap", "push", [], {"buy": (157, "رد"), "angry": (157, "عصبانیت"), "income": (158, "درآمد"), "journal": (159, "ژورنالت"), "calm": (160, "آرام"), "tick": (160, "دوباره")}, {"sec": 6, "n": 4}),
 ("P55", 161, "typo", "always", "push", [], {"loan": (162, "هرگز"), "pass": (162, "هرگز", 2)}, {"sec": 6}),
 ("P56", 163, "title", "chapter", "push", [], {}, {"n": 7, "sec": 7}),
 ("P57", 165, "stat", "strat", "pan", [], {"half": (166, "نیم"), "twenty": (168, "بیست"), "three": (169, "سه"), "tick": (169, "کافی")}, {"sec": 7, "n": 1, "mode": "risk"}),
 ("P58", 170, "ui", "strat", "push", [], {"firm": (172, "شرکت"), "own": (172, "خودت"), "two": (173, "دو"), "off": (173, "خاموش"), "tick": (173, "کن")}, {"sec": 7, "n": 2, "mode": "daily"}),
 ("P59", 174, "object", "strat", "pan", [], {"forget": (175, "زمان"), "limit": (176, "محدودیت"), "rush": (177, "عجله"), "tick": (177, "قبولی")}, {"sec": 7, "n": 3, "mode": "time"}),
 ("P60", 178, "paper", "strat", "push", [], {"past": (180, "گذشته"), "demo": (180, "آزمایشی"), "notnew": (181, "آزمون"), "tick": (181, "نیست")}, {"sec": 7, "n": 4, "mode": "tested"}),
 ("P61", 182, "info", "strat", "pan", [], {"small": (184, "اولین"), "cheaper": (185, "هزینه‌اش"), "bigger": (186, "وقتی"), "tick": (186, "بزرگ‌تر"), "cap": (186, "بزرگ‌تر")}, {"sec": 7, "n": 5, "mode": "small", "cap": "استراتژی: ریسک ۰٫۵٪ · حد روزانه ۱٫۵٪ · بدون عجله · روش تست‌شده · کوچک شروع کن"}),
 ("P62", 187, "recap", "courses", "push", [], {"l2": (187, "سطح"), "l3": (187, "سطح", 2), "links": (187, "لینک")}, {"sec": 7}),
 ("P63", 188, "info", "summary", "pan", [], {"s1": (189, "پراپ‌فرم"), "s2": (190, "اگر"), "s3": (192, "همیشه")}, {"rows": [0, 1, 2]}),
 ("P63b", 193, "stat", "summary", "push", [], {"s4": (193, "با"), "f1": (194, "سابقه"), "f2": (194, "کشور"), "f3": (194, "برداشت"), "f4": (194, "قانون‌های"), "f5": (194, "بازار")}, {"rows": [3], "five": ["سابقه", "کشور", "برداشت با تتر", "قانون‌های ساده", "بازار مناسب"]}),
 ("P64", 195, "object", "summary", "push", [], {"s5": (195, "احراز"), "s6": (196, "از")}, {"rows": [4, 5]}),
 ("P65", 197, "typo", "summary", "pan", [], {"s7": (197, "و"), "f1": (197, "ریسک"), "f2": (197, "حد"), "f3": (197, "بدون"), "f4": (197, "فقط"), "f5": (197, "شروع"), "none": (198, "سود"), "edu": (199, "این")}, {"rows": [6], "five": ["ریسک ۰٫۵٪", "حد روزانه کوچک", "بدون عجله", "فقط روش تست‌شده", "شروع کوچک"]}),
 ("P66", 200, "cta", "ctaEnd", "push", [], {"like": (200, "لایک"), "happy": (200, "خوشحالمان"), "sub": (201, "دنبال"), "bell": (201, "زنگوله"), "ig": (202, "اینستاگرامم"), "follow": (202, "فالو")}, {}),
 ("P67", 203, "ui", "ctaComment", "pan", [], {"country": (203, "کشور"), "which": (203, "پراپ‌فرم"), "share": (204, "بفرست"), "save": (204, "نجات")}, {}),
 ("P68", (205, "من"), "brand", "outroPF", "push", [], {}, {}),
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
BAD = {"fail", "denied", "closed", "no", "never", "wrong", "over", "banned", "lost", "void", "scam", "risk", "mismatch", "danger", "rush", "angry", "buy", "income", "notnew", "unread", "w1x", "two", "nation", "notall", "most", "none"}
sfx = riser_into(0.9, "impact_01_boom", -11)
for k, sh in enumerate(shots):
    if sh["type"] == "title": sfx += riser_into(sh["from"] + 0.05, "impact_01_boom", -12)
    elif k: sfx.append(whoosh(sh["id"]) if sh["type"] != "chart" else slide(sh["from"] + 0.2, -13))
    for j, (key, v) in enumerate(sorted(sh["ev"].items(), key=lambda kv: kv[1])):
        t = sh["from"] + v
        if key == "tick": sfx.append(correct(t + 0.3))
        elif key == "cap": sfx.append(slide(t, -15))
        elif key in BAD: sfx.append(pop_(t, -13))
        else: sfx.append(tick(t) if j % 2 == 0 else tap(t, -15))
sfx += riser_into(VOICE_CUT + 0.5, "impact_03_reverb_cut4s", -9)                 # the logo hit after «مالی»
sfx.sort(key=lambda s: s["t"])
imp = [s["t"] for s in sfx if "impact" in s["file"]]; assert all(b - a >= 15 for a, b in zip(imp, imp[1:])), imp
CH = [sh["from"] for sh in shots if sh["type"] == "title"]
music = {"bpm": 80, "sections": [[0.0, 1], [F("P02"), 2], [F("P06"), 1]] + [x for c in CH for x in ([c, 1], [c + 4.0, 3 if CH.index(c) % 2 else 2])] + [[F("P63"), 1], [F("P66"), 2], [F("P68"), 1]],
         "accents": [0.9] + CH + [F("P68")]}
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
