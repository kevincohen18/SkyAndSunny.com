# SkyAndSunny.com Night Aviary Redesign

**Status:** Direction and written spec approved for sandbox implementation
**Date:** 2026-09-17
**Approved direction:** “Night Aviary”

## Purpose

Rebuild SkyAndSunny.com as a distinctive, bird-led home for Sky and Sunny. The page should feel like entering their small nighttime aviary: playful, vivid, and alive, while remaining simple enough to load quickly and understand immediately.

The page’s primary job is to introduce the two birds and send visitors to their real TikTok posts. Its secondary job is to give the pair a memorable visual identity outside TikTok.

## Locked decisions

- Every displayed photo and every linked video must be authentic SkyAndSunny media.
- No stock birds, AI-generated birds, gradient placeholders, fake thumbnails, invented titles, or unsupported view counts.
- Do not publish the old placeholder biographies, personality traits, favourite foods, or species-mutation claims as facts.
- Do not show volatile social counts in the static page. TikTok remains the live source for those numbers.
- Preserve every supplied original asset. Optimized web derivatives are additive.
- The redesign stays a static site with no framework or backend.
- The first build is a reviewable sandbox; the existing `index.html` is replaced only after the sandbox direction is visually accepted.

## Verified source material

| Local source | Verified use | Destination |
|---|---|---|
| `Sunny-pfp.jpeg` | Sunny portrait | Hero and Sunny introduction |
| `sky-pfp.png` | Sky portrait, despite the misleading extension | Convert from HEIF to a browser-safe derivative; use for hero and Sky introduction |
| `her life is forever changed.png` | Still from the matching pinned TikTok | Featured moment linking to post `7214467392791907590` |
| `Strawberries.png` | Still from the matching pinned TikTok | Featured moment linking to post `7214307952763620613` |
| `Obsessions.png` | Still from the matching pinned TikTok | Featured moment linking to post `7213469583162854662` |

Verified profile copy is limited to the account name, handle, bio “Sunny ☀️ Sky🌌”, the birds’ names, and descriptions directly observable in the supplied media. The profile URL is `https://www.tiktok.com/@skyandsunny.com`.

## Visual direction

### Palette

All values live in a semantic CSS token layer rather than scattered through view rules.

- **Night canopy:** deep blue-green canvas derived from the dark background in Sky’s portrait.
- **Moonlit surface:** slightly lighter teal used for grouped content.
- **Cloud feather:** cool near-white for primary text.
- **Sky plumage:** saturated turquoise for focus and Sky-specific accents.
- **Sunny glow:** warm yellow for Sunny-specific accents and the dominant action.
- **Watermelon:** coral-red drawn from the pinned watermelon post, used sparingly.
- **Bark:** warm brown reserved for the shared perch motif.

The site is intentionally dark-first because both birds’ plumage and the supplied media read more vividly against a night field. It will not add a second light theme solely for feature count.

### Typography

- A rounded but characterful display face for the nameplate and major headings.
- A highly legible humanist sans serif for body copy and controls.
- Sentence case throughout; no decorative all-caps eyebrows or monospace metadata.
- Headline widths remain compact, with body lines capped for comfortable reading.

### Distinctive motif

A continuous illustrated perch line moves through the page and acts as structure rather than decoration: it underlines the navigation brand, visually seats the hero portraits, and becomes a divider near the featured moments.

One restrained flock effect lives only in the hero. Small CSS/SVG bird silhouettes shift gently in response to pointer movement. They remain non-interactive, cannot obscure text, and become static when reduced motion is requested or pointer precision is unavailable.

## Information architecture

### 1. Navigation

- Wordmark: “Sky & Sunny”.
- Links: Meet the birds, Featured moments, TikTok.
- Compact mobile disclosure uses a native button and removes collapsed links from keyboard navigation.
- The primary TikTok action is visually distinct but not pill-shaped by default.

### 2. Hero: “Two tiny birds. One very big screen presence.”

- Asymmetric composition with the real Sunny and Sky portraits intersecting the perch line.
- Short supporting text that identifies them without invented personality claims.
- Primary action: “Watch Sky & Sunny on TikTok”.
- Secondary action: “Meet the birds”.
- No stat counter, profile metric, autoplay video, or fake social proof.

### 3. Meet the birds

