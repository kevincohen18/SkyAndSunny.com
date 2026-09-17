#!/bin/sh
set -eu

page="index.html"
css="styles.css"
script="script.js"
assets="assets"
sandbox_page="sandbox/night-aviary/index.html"

require() {
  pattern="$1"
  file="$2"
  message="$3"
  if ! grep -Eq -- "$pattern" "$file"; then
    echo "Missing V2 requirement: $message" >&2
    exit 1
  fi
}

forbid() {
  pattern="$1"
  file="$2"
  message="$3"
  if grep -Eq -- "$pattern" "$file"; then
    echo "Rejected V1 structure remains: $message" >&2
    exit 1
  fi
}

test -f "$page"
test -f "$css"
test -f "$script"
test -f "$sandbox_page"

require 'href="/styles\.css"' "$page" 'root-relative production stylesheet'
require 'src="/script\.js"' "$page" 'root-relative production script'
require 'href="/styles\.css"' "$sandbox_page" 'sandbox use of production stylesheet'
require 'src="/script\.js"' "$sandbox_page" 'sandbox use of production script'

if ! cmp -s "$page" "$sandbox_page"; then
  echo "Sandbox HTML has drifted from the production root" >&2
  exit 1
fi

for legacy_copy in \
  sandbox/night-aviary/styles.css \
  sandbox/night-aviary/script.js \
  sandbox/night-aviary/assets
do
  if [ -e "$legacy_copy" ]; then
    echo "Duplicated sandbox production asset remains: $legacy_copy" >&2
    exit 1
  fi
done

for asset in \
  sunny-portrait.webp \
  sky-portrait.webp \
  sunny-cutout.webp \
  sky-cutout.webp \
  moment-watermelon.webp \
  moment-strawberries.webp \
  moment-obsessions.webp
do
  test -f "$assets/$asset"
  file "$assets/$asset" | grep -q 'Web/P image'
done

for referenced_asset in \
  sunny-cutout.webp \
  sky-cutout.webp \
  moment-watermelon.webp \
  moment-strawberries.webp \
  moment-obsessions.webp
do
  require "src=\"/assets/$referenced_asset\"" "$page" "root-relative $referenced_asset reference"
done

for cutout in sunny-cutout.webp sky-cutout.webp
do
  cutout_path="$assets/$cutout"
  cutout_bytes=$(wc -c < "$cutout_path" | tr -d ' ')
  if [ "$cutout_bytes" -gt 400000 ]; then
    echo "Hero cutout exceeds 400KB performance budget: $cutout ($cutout_bytes bytes)" >&2
    exit 1
  fi
  if command -v webpinfo >/dev/null 2>&1 && ! webpinfo "$cutout_path" 2>/dev/null | grep -q 'Chunk ALPH'; then
    echo "Hero cutout lost transparency: $cutout" >&2
    exit 1
  fi
done

require '7214467392791907590' "$page" 'watermelon TikTok mapping'
require '7214307952763620613' "$page" 'strawberries TikTok mapping'
require '7213469583162854662' "$page" 'obsessions TikTok mapping'
require 'id="menu-toggle"' "$page" 'accessible menu control'
require 'id="site-menu"' "$page" 'accessible menu target'
require 'id="current-year"' "$page" 'current-year target'
require 'prefers-reduced-motion: reduce' "$css" 'reduced-motion rendering'
require ':root' "$css" 'semantic token layer'

