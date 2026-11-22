#!/bin/sh
# Finishes the render: Remotion writes full-range BT.601 colour (yuvj420p), which Instagram can refuse, so the video is re-encoded once to
# standard TV-range BT.709 yuv420p (H.264 High, AAC 48 kHz, faststart) -> out/l3_lesson09_youtube.mp4, the one file for YouTube and Instagram.
# For accounts whose Reels stop at three minutes it also cuts two parts at the section title «هفت تیک کامل» (shot S13): part 1 the scene and
# the seven steps one by one (2:56), part 2 the decision, the other side of the coin, the mistake, the practice and the summary (2:12), with
# short fades: out/l3_lesson09_instagram_part1..2_1920x1080.mp4.
# usage: tools/finish.sh   (after `node remotion/render.mjs`);  tools/finish.sh --parts   (only the Instagram parts, from an existing YouTube file)
cd "$(dirname "$0")/.." || exit 1
RAW=remotion/out/l3_lesson09_raw.mp4 MAIN=out/l3_lesson09_youtube.mp4
ENC="-c:v libx264 -preset medium -crf 18 -profile:v high -level:v 4.1 -r 30 -g 60 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 192k -ar 48000 -movflags +faststart"
[ "$1" = "--parts" ] || ffmpeg -hide_banner -loglevel error -y -i $RAW -vf "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p" $ENC $MAIN || exit 1
set -- $(python3 -c "import json; d = json.load(open('remotion/src/shots.json')); f = {s['id']: s['from'] for s in d['shots']}; print(0, f['S13'], d['duration'])")
n=0 LAST=2
while [ $# -ge 2 ]; do
  n=$((n + 1)); A=$1 B=$2; shift
  S=$(python3 -c "print(max(0, round($A - 0.15, 3)))") D=$(python3 -c "print(round($B - max(0, $A - 0.15), 3))") O=$(python3 -c "print(round($B - max(0, $A - 0.15) - 0.4, 3))")
  FI=""; [ $n -gt 1 ] && FI="fade=t=in:d=0.3,"; AI=""; [ $n -gt 1 ] && AI="afade=t=in:d=0.3,"
  FO="fade=t=out:st=$O:d=0.4"; AO="afade=t=out:st=$O:d=0.4"; [ $n -eq $LAST ] && FO="null" && AO="anull"
  ffmpeg -hide_banner -loglevel error -y -ss $S -i $MAIN -t $D -vf "$FI$FO" -af "$AI$AO" $ENC "out/l3_lesson09_instagram_part${n}_1920x1080.mp4" || exit 1
done
