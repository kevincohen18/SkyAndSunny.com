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
  moment-obsessions.webp \
  moment-watermelon-cutout.webp \
  moment-strawberries-cutout.webp \
  moment-obsessions-cutout.webp
do
  test -f "$assets/$asset"
  file "$assets/$asset" | grep -q 'Web/P image'
done

for referenced_asset in \
  sunny-cutout.webp \
  sky-cutout.webp \
  moment-watermelon.webp \
  moment-strawberries.webp \
  moment-obsessions.webp \
  moment-watermelon-cutout.webp \
  moment-strawberries-cutout.webp \
  moment-obsessions-cutout.webp
do
  require "src=\"/assets/$referenced_asset\"" "$page" "root-relative $referenced_asset reference"
done

moment_cutout_total=0
for cutout in \
  moment-watermelon-cutout.webp \
  moment-strawberries-cutout.webp \
  moment-obsessions-cutout.webp
do
  cutout_path="$assets/$cutout"
  cutout_bytes=$(wc -c < "$cutout_path" | tr -d ' ')
  if [ "$cutout_bytes" -gt 350000 ]; then
    echo "Moment cutout exceeds 350KB performance budget: $cutout ($cutout_bytes bytes)" >&2
    exit 1
  fi
  moment_cutout_total=$((moment_cutout_total + cutout_bytes))
  if command -v webpinfo >/dev/null 2>&1 && ! webpinfo "$cutout_path" 2>/dev/null | grep -q 'Chunk ALPH'; then
    echo "Moment cutout lost transparency: $cutout" >&2
    exit 1
  fi
done

if [ "$moment_cutout_total" -gt 1000000 ]; then
  echo "Moment cutouts exceed 1MB combined performance budget: $moment_cutout_total bytes" >&2
  exit 1
fi

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

# The hero residents are source-specific art, not interchangeable silhouettes.
# These fingerprints cover the approved alpha-cleaned WebP derivatives and their
# intrinsic canvases so stale lighting or a padded export fails loudly.
expected_sunny_sha="427792f781cd5c0b7adee577f852862ad52006b1875ce431c8524be05f807530"
expected_sky_sha="f84df2eed5653dbd4aad4f42ed470b0851170810a87efb2e67e7ef6a508e44e9"
actual_sunny_sha=$(shasum -a 256 "$assets/sunny-cutout.webp" | awk '{print $1}')
actual_sky_sha=$(shasum -a 256 "$assets/sky-cutout.webp" | awk '{print $1}')
if [ "$actual_sunny_sha" != "$expected_sunny_sha" ] || [ "$actual_sky_sha" != "$expected_sky_sha" ]; then
  echo "Hero resident asset identity does not match the approved new-lighting derivatives" >&2
  exit 1
fi

if command -v webpinfo >/dev/null 2>&1; then
  webpinfo "$assets/sunny-cutout.webp" 2>/dev/null | grep -q 'Canvas size 1366 x 1152' || {
    echo "Sunny hero cutout must retain the registered 1366x1152 support canvas" >&2
    exit 1
  }
  webpinfo "$assets/sky-cutout.webp" 2>/dev/null | grep -q 'Canvas size 1024 x 1536' || {
    echo "Sky hero cutout must retain its 1024x1536 source canvas" >&2
    exit 1
  }
fi

require '7214467392791907590' "$page" 'watermelon TikTok mapping'
require '7214307952763620613' "$page" 'strawberries TikTok mapping'
require '7213469583162854662' "$page" 'obsessions TikTok mapping'
require 'id="menu-toggle"' "$page" 'accessible menu control'
require 'id="site-menu"' "$page" 'accessible menu target'
require 'id="current-year"' "$page" 'current-year target'
require 'prefers-reduced-motion: reduce' "$css" 'reduced-motion rendering'
require ':root' "$css" 'semantic token layer'