- A two-part editorial layout rather than two identical cards.
- Sunny and Sky each receive a real portrait, their name, and short observational copy.
- Copy avoids claims not established by the supplied media or live profile.

### 4. Featured moments

- Three deliberately different image treatments reflect the source aspect ratios rather than forcing a uniform card grid.
- Each item uses the supplied still, the real TikTok caption in lightly edited display form, and the exact post permalink.
- Link language says “Watch this moment on TikTok”; local stills never impersonate playable video.
- No static view counts because those values change and are not page-owned data.

### 5. Footer

- Profile handle and a final TikTok link.
- Automatic current year.
- No unverified claims or extra social links.

## Layout sketch

```text
┌─────────────────────────────────────────────────────────┐
│ Sky & Sunny       Meet the birds   Moments   [TikTok]  │
├─────────────────────────────────────────────────────────┤
│  TWO TINY BIRDS.          ╭ Sunny portrait ╮           │
│  ONE VERY BIG             ╰──────┬─────────╯  Sky      │
│  SCREEN PRESENCE.  [CTA] ════════╧══ perch ═══════     │
├─────────────────────────────────────────────────────────┤
│ Sunny / wide editorial image       Sky / tall portrait  │
├─────────────────────────────────────────────────────────┤
│ [wide real moment] [portrait real moment] [wide moment] │
└─────────────────────────────────────────────────────────┘
```

On mobile, image and text blocks form a single reading column. The perch becomes a short section marker rather than a decorative horizontal path.

## Interaction and motion

- Hero flock responds subtly to pointer position; movement is capped and eased.
- Navigation disclosure, focus, and link states clearly communicate changes.
- Featured-moment hover treatment reveals movement through crop/contrast, not floating-card translation.
- Content is visible by default. JavaScript enhances motion and navigation but never gates visibility.
- `prefers-reduced-motion: reduce` disables pointer-reactive movement, animated scrolling, and ornamental transitions.

## Media handling

- Convert the Sky HEIF source to an actual JPEG or WebP; never rename bytes to fake a format.
- Produce optimized derivatives for the multi-megabyte PNG stills while retaining originals.
- Use explicit intrinsic dimensions to prevent layout shift.
- Use meaningful alt text that describes what is visible, without guessing emotion or intent.
- If an optimized derivative fails, the layout remains coherent and the TikTok text link remains available.

## Accessibility and resilience

- Semantic landmarks and a logical heading hierarchy.
- Skip link, visible focus indicators, full keyboard operation, and minimum 44px touch targets.
- Text/background combinations target WCAG AA contrast.
- Mobile layout reflows at 320px and remains usable at 200% zoom.
- External links disclose TikTok in their text or accessible name.
- A concise `<noscript>` experience is unnecessary because all core content is serverless HTML and visible without JavaScript.
- External font failure falls back to a deliberate system-font stack without breaking layout.

## Scope

### Included

- New static sandbox page and token-led CSS.
- Authentic image derivatives.
- Responsive navigation and restrained bird motion.
- Exact links for the three verified TikTok posts.
- Replacement of the current page after sandbox approval.
- Browser and accessibility verification evidence.

### Excluded

- Scraping or mirroring TikTok video files.
- Autoplaying or self-hosting TikTok videos.
- A CMS, database, analytics system, merch store, email capture, or additional social platforms.
- Public deployment, DNS changes, or production release in this task.
- New biographical facts without owner-supplied confirmation.

## Verification

The candidate is not complete until all of the following are evidenced:

- Desktop, tablet, and narrow-mobile screenshots of the sandbox and final page.
- Every local image loads from a browser-compatible format and shows the intended crop.
- Each featured moment opens its exact matching TikTok permalink.
- Keyboard navigation covers the skip link, menu, internal navigation, and external actions.
- With JavaScript disabled, all primary content and TikTok links remain visible.
- With reduced motion enabled, the flock and ornamental transitions are static.
- Search confirms removal of old placeholder titles, invented biography facts, fake counts, and placeholder imagery.
- HTML validation, console-error inspection, and an automated accessibility scan complete without blocking findings.

## Implementation boundary

The redesign remains deliberately small: one static HTML entry point, one stylesheet, one progressive-enhancement script, and optimized local media. This separation keeps the visual system understandable while avoiding a new build toolchain for a site that does not need one.
