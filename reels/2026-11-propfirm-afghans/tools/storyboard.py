#!/usr/bin/env python3
"""Writes DIRECTOR.md for the prop-firm special («پراپ‌فرم برای افغان‌ها») from remotion/src/shots.json and the picture / sound notes
below. The owner sent the script, two voice files (joined in input/voice.mp3), the cover spec, 14 on-screen texts and the six Shorts; every
on-screen text is placed on the sentence that says it, with the cuts and events locked to the Whisper timings. «از آکادمی بکر تیک» is cut
from the end of the voice and the subtitles.
usage: storyboard.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); L = lambda *a: os.path.join(HERE, "..", *a)
d = json.load(open(L("remotion", "src", "shots.json"), encoding="utf-8")); V = json.load(open(L("timing", "variety.json"), encoding="utf-8"))
N = {  # id: picture and motion (the number of the owner's on-screen text in brackets)
 "P01": ('[۱] دسته اسکناس «۵۰ یا ۱۰۰ دلار» → شمارنده\u200cی طلایی تا «۱۰۰,۰۰۰$»؛ «بدون پول خودت در بازار»؛ «خیلی خوب به نظر می\u200cرسد، نه؟»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P02": ('[۲] ده آدم؛ نه تا قرمز با ضربدر، یکی سبز؛ «۹۰٪ رد می\u200cشوند»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P03": ('نقشه\u200cی افغانستان کشیده می\u200cشود؛ «آیا اصلاً برداشت به ما می\u200cرسد؟» و سکه\u200cهایی که به سمت نقشه می\u200cروند', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P04": ('«امروز: همه چیز، از اول تا آخر»؛ «صادقانه، بدون وعده دروغ»؛ شش کاشی موضوع\u200cها روی کلمه\u200cهایشان', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P05": ('«این ویدیو را تا آخر ببین»؛ اسکناس آتش می\u200cگیرد: «یک اشتباه کوچک = سوختن همه پول»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P06": ('عکس کمال در حلقه\u200cی طلایی، «کمال حقجو»، «مربی و تحلیل\u200cگر بازارهای مالی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P07": ('کارت فصل: «بخش ۱ از ۷: پراپ\u200cفرم چیست؟» با هفت قطعه\u200cی پیشرفت', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P08": ('ساختمان «پراپ\u200cفرم» سکه به معامله\u200cگر می\u200cدهد؛ مانع قرمز «اما نه به هر کسی»؛ «اول باید ثابت کنی که بلدی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P09": ('جریان چپ به راست: هزینه آزمون (۵۰ تا ۵۰۰ دلار) → حساب آزمونی (۱۰، ۵۰، ۱۰۰ هزار)', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P10": ('[۳] ادامه\u200cی جریان: هدف سود بدون شکستن قانون → حساب سرمایه\u200cدار → ۸۰ تا ۹۰٪ سود مال تو؛ نوار متن ۳', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P11": ('حساب: ۱۰۰,۰۰۰ × ۵٪ = ۵,۰۰۰ → سهم تو ≈ ۴,۰۰۰ دلار؛ «بدون یک دلار از پول خودت در بازار»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P12": ('«شرکت از کجا پول درمی\u200cآورد؟»: نوار بلند «هزینه آزمون\u200cها»، نوار کوتاه «سهم از سود»؛ بیست آدم، هجده قرمز', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P13": ('دو مسیر: «منظم و صبور» → جام؛ «عجله و هیجان» → «درآمد شرکت»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P14": ('کارت فصل: «بخش ۲ از ۷: افغان\u200cها از کجا برداشت می\u200cگیرند؟»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P15": ('علامت هشدار: «این قسمت را خیلی دقیق گوش کن»؛ «خیلی\u200cها اینجا پول از دست می\u200cدهند»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P16": ('«حقیقت اول»: نقشه\u200cی افغانستان قرمز می\u200cشود؛ پنل «فهرست کشورهای ممنوع» با ردیف افغانستان', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P17": ('ثبت\u200cنام ✓ → حتی آزمون ✓ → احراز هویت و برداشت ✗؛ «پول آزمون هم از دست رفته»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P18": ('[۴] «حقیقت دوم · خبر خوب»: ملاک = محل زندگی، نه ملیت؛ افغانِ مقیم خارج با پاسپورت و اقامه؛ عربستان، امارات، ترکیه، اروپا ✓؛ نوار متن ۴', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P19": ('[۵] «حقیقت سوم»: هر شرکت قانون خودش؛ محل زندگی و ملیت؛ نوار متن ۵', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P20": ('صفحه\u200cی «سؤال\u200cهای متداول › کشورهای ممنوع» با جستجو؛ دو تیک «محل زندگی» و «پاسپورت»؛ «از پشتیبانی بپرس» و «جوابشان را ذخیره کن»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P21": ('[۶] حالت هشدار قرمز: فرم آدرس جعلی «Dubai…» با مهر «جعلی»، حساب به نام رفیق با مهر «رد»؛ «این کار را نکن. هرگز.»؛ نوار متن ۶', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P22": ('مدرک، عکس زنده، مدرک آدرس؛ خط\u200cهای قرمز «اطلاعات با هم نخواند»؛ برداشت رد، حساب بسته، پول آزمون و ماه\u200cها زحمت', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P23": ('«پول تو در دست کس دیگر» در برابر «راه درست: فقط مدارک واقعی خودت»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P24": ('میز سبز: «ناامید نشو»؛ سه برگه: حساب آزمایشی، تست روی گذشته، ژورنال؛ «مهارت = دارایی که هر جا بروی با تو می\u200cآید»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P25": ('کارت فصل: «بخش ۳ از ۷: چطور پراپ\u200cفرم درست انتخاب کنیم؟»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P26": ('[۷] شبکه\u200cی سی شرکت، تازه\u200cها سبز، بسته\u200cها ضربدر؛ پنج کارت معیار؛ نوار متن ۷', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P27": ('معیار ۱: سایت نظرها با ستاره\u200cها، «چند سال سابقه»، «برداشت تأییدشده»؛ «شرکت تازه + تخفیف عجیب = خطر»؛ پنل پنج معیار', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P28": ('معیار ۲: دو کارت «محل زندگی» و «پاسپورت» با تیک', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P29": ('معیار ۳: سکه\u200cی تتر «دلار دیجیتال»؛ ترون (TRC20)، اتریوم (ERC20)، رایز؛ حواله بانکی سخت؛ «قبل از خرید چک کن»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P30": ('معیار ۴: حد ضرر روزانه، حد ضرر کل، هدف سود، قانون\u200cهای اضافه؛ «قانون ساده\u200cتر = شانس قبولی بیشتر»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P31": ('معیار ۵: پنجره\u200cی MetaTrader 5 با XAUUSD (طلا) و US30 (داو جونز)', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P32": ('[۸] «مثال واقعی: FundedNext» (فقط متن): مدرک\u200cها ✓، USDT ✓، Rise ✓، افغانستان ممنوع ✗؛ نوار متن ۸', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P33": ('«همان قاعده»: افغانِ مقیم خارج با اقامه: بله؛ مقیم افغانستان: نه؛ «قانون\u200cها ممکن است عوض شوند»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P34": ('کارت فصل: «بخش ۴ از ۷: قانون\u200cهای آزمون، دقیق»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P35": ('[۹] یک یا دو مرحله؛ سه قانون اصلی؛ نوار متن ۹', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P36": ('نمودار موجودی (مثال فرضی): مرحله ۱ تا ۸٪ و تیک، بعد مرحله ۲ تا ۵٪', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P37": ('نمودار: دیروز +۲٪، امروز افت تا زیر حد روزانه\u200cی ۵٪ و ضربدر؛ «حتی اگر دیروز سود کرده باشی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P38": ('نمودار: سقوط تدریجی تا ۹۰,۰۰۰ دلار و «تمام»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P39": ('«یک نکته مهم»: خط آبی معامله\u200cی باز، موجودی لحظه\u200cای خط\u200cچین از حد روزانه رد می\u200cشود', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P40": ('قانون\u200cهای اضافه: حداقل روزها، دقیقه\u200cهای خبر، آخر هفته؛ «یک قانون نخوانده = از دست دادن همه چیز»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P41": ('کارت فصل: «بخش ۵ از ۷: احراز هویت و گرفتن برداشت»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P42": ('گوشی با کادر مدرک و گوشه\u200cهای سبز؛ پنل پنج قدم', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P43": ('گوشی با کادر صورت، روشن شدن نور؛ «بدون عینک و کلاه»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P44": ('قبض برق «به نام خودت»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P45": ('[۱۰] «تعداد تلاش محدود: ۱ ۲ ۳»؛ نام پاسپورت = نام فرم؛ نوار متن ۱۰', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P46": ('صفحه\u200cی درخواست برداشت؛ USDT انتخاب می\u200cشود', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P47": ('آدرس کیف\u200cپول تایپ می\u200cشود؛ «فقط کیف\u200cپول خودت» / «نه کیف\u200cپول کس دیگر»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P48": ('[۱۱] شبکه: TRC20 درست؛ لحظه\u200cی ERC20 با مهر «شبکه اشتباه = پول گم شد»؛ «دو بار چک کن»؛ نوار متن ۱۱', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P49": ('تتر → کیف\u200cپول تو → صرافی معتبر → پول نقد', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P50": ('[۱۲] کارت فصل: «بخش ۶ از ۷: دام\u200cها و کلاهبرداری\u200cها» با چهار دام', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P51": ('دام ۱: سایت «۹۰٪ تخفیف!»، آزمون قبول، «برداشت رد شد: بهانه»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P52": ('دام ۲: پیام «آزمونت را پاس می\u200cکنیم»؛ خلاف قانون، حساب بسته، برداشت باطل، کلاهبردار', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P53": ('دام ۳: ربات «پاس در ۲ روز!»؛ کپی معامله ممنوع، ریسک خیلی بالا', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P54": ('دام ۴: سبدهای خرید پشت سر هم و چهره\u200cی عصبانی؛ «اول ژورنال»، «با ذهن آرام، دوباره»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P55": ('«هرگز با پول قرضی آزمون نخر» و «هرگز حساب و رمزت را به کسی نده»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P56": ('کارت فصل: «بخش ۷ از ۷: استراتژی من برای قبولی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P57": ('قانون ۱: ۰٫۵٪ = ۵۰۰ دلار؛ بیست بلوک تا حد ضرر کل در برابر سه یا چهار بلوک با ۳٪', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P58": ('قانون ۲: ستون «حد شرکت ۵٪» و «حد خودت ۱٫۵٪»؛ دو ضرر → کامپیوتر خاموش', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P59": ('قانون ۳: ساعت خط\u200cخورده؛ «عجله = دشمن اصلی قبولی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P60": ('قانون ۴: دو برگه «روی گذشته» و «روی حساب آزمایشی» با نتیجه مثبت؛ «آزمون جای روش جدید نیست»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P61": ('[۱۳] قانون ۵: پله\u200cی حساب\u200cها ۱۰ و ۲۵ هزار (اولین آزمون) تا ۱۰۰ هزار؛ نوار متن ۱۳', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P62": ('دو کارت دوره\u200cی «سطح ۲» و «سطح ۳»؛ «لینک پلی\u200cلیست\u200cها در توضیحات»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P63": ('جمع\u200cبندی ۱ تا ۳', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P63b": ('جمع\u200cبندی ۴ و پنج معیار', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P64": ('جمع\u200cبندی ۵ و ۶', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P65": ('[۱۴] جمع\u200cبندی ۷ و پنج قانون؛ مهر قرمز «سود تضمینی وجود ندارد»؛ «آموزشی است، نه توصیه مالی»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P66": ('کانال یوتیوب؛ لایک «خوشحالمان کن»، دنبال کردن، زنگوله؛ اینستاگرام @kamalhaqjo و Follow', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P67": ('کامنت «از کدام کشور هستی؟» و «کدام پراپ\u200cفرم را بررسی کنیم؟»؛ «برای رفیقی بفرست»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
 "P68": ('پایان برند: عکس کمال، Bakartech، «ویدیوی ویژه · پراپ\u200cفرم برای افغان\u200cها»', "auto: whoosh, tick/tap, pop on refusals, correct on ticks"),
}
fmt = lambda t: f"{int(t // 60)}:{t % 60:04.1f}"
md = ["# استوری‌بورد کارگردانی — ویدیوی ویژه: پراپ‌فرم برای افغان‌ها | Bakartech Academy", "",
      "> دستور ساخت برای Claude Code، شات‌به‌شات. صدا: `input/voice.mp3` · متن: `input/narration.txt` · 1920×1080 · 30fps · خروجی: `out/propfirm_afghans_youtube.mp4`",
      "> از روی متن، دو فایل صدا، مشخصات کاور، ۱۴ متن روی صفحه و شش شورتز که مالک فرستاد؛ زمان هر شات و هر رویداد با Whisper به جمله‌ی گوینده قفل است (`tools/director.py`). «از آکادمی بکر تیک» از آخر صدا و زیرنویس حذف شده و جمله روی «مالی» تمام می‌شود (در شروع ویدیو گفته نشده بود).", "",
      "## ۰. قانون‌های کارگردانی", "",
      "1. دو شات چارت (P37 و P39، حدود ۴٪ زمان) و دو نمودار مقایسه‌ی موجودی؛ بقیه موشن‌گرافیک. چارت پلتفرم بی‌نام با نماد XAUUSD (طلا)، قاب M15 سفید، با برچسب «مثال فرضی» و نوشته‌ی «تصویر آموزشی فرضی؛ نمودار زنده یا پیشنهاد معامله نیست»؛ طرح‌های ساده هم برچسب «مثال فرضی» دارند.",
      "2. هفت بخش، هر کدام با کارت فصل «بخش N از ۷»؛ نوار هفت بخش بالای صفحه (روی کارت‌های فصل پنهان)؛ پنل‌های کناری پنج معیار، پنج قدم برداشت، چهار دام و پنج قانون استراتژی. سبز = مجاز، قرمز = رد و خطر، طلایی = شرکت و عددهای کلیدی.",
      "3. در همه‌ی طرح‌ها و چارت‌ها زمان از چپ به راست می‌رود (مثل هر چارت قیمت)، حتی در صفحه‌ی فارسی.",
      "4. دو شات پشت سر هم از یک نوع نباشند (`director.py` چک می‌کند)؛ هر ۴ تا ۷ ثانیه تغییر بصری؛ زمان هر شات و رویداد با Whisper به جمله‌ی گوینده قفل است.",
      "5. Vazirmatn برای فارسی، Inter برای اعداد و نمادها. متن روی صفحه حداکثر ۵ کلمه، داخل کارت شیشه‌ای.",
      "6. صدا: موزیک آرام Bakartech با ducking زیر گوینده؛ افکت‌ها از پک Davino.creator (`reels/brand/sfx`)، حداکثر یک impact در ۱۵ ثانیه، فقط روی برش‌ها یا بعد از کلمه.",
      "7. برند: لوگوی KH بالا سمت چپ با نشان «ویدیوی ویژه» کنارش، «Bakartech» کوچک پایین سمت چپ، پایان با عکس کمال داخل دایره‌ی طلایی و نشان «ویدیوی ویژه»؛ واترمارک «Bakartech · @kamalhaqjo» پایین سمت چپ. «از آکادمی بکر تیک» از صدا و زیرنویس بریده می‌شود.",
      "8. خروجی با رنگ استاندارد (yuv420p، BT.709، محدوده‌ی TV) تا همان فایل در یوتیوب و اینستاگرام آپلود شود (`tools/finish.sh`).",
      "9. کنترل کیفیت: اول contact sheet از همه‌ی شات‌ها (۲۰٪، ۶۲٪ و ۹۳٪ هر شات)، بعد رندر کامل، بعد freezedetect، blackdetect و LUFS.", "",
      "## ۱. شات‌لیست", "", "| # | زمان | جمله گوینده | نوع صحنه | تصویر و حرکت | متن روی صفحه | SFX |", "|---|---|---|---|---|---|---|"]
for i, s in enumerate(d["shots"], 1):
    pic, sfx = N[s["id"]]
    md.append(f"| {i} | {fmt(s['from'])}–{fmt(s['to'])} | {s['spoken']} | {V['types'][s['type']]} | {pic} (دوربین: {s['cam']}) | {' / '.join(s['text']) or '—'} | {sfx} |")
tot = sum(V["seconds"].values())
md += ["", "**آمار تنوع:** " + " · ".join(f"{V['types'][k]} {n}" for k, n in sorted(V["count"].items(), key=lambda x: -x[1])) +
       f" · زمان چارت {V['seconds'].get('chart', 0):.0f} ثانیه از {tot:.0f} ({100 * V['seconds'].get('chart', 0) / tot:.0f}٪). هیچ دو شات پشت سر همی هم‌نوع نیستند.", "",
       "## ۲. کامپوننت‌ها", "",
       "**از درس‌های قبل:** Headline، Chip، ChannelButtons، BrandOutro، `StepProgress` (نوار هفت بخش)، Phone، Bubble، RedAlert، Building، Clock، XMark، Check، Arrow.",
       "**جدید در این ویدیو (`remotion/src/scenes.jsx`، انتهای فایل):** `Gly` (آیکون‌ها: دلار، کارت، دوربین، خانه، کیف‌پول، ربات، آتش، تتر، پاسپورت، …)، `Cap` (نوار متن‌های مالک)، `SideList`، `Panel`، `NumHead`، `AfgShape`، `chapter`، `flow`، `calc`، `equity` (نمودار موجودی حساب)، `crit`، `kycPhone`، `withdraw`، `trap`، `strat`، `summary`، `ctaEnd`، `ctaComment`؛ و `Short.jsx` (شورتز عمودی).", "",
       "## ۳. خروجی‌ها", "", "- `out/propfirm_afghans_youtube.mp4` (1920×1080، برای یوتیوب و اینستاگرام)", "- `out/propfirm_afghans_instagram_part1..8_1920x1080.mp4` (هشت بخش زیر سه دقیقه)",
       "- `out/propfirm_short1..6_1080x1920.mp4` (شش شورتز / ریلز عمودی؛ `remotion/shorts.mjs`)", "- `out/subtitles.srt` و `out/subtitles.vtt`", "- `remotion/out/contact_sheet.png`", "- `remotion/out/timing.json`", ""]
open(L("DIRECTOR.md"), "w", encoding="utf-8").write("\n".join(md))
print("DIRECTOR.md", len(d["shots"]), "shots")
