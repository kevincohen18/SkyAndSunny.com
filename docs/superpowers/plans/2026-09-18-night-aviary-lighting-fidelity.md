# Night Aviary Lighting Fidelity Plan

**Goal:** Make the production Night Aviary hero closely match the supplied 1748×1130 reference by using the two new bird sources, lowering and seating Sunny more naturally, preserving Sky's right-side composition, and reproducing the reference's dimensional shadows without adopting the alternate moonlit-conservatory branch.

**Reference:** `/Users/kevincohen/.codex/attachments/6225a7c8-9a8c-425f-9720-5a1db43e44fd/image-1.png`

**Base:** Production/main commit `3887f48312d4717a2c088e914f3bf30c8b735e7e` in isolated branch `feat/night-aviary-lighting-fidelity`.

## Global Constraints

- Keep the existing production Night Aviary structure and content; do not use or merge `feat/moonlit-conservatory-mockup`.
- Use the user-provided source files `/Users/kevincohen/Desktop/SkyAndSunny.com/sunny no bg new lighting.png` and `/Users/kevincohen/Desktop/SkyAndSunny.com/sky no bg new lighting.png` as the hero bird sources, converted to optimized transparent WebP assets under `assets/`.
- Preserve source PNGs and every unrelated untracked file in the main checkout.
- Match the reference's desktop composition: large left title, continuous rising branch, Sunny lower than the current render near the center, Sky at the right, readable labels, atmospheric depth, and visible soft directional drop shadows.
- Recalibrate all foot/contact anchors and support paths against the new image pixels. Do not retain stale coordinates merely to keep old tests green.
- Preserve semantic navigation, keyboard behavior, skip link, exact TikTok links, JS-off rendering, reduced motion, 44px targets, 320px/200% reflow, and the existing authentic moment compositions.
- Keep visual values in the token layer and avoid unrelated redesign or copy changes.
- Verify desktop against the exact reference and verify mobile independently; both bird faces must remain visible in the first mobile viewport.

## Task 1: Replace and recomposite the hero residents

**Expected files:**

- Modify: `assets/sunny-cutout.webp`
- Modify: `assets/sky-cutout.webp`
- Modify: `index.html`
- Modify: `sandbox/night-aviary/index.html`
- Modify: `styles.css`
- Modify: `tests/verify-night-aviary.sh`
- Modify: `tests/verify-perch-contacts.mjs`
- Add or refresh focused desktop/mobile screenshots under `verification/`

**TDD and implementation:**

1. Add focused assertions for the new asset identity/dimensions, distinct ambient and contact shadow treatment, Sunny's lower normalized placement, and recalibrated foot-to-branch contact. Run them first and capture the expected failure.
2. Convert the supplied PNGs to performant WebP while preserving alpha and avoiding a visible rectangular matte or glow boundary.
3. Recalibrate hero sizing/placement and intrinsic support geometry so Sunny is lower and both birds appear weight-bearing on the shared branch at desktop, tablet, mobile, and 200% reflow viewports.
4. Add tokenized subject shadows that resemble the reference: restrained soft separation beneath/behind each bird plus tight contact shadow at feet. Avoid glow-like halos.
5. Keep root and sandbox HTML identical, update only stale test assumptions superseded by this plan, and do not alter below-fold content except where shared invariants require it.
6. Run structural, syntax, contact-geometry, broken-image, console, reduced-motion, JS-off, keyboard, mobile, and 200% reflow checks. Refresh comparison screenshots.
7. Self-review the complete base-to-tip diff and commit the task with a precise conventional commit.

## Acceptance

- The rendered desktop hero uses the two new-lighting birds and visually matches the supplied reference in scale, placement, branch seating, depth, and shadow character.
- Sunny is visibly lower than the current production render and no longer reads as floating or too high.
- Sky retains a clean transparent silhouette; no rectangular haze or asset-canvas edge is visible.
- Both birds' feet meet visible support geometry within the contact-test tolerance across all tested viewports.
- Mobile still shows both faces in the first viewport with no horizontal overflow.
- The full existing verification suite passes, and an independent Astra visual reviewer returns a pass after comparing the final screenshots with the reference.
