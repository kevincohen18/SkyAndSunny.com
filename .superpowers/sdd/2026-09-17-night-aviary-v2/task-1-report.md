# Task 1 report — Night Aviary V2

## Status and commits

Implemented and locally verified in the isolated `feat/night-aviary-redesign` worktree. No push, PR, deployment, package installation, or external mutation was performed.

- Base: `f852cc4e4411039b2b3f915caa3c04cde768ff39`
- Structural V2 commit: `d39304043806e04d2d11bb9a3969963f194e2175`
- Astra fix-wave implementation: `e68f686` (`fix: polish aviary cutouts and safe zones`)

## Result

The page is one continuous moonlit aviary rather than a dark brochure:

- The first viewport contains a firm matte moon, twelve restrained stars, faint enclosure ribs, layered compound foliage, two authentic transparent bird cutouts, and one tapered two-tone branch.
- User-supplied transparent PNG cutouts were converted locally to alpha-preserving WebP derivatives. The hero no longer uses hand-traced masks, polygonal crops, synthesized bird pixels, or room/furniture remnants.
- Sunny's visible toes rest on the shared branch. Sky's extended foot meets the branch/fork while the branch follows the angle implied by Sky's pose.
- Hard content clearings keep the full title, wordmark, nav, names, supporting copy, CTA, both faces, and moment captions free of foreground coverage at the tested desktop, intermediate, tablet, mobile, no-JS, reduced-motion, and 320px reflow states.
- The scroll habitat uses a segmented taper with bark edge, marks, knots, and edge foliage. It routes around all caption clearings. Small photo twigs are confined to corners and no longer cross birds, tablets, or captions.
- All three authentic moment derivatives and their exact TikTok mappings are unchanged.
- Motion remains progressive enhancement: one 780ms/12px canopy entrance, a single requestAnimationFrame path for the latest pointer position, maximum ±2px background / ±4px foreground depth, static middle plane, pointer-leave reset, and offscreen/hidden/reduced-motion pause. There is no idle loop or animated filter/shadow.
- Typography now uses explicit, honest system stacks: Georgia/Times for display and Avenir Next/Segoe UI/Helvetica/Arial for body copy. There are no remote font requests or claims that unavailable webfonts are shipped.

## Exact files

Modified in the fix wave:

- `sandbox/night-aviary/index.html`
- `sandbox/night-aviary/styles.css`
- `sandbox/night-aviary/script.js`
- `tests/verify-night-aviary.sh`
- `verification/night-aviary-first-viewport-desktop.png`
- `verification/night-aviary-first-viewport-mobile.png`
- `verification/night-aviary-sandbox-desktop.png`
- `verification/night-aviary-sandbox-tablet.png`
- `verification/night-aviary-sandbox-mobile.png`

Added in the fix wave:

- `sandbox/night-aviary/assets/sunny-cutout.webp`
- `sandbox/night-aviary/assets/sky-cutout.webp`
- `verification/night-aviary-first-viewport-800.png`
- `verification/night-aviary-js-off-mobile.png`
- `verification/night-aviary-reduced-motion-mobile.png`

Preserved:

- Root `index.html` is untouched.
- The five prior authentic WebP derivatives remain present and unchanged: `sunny-portrait.webp`, `sky-portrait.webp`, and the three moment images.
- The authoritative root PNGs, `/Users/kevincohen/Desktop/SkyAndSunny.com/sunny no bg.png` and `/Users/kevincohen/Desktop/SkyAndSunny.com/sky no bg.png`, are untouched.

## Test-first and structural evidence

The fix-wave verifier was extended before implementation to require Sunny/Sky face hooks, the JS-off header flow, caption-clear hooks, and honest font declarations. It initially failed with `Missing V2 requirement: Sunny face safe-zone hook` (exit 1). After implementation:

- `bash tests/verify-night-aviary.sh` — pass: `Night Aviary V2 structural checks passed`.
- The verifier now requires the two transparent cutout derivatives, direct cutout rendering, alpha when `webpinfo` is available, a 400KB per-cutout budget, exact TikTok mappings, the habitat structure, compound leaf symbol, motion lifecycle hooks, face/caption hooks, and absence of the rejected V1/mask/font claims.
- `node --check sandbox/night-aviary/script.js` — pass.
- `git diff --check` — pass.

## Browser and accessibility evidence

The local browser harness used the already-cached Playwright package and installed Chrome; no package was fetched. Its final run exits nonzero on overflow, broken images, failed requests, console errors, face-probe occlusion, branch/caption collision, reduced-motion transforms, keyboard-contract failure, missing focus indication, or unnamed interactive nodes.

