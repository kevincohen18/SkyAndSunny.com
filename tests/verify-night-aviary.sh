#!/bin/sh
set -eu

page="sandbox/night-aviary/index.html"
css="sandbox/night-aviary/styles.css"
script="sandbox/night-aviary/script.js"

test -f "$page"
test -f "$css"
test -f "$script"

for asset in \
  sunny-portrait.webp \
  sky-portrait.webp \
  moment-watermelon.webp \
  moment-strawberries.webp \
  moment-obsessions.webp
do
  test -f "sandbox/night-aviary/assets/$asset"
  file "sandbox/night-aviary/assets/$asset" | grep -q 'Web/P image'
done

grep -q '7214467392791907590' "$page"
grep -q '7214307952763620613' "$page"
grep -q '7213469583162854662' "$page"
grep -q 'id="menu-toggle"' "$page"
grep -q 'id="site-menu"' "$page"
grep -q 'id="current-year"' "$page"
grep -q 'prefers-reduced-motion: reduce' "$css"
grep -q ':root' "$css"

if grep -Eqi '11\.9K|882\.9K|13M\+|Greatest Hits|Morning Chaos|Snack Attack|Favorite snack|Signature move|Photo Placeholder|Video Card' "$page"; then
  echo "Forbidden placeholder or stale content found" >&2
  exit 1
fi

if grep -Eqi 'tailwindcss|cdn\.tailwind' "$page"; then
  echo "Sandbox must not depend on Tailwind CDN" >&2
  exit 1
fi

printf 'Night Aviary structural checks passed\n'
