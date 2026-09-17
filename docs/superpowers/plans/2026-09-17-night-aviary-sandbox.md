# Night Aviary Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and open a standalone, responsive Night Aviary preview using only verified SkyAndSunny media and exact TikTok post links, without modifying the current homepage.

**Architecture:** Add a static sandbox composed of semantic HTML, token-led CSS, and a small progressive-enhancement script. Generate browser-safe derivatives from the five supplied originals while leaving the originals untouched. A shell verification script checks media formats, content provenance, resilience, and forbidden placeholder material.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, `sips`, `cwebp`, POSIX shell, local HTTP server

**Spec:** `docs/superpowers/specs/2026-09-17-night-aviary-redesign.md`

## Global Constraints

- Do not modify `index.html`; this task produces a review sandbox only.
- Display only the five authentic media sources listed in the spec.
- Use the exact TikTok post IDs `7214467392791907590`, `7214307952763620613`, and `7213469583162854662` for their matching supplied stills.
- Do not publish static follower, like, or view counts.
- Do not include the old placeholder biographies, fun facts, video titles, emoji portraits, gradient thumbnails, or fake play controls.
- Keep all colors, spacing, type, radii, elevation, and motion values in the `:root` semantic token layer.
- Core content and links must remain visible and usable without JavaScript.
- Honor `prefers-reduced-motion: reduce` and keep every interactive target at least 44px in one dimension.
- Do not introduce a package manager, framework, Tailwind runtime, analytics, CMS, or backend.
- Preserve all source files in `/Users/kevincohen/Desktop/SkyAndSunny.com`; create additive derivatives only in the worktree.

---

### Task 1: Authentic-media Night Aviary sandbox

**Files:**
- Create: `sandbox/night-aviary/index.html`
- Create: `sandbox/night-aviary/styles.css`
- Create: `sandbox/night-aviary/script.js`
- Create: `sandbox/night-aviary/assets/sunny-portrait.webp`
- Create: `sandbox/night-aviary/assets/sky-portrait.webp`
- Create: `sandbox/night-aviary/assets/moment-watermelon.webp`
- Create: `sandbox/night-aviary/assets/moment-strawberries.webp`
- Create: `sandbox/night-aviary/assets/moment-obsessions.webp`
- Create: `tests/verify-night-aviary.sh`
- Create: `verification/night-aviary-sandbox-desktop.png`
- Create: `verification/night-aviary-sandbox-tablet.png`
- Create: `verification/night-aviary-sandbox-mobile.png`

**Interfaces:**
- Consumes: the five original files from `/Users/kevincohen/Desktop/SkyAndSunny.com` and the approved design spec.
- Produces: a self-contained page at `sandbox/night-aviary/index.html`; menu button `#menu-toggle`; menu container `#site-menu`; decorative flock elements with `[data-bird]`; current-year target `#current-year`.

- [ ] **Step 1: Write the failing verification script**

Create executable `tests/verify-night-aviary.sh` that:

```sh
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
```

- [ ] **Step 2: Run the verifier and confirm the red state**

Run: `chmod +x tests/verify-night-aviary.sh && tests/verify-night-aviary.sh`

Expected: FAIL because `sandbox/night-aviary/index.html` does not exist.

- [ ] **Step 3: Generate authentic browser-safe derivatives**

Create `sandbox/night-aviary/assets/`. Use `cwebp -q 82 -resize 1400 0` for the JPEG/PNG sources. Convert the HEIF-encoded `sky-pfp.png` to a temporary JPEG with `sips -s format jpeg`, then convert that JPEG with `cwebp -q 84 -resize 1200 0`. Source-to-output mapping must be:

```text
Sunny-pfp.jpeg                  -> sunny-portrait.webp
sky-pfp.png                     -> sky-portrait.webp
her life is forever changed.png -> moment-watermelon.webp
Strawberries.png                -> moment-strawberries.webp
Obsessions.png                  -> moment-obsessions.webp
```

Do not modify or delete any source file. Verify the outputs with `file` and record final byte sizes in the task report.

