#!/bin/sh
# Packs a finished lesson's out/ for the repository: copies the two covers in, makes a light copy of the YouTube file (for quick viewing
# or sending), and, when the YouTube file is over GitHub's 100 MB limit, splits it into 95 MB pieces with a JOIN.txt (sha256 + join commands).
# usage: tools/package_out.sh <project dir> <file prefix, e.g. l3_lesson10> <covers prefix, e.g. 2026-11-level3-lesson-10>
set -e
D=$1 N=$2 CV=$3
cd "$(dirname "$0")/.."
cp covers/$CV-youtube/out/cover_youtube_1920x1080.png $D/out/${N}_cover_youtube_1920x1080.png
cp covers/$CV-reels/out/cover_reels_1080x1920.png $D/out/${N}_cover_reels_1080x1920.png
cd $D/out
M=${N}_youtube.mp4
ffmpeg -hide_banner -loglevel error -y -i $M -c:v libx264 -preset medium -crf 32 -maxrate 700k -bufsize 1400k -profile:v high -r 30 -g 60 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 128k -movflags +faststart ${N}_youtube_light.mp4
SIZE=$(stat -c %s $M)
if [ "$SIZE" -gt 100000000 ]; then
  split -b 95000000 -d -a 2 $M $M.part
  P=$(ls $M.part* | tr '\n' ' '); PW=$(ls $M.part* | sed 's/$/ +/' | tr '\n' ' ' | sed 's/ + $//')
  H=$(sha256sum $M | cut -d' ' -f1); n=$(ls $M.part* | wc -l)
  printf '%s (%s bytes, sha256 %s) in %s pieces, because GitHub refuses files over 100 MB.\n\nWindows (cmd, in this folder):\n  copy /b %s %s\nMac / Linux:\n  cat %s> %s\n' "$M" "$SIZE" "$H" "$n" "$PW" "$M" "$P" "$M" > JOIN.txt
fi
ls -la
