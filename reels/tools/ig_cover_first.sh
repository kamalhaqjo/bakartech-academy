#!/bin/sh
# Instagram copy of a finished lesson: the vertical Reels cover (1080x1920) shown for 0.5 s as the first frames, centred on a blurred
# copy of itself, then the whole YouTube file. Instagram takes a Reel's thumbnail from its first frame (the API path used here has no
# cover upload), and the 9:16 centre of a 16:9 frame is exactly that cover. Instagram's publishing limit is 100 MB per video, so the
# copy is a two-pass encode at a video bitrate that lands near 90 MB (BT.709 TV range, AAC 128k 48 kHz, faststart).
# usage: tools/ig_cover_first.sh <cover png 1080x1920> <youtube mp4> <out mp4>
set -e
C=$1 V=$2 O=$3
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
BR=$(python3 -c "print(int(90e6 * 8 / ($D + 0.5) / 1000) - 128 - 40)")k     # kbit/s for the video: 90 MB total, minus audio and container
FC="[0:v]split[a][b];[a]scale=1920:-2,crop=1920:1080,boxblur=28:4,eq=brightness=-0.22[bg];[b]scale=-2:1080[fg];[bg][fg]overlay=(W-w)/2:0,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setsar=1,fps=30[c];[2:v]setsar=1[v2];[c][1:a][v2][2:a]concat=n=2:v=1:a=1[v][a]"
IN="-loop 1 -framerate 30 -t 0.5 -i $C -f lavfi -t 0.5 -i anullsrc=r=48000:cl=stereo -i $V"
VE="-c:v libx264 -preset slow -b:v $BR -maxrate $(echo $BR | tr -d k | awk '{print int($1*2.5)}')k -bufsize $(echo $BR | tr -d k | awk '{print int($1*4)}')k -profile:v high -level:v 4.1 -r 30 -g 60 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709"
P=$(mktemp -d)/pass
ffmpeg -hide_banner -loglevel error -y $IN -filter_complex "$FC" -map "[v]" -map "[a]" $VE -pass 1 -passlogfile $P -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y $IN -filter_complex "$FC" -map "[v]" -map "[a]" $VE -pass 2 -passlogfile $P -c:a aac -b:a 128k -ar 48000 -movflags +faststart "$O"
echo "$O $BR $(stat -c %s "$O") bytes"