- [ ] **Step 4: Build the semantic HTML**

Create `sandbox/night-aviary/index.html` with:

- A skip link, sticky navigation, native mobile-menu button, `main`, labelled sections, and footer.
- Hero heading exactly `Two tiny birds. One very big screen presence.`
- Real Sunny and Sky portraits with intrinsic dimensions and observational alt text.
- Hero actions `Watch Sky & Sunny on TikTok` and `Meet the birds`.
- A non-card editorial “Meet Sunny / Meet Sky” section with only names and observable descriptions.
- Three featured moments using the exact source mappings and permalinks above.
- Display titles `Her life is forever changed`, `Strawberries`, and `Obsessions`.
- Link text `Watch this moment on TikTok` for every moment.
- Decorative inline SVG flock silhouettes marked `aria-hidden="true"`, `focusable="false"`, and `[data-bird]`.
- Stylesheet and deferred-script references using relative paths.
- The profile URL `https://www.tiktok.com/@skyandsunny.com` for profile actions.

- [ ] **Step 5: Build the token-led visual system**

Create `sandbox/night-aviary/styles.css`. Put literal design values only in `:root`; component rules consume variables. Implement:

- Deep midnight-teal canvas, moonlit surfaces, cool feather text, turquoise Sky accent, yellow Sunny accent, coral watermelon accent, and bark perch.
- Distinctive asymmetric desktop hero with organic image masks and a continuous perch line.
- Editorial bird introductions and an intentionally non-uniform featured-moments composition matching source aspect ratios.
- Mobile reflow at `48rem` and a compact layout down to `20rem`.
- Skip-link reveal, visible `:focus-visible`, hover/active states, 44px targets, and readable 200% zoom behavior.
- Content visible by default; `.js` may enhance the menu without hiding primary content.
- A complete `@media (prefers-reduced-motion: reduce)` block that removes smooth scrolling, transforms, and transitions.
- Font fallbacks that remain attractive if the optional remote display/body faces fail.

- [ ] **Step 6: Add progressive enhancement**

Create `sandbox/night-aviary/script.js` that:

- Adds `.js` to `document.documentElement`.
- Toggles `#site-menu` with `#menu-toggle`, synchronizing `aria-expanded` and `hidden` only in enhanced mode.
- Closes the mobile menu after a menu link is activated and when Escape is pressed.
- Writes `new Date().getFullYear()` to `#current-year`.
- Applies capped pointer-based CSS custom properties to `[data-bird]` only when both fine pointer and non-reduced-motion queries match.
- Performs no network requests and never hides page content during initialization.

- [ ] **Step 7: Verify the green state and markup quality**

Run:

```bash
tests/verify-night-aviary.sh
tidy -errors -quiet sandbox/night-aviary/index.html
git diff --check
```

Expected: verifier prints `Night Aviary structural checks passed`; Tidy reports no structural HTML errors; diff check exits zero.

- [ ] **Step 8: Render and inspect the real browser flow**

Start a local server from the worktree using `python3 -m http.server 4173`. Open `http://127.0.0.1:4173/sandbox/night-aviary/` and verify:

- All five authentic images render with intentional crops.
- Desktop, tablet, and 320px mobile compositions retain hierarchy.
- Menu, skip link, internal links, TikTok links, keyboard focus, Escape close, and year work.
- With JavaScript disabled, core content and navigation remain visible.
- With reduced motion enabled, the flock is static.
- The browser console has no page errors.

Capture full-page screenshots at approximately 1440px, 768px, and 320px into the three required `verification/` paths.

- [ ] **Step 9: Self-review and commit**

Review the complete task diff against the spec and anti-AI-look rules. Remove decoration that does not reinforce the perch/aviary motif. Then stage only the task files and commit:

```bash
git add sandbox/night-aviary tests/verify-night-aviary.sh verification/night-aviary-sandbox-desktop.png verification/night-aviary-sandbox-tablet.png verification/night-aviary-sandbox-mobile.png
git commit -m "feat: build Night Aviary redesign sandbox"
```
