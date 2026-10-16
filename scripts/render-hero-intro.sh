#!/usr/bin/env bash
# Renders the HyperFrames hero loop and encodes the web versions in public/media/.
# Needs Node >= 22, FFmpeg and Chrome (see `npx hyperframes doctor`).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .cache public/media
export HYPERFRAMES_SKIP_SKILLS=1
(cd hyperframes/hero-intro && npx --yes hyperframes@0.8.164 check && npx --yes hyperframes@0.8.164 render -o ../../.cache/hero-intro-raw.mp4 -f 30 -q high)
ffmpeg -v error -y -i .cache/hero-intro-raw.mp4 -c:v libvpx-vp9 -b:v 0 -crf 44 -row-mt 1 -deadline good -cpu-used 2 -an -pix_fmt yuv420p public/media/hero-intro.webm
ffmpeg -v error -y -i .cache/hero-intro-raw.mp4 -c:v libx264 -crf 30 -preset slow -an -pix_fmt yuv420p -movflags +faststart public/media/hero-intro.mp4
ffmpeg -v error -y -i .cache/hero-intro-raw.mp4 -frames:v 1 -c:v libwebp -quality 70 public/media/hero-intro-poster.webp
ls -la public/media