- Exact first viewports: 1440×900, 800×900, and 390×844 — no horizontal overflow, broken image, failed request, or console error.
- JS-off 390×844 — nav participates in normal flow, the complete title is readable, both birds remain in the first viewport, and there is no overflow.
- Reduced-motion 390×844 — all three habitat plane transforms compute to `none`; the static moon/branch/birds/foliage composition remains complete. The site uses local system stacks, so the same capture requires no remote font availability.
- Full pages: desktop 1440×3907, tablet 768×4431, mobile 390×3319.
- Five-point face hit-test grids pass for both residents at 1440×900, 800×900, 390×844, JS-off 390×844, reduced-motion 390×844, and 320×800. True face centers were sampled (not generic image centers). Representative centers: desktop Sunny `(855,248)`, Sky `(1194,193)`; 800px Sunny `(212,303)`, Sky `(626,309)`; mobile Sunny `(157,296)`, Sky `(270,276)`.
- Continuous-branch sampling at 3-unit SVG intervals with a 14px caption buffer reports zero collisions at every rendered state, including desktop, 800px, mobile, no-JS, reduced-motion, and 320px.
- Mobile keyboard path: skip link → wordmark → menu; Enter opens (`aria-expanded=true`), Escape closes (`false`) and returns focus to `#menu-toggle`.
- Chrome accessibility-tree smoke: banner/navigation/main/contentinfo present and zero unnamed interactive nodes.
- Focus proof: moment image link produces a 3px solid cyan outline on its unclipped wrapper.
- Pointer extremes: background is capped at ±2px, middle stays at 0px, foreground is capped at ±4px; pointer exit clears the active class and resets all transforms.
- 320×800 reflow is a distinct narrow-layout test: document width equals viewport width, both faces remain clear, captions remain clear, and there is no horizontal overflow. This is not reported as 200% browser zoom.

Actual browser-chrome 200% zoom was not automated: Playwright viewport/device-scale emulation would not be equivalent to user-agent zoom, so claiming it would overstate the evidence. It remains a manual browser check. The 320px reflow result is retained only as reflow evidence.

An automated axe/pa11y scan was not run because neither CLI is installed. `npx --no-install pa11y --version` confirmed the package is unavailable and did not install it. The Chrome accessibility tree, keyboard interaction, focus, reduced-motion, and layout assertions above were run instead.

`tidy -utf8 -errors -quiet sandbox/night-aviary/index.html` was also run. The installed Apple Tidy is build 8433 from 31 October 2006; it predates HTML5 and reports standard semantic and SVG elements such as `header`, `nav`, `main`, and `svg` as unknown. That output is recorded as a legacy-tool limitation, not represented as modern HTML validity. Chrome parses the document with no console/resource failures and exposes the intended landmarks.

## Asset integrity and performance

- `sunny-cutout.webp`: 1366×1152, alpha retained, 336,206 bytes.
- `sky-cutout.webp`: 1024×1536, alpha retained, 288,018 bytes.
- Both were encoded locally with `cwebp -q 92 -alpha_q 100 -m 6 -mt -metadata none`; encoder aggregate PSNR was 47.68dB and 48.52dB respectively.
- All seven sandbox WebP assets total approximately 1.1MB on disk. HTML/CSS/JS total 39,993 bytes uncompressed.
- Original PNG SHA-256: Sunny `57a0fc12c4b1b7b7e42b08febe5040e299b5909f75b65027c8be523e0b896c57`; Sky `5599d6cf26d1aeee204e67cfadfad1eecfa78cfff90d3b6232a2797a9f35f751`.
- Derived WebP SHA-256: Sunny `643d921f5bfbdfad9b708686c0a6b223985f621f7066c7ff59eb4dd4c9895132`; Sky `293f1db149020e04ea65d6646cf1c97fa4c075c3198128ad094a6b0076cb2978`.

## Viewport evidence

- `verification/night-aviary-first-viewport-desktop.png` — exact 1440×900.
- `verification/night-aviary-first-viewport-800.png` — exact 800×900.
- `verification/night-aviary-first-viewport-mobile.png` — exact 390×844.
- `verification/night-aviary-js-off-mobile.png` — exact 390×844 with JavaScript disabled.
- `verification/night-aviary-reduced-motion-mobile.png` — exact 390×844 with reduced motion.
- `verification/night-aviary-sandbox-desktop.png` — full 1440px page.
- `verification/night-aviary-sandbox-tablet.png` — full 768px page.
- `verification/night-aviary-sandbox-mobile.png` — full 390px page.
- `.superpowers/sdd/2026-09-17-night-aviary-v2/reflow-320.png` — local 320×800 reflow evidence.
- `.superpowers/sdd/2026-09-17-night-aviary-v2/render-results.json` — measured local browser results.

## Design self-critique

- Aviary legibility: pass. The enclosure, moonlight, edge canopy, residents, and perch read without motion, JavaScript, or remote fonts.
- Safe zones: pass for the recorded states. The birds and vegetation do not cover title/nav/copy/actions; true face hit targets and caption buffers are programmatically clear.
- Authenticity: pass. The supplied transparent cutouts eliminate rectangular room remnants and hand-drawn feather chopping while retaining authentic pixels. Moment images remain untouched real scenes.
- Perch anatomy: pass at the tested sizes. The branch is tapered and irregular with a darker underside, fine upper rim, fissures, knots, and a restrained fork; Sunny's toes and Sky's extended foot meet it.
- Botanical depth: pass. Repeated oval stamps were replaced by compound, stemmed leaf sprays with varied scale/rotation; soft foreground is limited to viewport edges and sharper foliage carries into moments.
- Moment flow: pass. The branch skirts caption clearings and mobile photo twigs stay in corners. The long desktop narrative remains intentionally spacious; it is the least compact aspect of the design but no longer relies on empty forced-height sections.
- Remaining manual evidence: true browser-chrome 200% zoom should be checked before promoting this sandbox to the production root. The current evidence separately proves 320px reflow, not browser zoom.

The `ai-slop-free-ui` review criteria drove removal of eyebrow/template copy, unavailable-font claims, generic masks, repeated flat foliage, and card/grid rhythm. The result is specific to these two birds and this moonlit enclosure rather than a swappable landing-page theme.
