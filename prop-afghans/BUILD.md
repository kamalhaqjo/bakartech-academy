# ساخت ویدیوی ویژه: پراپ فرم برای افغان‌ها (دستور کمال، ۲۳ نوامبر)

بدون سؤال، کامل بساز (کمال متن را تأیید کرده):
1. این پوشه را کپی کن به `C:\Users\USER\Videos\bakartech-lessons\special\prop-afghans\`.
2. صدا: `python autopilot\scripts\tts_elevenlabs.py special\prop-afghans` (چک اعتبار ElevenLabs همان قانون بخش ۶؛ اگر کم بود STOP_CREDITS و خبر بده). حدود ۱۰ هزار حرف لازم است.
3. ویدیو 1920×1080 با همان پروژه Remotion و همان سبک انیمیشنی درس‌های سطح ۲ و ۳ (AUTOPILOT بخش ۸ و ۹): موشن، موسیقی پس‌زمینه، SFX پک Davino، واترمارک @kamalhaqjo، کارت عنوان برای هر ۷ بخش، نوشته‌های روی تصویر از `VIDEO_TEXT.md`، پایان ثابت + پنل معرفی. فقط یک بار رندر (اول contact sheet).
4. نام خروجی: `prop_afghans_youtube.mp4` (yuv420p، BT.709). کاور `thumbnail.jpg` 1280×720 طبق VIDEO_TEXT. زیرنویس `subtitles.srt`.
5. زمان فصل‌ها در `youtube.json → description` را با زمان واقعی Whisper جایگزین کن.
6. ۶ Shorts طبق فهرست VIDEO_TEXT (هر کدام ۴۵ تا ۶۰ ثانیه، قالب reel-template): `short1.mp4` تا `short6.mp4`.
7. آپلود: ویدیوی اصلی private با publishAt = اولین روز خالی کانال، ساعت 16:30 UTC (اگر روزهای سطح ۳ پُر است، همان روز ساعت 11:30 UTC به‌عنوان ویدیوی ویژه). Shorts هر روز یکی، 08:30 UTC، از روز بعد. `uploaded.json` بنویس.
8. گزارش کوتاه فارسی به کمال: لینک ویدیو، تاریخ انتشار، اعتبار ElevenLabs باقی‌مانده.