# V2's habitat is structural and must remain obvious without animation.
require 'class="moon-halo"' "$page" 'moon halo outside the crescent mask'
require 'class="moon-disc"' "$page" 'firm-edged crescent moon'
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
require 'data-support-svg="sunny"' "$page" 'Sunny intrinsic support coordinate frame'
require 'data-support-svg="sky"' "$page" 'Sky intrinsic support coordinate frame'
require 'data-support-svg="watermelon"' "$page" 'watermelon intrinsic support coordinate frame'
require 'data-support-svg="strawberries"' "$page" 'strawberries intrinsic support coordinate frame'
require 'data-support-contour="obsessions"' "$page" 'Obsessions continuous habitat support contour'
require 'data-continuous-main="true"' "$page" 'continuous Obsessions branch hook'
require 'data-support-owner="\.branch-main\.segment-three"' "$page" 'Obsessions solid branch owner hook'
require 'class="[^\"]*moment-twig' "$page" 'moment-level twig hook'
require 'class="moment-context" aria-hidden="true"' "$page" 'authentic tablet-context crop'
require 'class="moment-bird"' "$page" 'transparent moment cutout layer'
require 'class="moment-support moment-twig moment-perch"' "$page" 'intrinsic moment branch contact beneath bird'
require 'loading="lazy" decoding="async"' "$page" 'lazy below-fold moment imagery'
require '\.moment-image-link:focus-visible' "$css" 'visible focus on outer moment composition'
require 'brightness\(0\.94\) saturate\(0\.9\) contrast\(1\.02\)' "$css" 'restrained cutout lighting integration'
require '--shadow-subject-ambient:' "$css" 'tokenized resident ambient separation shadow'
require '--color-subject-contact-shadow:' "$css" 'tokenized resident foot contact shadow'
require '--color-bark-highlight:' "$css" 'tokenized branch highlight'
require '--color-bark-mid:' "$css" 'tokenized branch midtone'
require '--color-hero-haze-moon:' "$css" 'tokenized lunar haze'
require '--color-hero-haze-canopy:' "$css" 'tokenized canopy haze'
require '--shadow-moon-halo:' "$css" 'tokenized exterior moon halo'
require '--shadow-support-depth:' "$css" 'tokenized support depth shadow'
require '--blur-foreground:' "$css" 'tokenized foreground depth blur'
require '--hero-wide-inset:' "$css" 'tokenized wide composition alignment'
require 'linearGradient id="sunny-bark-gradient"' "$page" 'Sunny dimensional bark gradient'
require 'linearGradient id="sky-bark-gradient"' "$page" 'Sky dimensional bark gradient'
require 'class="support-grain' "$page" 'directional bark grain detail'
require 'class="support-surface-edge' "$page" 'continuous branch surface lighting'
require 'filter id="sunny-bark-relief"' "$page" 'Sunny irregular bark relief filter'
require 'filter id="sky-bark-relief"' "$page" 'Sky irregular bark relief filter'
require 'feTurbulence' "$page" 'procedural irregular bark texture'
require '^\.support-wood[[:space:]]*\{' "$css" 'generic bark fill for nonhero supports'
require 'class="distant-undergrowth' "$page" 'layered distant vegetation'
require 'class="foreground-undergrowth' "$page" 'lower foreground atmosphere'
require '--color-vegetation-distant:' "$css" 'tokenized distant vegetation'
require '--color-vegetation-foreground:' "$css" 'tokenized foreground vegetation'
require '--blur-undergrowth-distant:' "$css" 'tokenized distant vegetation blur'
require '--blur-undergrowth-foreground:' "$css" 'tokenized foreground vegetation blur'
require 'mask: radial-gradient' "$css" 'firm-edged crescent mask'
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
forbid 'clip-path: var\(--opening-' "$css" 'obsolete polygon moment photo crop'

for expected_count in \
  'class="moment-image-link"|3|linked moment compositions' \
  'class="moment-context"|3|tablet context crops' \
  'class="moment-bird"|3|transparent moment birds' \
  'class="moment-support moment-twig moment-perch"|2|intrinsic moment branch contacts' \
  'loading="lazy" decoding="async"|6|lazy composition images' \
  'alt="" loading="lazy" decoding="async"|6|decorative composition image alts'
do
  pattern=${expected_count%%|*}
  remainder=${expected_count#*|}
  count=${remainder%%|*}
  label=${expected_count##*|}
  actual=$(grep -o "$pattern" "$page" | wc -l | tr -d ' ')
  if [ "$actual" -ne "$count" ]; then
    echo "Expected $count $label, found $actual" >&2
    exit 1
  fi
done

for subject in sunny sky watermelon strawberries; do
  require "data-support-contour=\"$subject\"" "$page" "$subject designated support contour"
done

if awk '
  /<article class="moment moment-obsessions"/ { in_obsessions = 1 }
  in_obsessions && /moment-perch/ { found = 1 }
  in_obsessions && /<\/article>/ { in_obsessions = 0 }
  END { exit(found ? 0 : 1) }
' "$page"; then
  echo "Obsessions must sit on the continuous habitat branch, not a local twig" >&2
  exit 1
fi

forbid 'perch-junction|junction-wide|junction-mid|junction-band' "$page" 'height-drifting hero junction workaround'
forbid '\.moment-obsessions \.moment-twig' "$css" 'Obsessions local twig styling'

# Each real moment remains paired with its exact source image and destination.
for mapping in \
  'moment-watermelon.webp|moment-watermelon-cutout.webp|7214467392791907590' \
  'moment-strawberries.webp|moment-strawberries-cutout.webp|7214307952763620613' \
  'moment-obsessions.webp|moment-obsessions-cutout.webp|7213469583162854662'
do
  asset=${mapping%%|*}
  rest=${mapping#*|}
  cutout=${rest%%|*}
  video=${mapping##*|}
  if ! awk -v asset="$asset" -v cutout="$cutout" -v video="$video" '
    /<article class="moment/ { block = ""; in_moment = 1 }
    in_moment { block = block $0 "\n" }
    in_moment && /<\/article>/ {
      if (index(block, asset) && index(block, cutout) && index(block, video)) found = 1
      in_moment = 0
    }
    END { exit(found ? 0 : 1) }
  ' "$page"; then
    echo "Broken real-media mapping: $asset + $cutout must link to $video" >&2
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