# V2's habitat is structural and must remain obvious without animation.
require 'class="moon-disc"' "$page" 'firm-edged matte moon'
require 'class="aviary-ribs"' "$page" 'curved aviary enclosure'
require 'class="[^\"]*canopy-back' "$page" 'distant canopy plane'
require 'class="[^\"]*canopy-middle' "$page" 'middle canopy plane'
require 'class="[^\"]*canopy-foreground' "$page" 'foreground canopy plane'
require 'class="habitat-branch"' "$page" 'continuous branch path'
require 'sunny-cutout\.webp' "$page" 'transparent Sunny cutout'
require 'sky-cutout\.webp' "$page" 'transparent Sky cutout'
require 'class="resident-cutout"' "$page" 'direct transparent resident rendering'
require 'symbol id="leaf-spray-a"' "$page" 'first compound botanical motif'
require 'symbol id="leaf-spray-b"' "$page" 'second compound botanical motif'
require 'symbol id="leaf-spray-c"' "$page" 'third compound botanical motif'
require 'habitat-branch-compact' "$page" 'visible compact connecting branch'
require 'perch-junction junction-wide' "$page" 'desktop Sky perch junction'
require 'perch-junction junction-mid' "$page" 'intermediate Sky perch junction'
require 'perch-junction junction-band' "$page" 'responsive-gap Sky perch junction'
require 'class="[^\"]*moment-twig' "$page" 'moment-level twig hook'
require 'data-depth="-' "$page" 'opposing depth plane'
require 'data-depth="[1-6]' "$page" 'foreground depth plane'
require 'data-moment' "$page" 'branch-connected moment encounters'
require 'data-entrance' "$page" 'single canopy entrance hook'
require 'requestAnimationFrame' "$script" 'frame-throttled depth motion'
require 'IntersectionObserver' "$script" 'offscreen motion pause'
require 'pointerleave' "$script" 'pointer-exit motion reset'
require 'data-face="sunny"' "$page" 'Sunny face safe-zone hook'
require 'data-face="sky"' "$page" 'Sky face safe-zone hook'
require 'html:not\(\.js\) \.site-header' "$css" 'JS-off mobile header flow'
require 'caption-clear' "$page" 'caption clear-zone hook'

star_count=$(grep -o 'class="star"' "$page" | wc -l | tr -d ' ')
if [ "$star_count" -ne 12 ]; then
  echo "Expected exactly 12 restrained stars, found $star_count" >&2
  exit 1
fi

forbid 'Meet the birds|Two portraits, two unmistakable palettes\.' "$page" 'duplicated Meet section'
forbid 'hero-kicker|meet-section|bird-introduction|flock-bird|hero-perch|perch-divider|moments-layout' "$page" 'brochure/grid class'
forbid 'data-bird' "$page" 'gull-like motion marks'
forbid '--mask-(sunny|sky): polygon' "$css" 'jagged polygon portrait mask'
forbid 'sunny-mask|sky-mask|sunny-clip|sky-clip|portrait-mask' "$page" 'obsolete hero photo mask'
forbid 'Fraunces|Source Sans 3' "$css" 'unavailable remote-font claims'

# Each real moment remains paired with its exact source image and destination.
for mapping in \
  'moment-watermelon.webp|7214467392791907590' \
  'moment-strawberries.webp|7214307952763620613' \
  'moment-obsessions.webp|7213469583162854662'
do
  asset=${mapping%%|*}
  video=${mapping##*|}
  if ! awk -v asset="$asset" -v video="$video" '
    /<article class="moment/ { block = ""; in_moment = 1 }
    in_moment { block = block $0 "\n" }
    in_moment && /<\/article>/ {
      if (index(block, asset) && index(block, video)) found = 1
      in_moment = 0
    }
    END { exit(found ? 0 : 1) }
  ' "$page"; then
    echo "Broken real-media mapping: $asset must link to $video" >&2
    exit 1
  fi
done

if grep -Eqi '11\.9K|882\.9K|13M\+|Greatest Hits|Morning Chaos|Snack Attack|Favorite snack|Signature move|Photo Placeholder|Video Card' "$page"; then
  echo "Forbidden placeholder or stale content found" >&2
  exit 1
fi

if grep -Eqi 'tailwindcss|cdn\.tailwind' "$page"; then
  echo "Production must not depend on Tailwind CDN" >&2
  exit 1
fi

printf 'Night Aviary production structural checks passed\n'
