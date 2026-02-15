# SkyAndSunny.com Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page static showcase website for Sky & Sunny (green cheek conures) with TikTok stats, bird profiles, and video highlights.

**Architecture:** Single `index.html` file with Tailwind CSS via CDN and vanilla JavaScript for animations. No build step, no framework — just static HTML served via GitHub Pages.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Google Fonts (Quicksand + Nunito), Vanilla JS, GitHub Pages

**Design doc:** `docs/plans/2026-02-15-skyandsunny-website-design.md`

---

### Task 1: Initialize Git Repo and Project Structure

**Files:**
- Create: `.gitignore`
- Create: `index.html` (skeleton only)

**Step 1: Initialize git repo**

Run: `cd /Users/kevincohen/Desktop/SkyAndSunny.com && git init`

**Step 2: Create .gitignore**

```
.DS_Store
*.swp
*.swo
node_modules/
```

**Step 3: Create minimal index.html skeleton**

Create `index.html` with:
- `<!DOCTYPE html>` declaration
- `<html lang="en">` with `<head>` and empty `<body>`
- Meta charset, viewport
- Title: "Sky & Sunny | Green Cheek Conures on TikTok"
- Tailwind CSS CDN link: `https://cdn.tailwindcss.com`
- Google Fonts link for Quicksand (400,600,700) and Nunito (400,600)
- Tailwind config script setting custom colors and fonts from design doc
- Empty `<body>` with cream background class

**Step 4: Commit**

```bash
git add .gitignore index.html docs/
git commit -m "init: project scaffold with design doc and HTML skeleton"
```

---

### Task 2: Navigation Bar

**Files:**
- Modify: `index.html`

**Step 1: Add sticky navigation**

Add a `<nav>` as first child of `<body>` with:
- Sticky positioning, white/cream background, subtle shadow on scroll
- Left: brand text "Sky & Sunny" in Quicksand bold with gradient text (yellow to violet)
- Right: horizontal nav links — Home, Sunny, Sky, Videos, TikTok
  - Home/Sunny/Sky/Videos are anchor links (`#home`, `#sunny`, `#sky`, `#videos`)
  - TikTok is external link to `https://www.tiktok.com/@skyandsunny.com` with `target="_blank"`
- Desktop: horizontal links visible
- Mobile: hamburger button (three-line icon) that toggles a dropdown menu
- Add the mobile menu toggle JS inline at bottom of body

**Step 2: Verify in browser**

Open `index.html` in browser. Check:
- Nav sticks to top on scroll
- Links are visible on desktop
- Hamburger shows on mobile viewport (resize browser)
- Hamburger toggles mobile menu open/closed

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add sticky navigation with mobile hamburger menu"
```

---

### Task 3: Hero Section

**Files:**
- Modify: `index.html`

**Step 1: Add hero section HTML**

Add `<section id="home">` after nav with:
- Full viewport height, centered content
- Yellow-to-violet gradient accent (subtle background blob or border)
- Large heading: "Sky & Sunny" in Quicksand 700, text-5xl/6xl
- Subtitle: "Two Green Cheek Conures Taking Over TikTok" in Nunito
- Three stat counters in a row: "11.9K Followers" | "882.9K Likes" | "13M+ Views"
  - Use `<span>` elements with data attributes for counter targets: `data-target="11900"`, `data-target="882900"`, `data-target="13000000"`
  - Display formatted values (11.9K, 882.9K, 13M+)
- CTA button: "Watch on TikTok" — rounded, gradient background (yellow to green), links to `https://www.tiktok.com/@skyandsunny.com`, `target="_blank"`
- Decorative CSS elements: subtle feather shapes using CSS pseudo-elements or SVG silhouettes

**Step 2: Add counter animation JS**

Add JavaScript at bottom of `<body>`:
- `IntersectionObserver` watches the stats section
- When visible, animate numbers from 0 to target over ~2 seconds
- Use `requestAnimationFrame` for smooth animation
- Format large numbers: 11900 → "11.9K", 882900 → "882.9K", 13000000 → "13M+"

**Step 3: Verify in browser**

Open and check:
- Hero fills viewport
- Stats animate when scrolled into view
- CTA button links to TikTok
- Gradient accent is visible and subtle

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add hero section with animated stat counters"
```

---

### Task 4: Meet Sunny Section

**Files:**
- Modify: `index.html`

**Step 1: Add Sunny's profile section**

Add `<section id="sunny">` with:
- Section heading: "Meet the Stars"
- Large card/panel for Sunny:
  - Circular placeholder image area (250x250px) with yellow/green gradient border
    - Placeholder: light yellow background with sun emoji or bird silhouette
  - Name "Sunny" with a star icon (use unicode &#9733; or SVG)
  - Badge: "The Star" — small pill/tag in yellow (#F5C518)
  - Species: "Yellow-sided Green Cheek Conure"
  - Bio placeholder: "The queen of TikTok with 13M+ views. Sunny lights up every room with her yellow-green feathers and big personality."
  - Fun facts list (3-4 items):
    - "Favorite snack: millet spray"
    - "Signature move: head bobbing to music"
    - "Mood: always chaotic"
    - "Status: TikTok famous"
- Colors: section has warm cream background, card has white background with shadow
- Scroll-reveal: card fades in from left when scrolled into view

**Step 2: Verify in browser**

Check Sunny's section appears with correct colors, placeholder image circle, badge, and bio.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Meet Sunny star profile section"
```

---

### Task 5: Meet Sky Section

**Files:**
- Modify: `index.html`

**Step 1: Add Sky's profile section**

Add Sky's card within the same `#sunny` section (or as a sibling card):
- Same layout as Sunny but mirrored (image on opposite side on desktop)
- Circular placeholder image area with blue/violet gradient border
  - Placeholder: light blue background with bird silhouette
- Name "Sky" with a feather icon
- Badge: "The Co-Star" — small pill/tag in violet (#7B68EE)
- Species: "Green Cheek Conure (Violet Mutation)"
- Bio placeholder: "The chill one. Sky brings the blue vibes and acts as Sunny's loyal sidekick in every TikTok adventure."
- Fun facts list:
  - "Favorite activity: preening"
  - "Signature move: the shoulder perch"
  - "Mood: mysteriously calm"
  - "Role: Sunny's biggest fan"
- Scroll-reveal: card fades in from right when scrolled into view

**Step 2: Verify in browser**

Check Sky's section with correct violet/blue colors, mirrored layout, and separate badge.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Meet Sky co-star profile section"
```

---

### Task 6: TikTok Highlights Section

**Files:**
- Modify: `index.html`

**Step 1: Add video highlights grid**

Add `<section id="videos">` with:
- Section heading: "TikTok Highlights"
- Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- 6 placeholder video cards, each with:
  - Thumbnail placeholder (16:9 aspect ratio, gradient background yellow→violet)
  - Play button overlay (triangle icon, centered, semi-transparent white circle)
  - Title placeholder text (e.g., "Sunny's Greatest Hits", "Morning Chaos", "Sky Joins In", etc.)
  - View count placeholder (e.g., "2.9M views", "3.3M views", "2M views", etc.)
  - Each card links to `https://www.tiktok.com/@skyandsunny.com` with `target="_blank"`
- Cards have rounded corners, subtle shadow, hover scale effect
- Scroll-reveal: cards stagger-fade-in

**Step 2: Add a "See More on TikTok" button below the grid**

Centered button linking to TikTok profile, styled like the hero CTA.

**Step 3: Verify in browser**

Check grid layout at different viewport sizes. Verify hover effects and links.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add TikTok highlights video grid section"
```

---

### Task 7: Footer

**Files:**
- Modify: `index.html`

**Step 1: Add footer**

Add `<footer>` with:
- Dark charcoal background (#2D2D2D), light text
- TikTok link: "Follow @SkyAndSunny.com on TikTok" with external link
- Copyright: "© 2026 SkyAndSunny.com"
- Decorative element: subtle feather SVG or gradient line
- Centered layout, generous padding

**Step 2: Verify in browser**

Check footer appears at bottom with dark background and correct links.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add footer with TikTok link and copyright"
```

---

### Task 8: Scroll Animations and Smooth Scroll

**Files:**
- Modify: `index.html`

**Step 1: Add scroll-reveal animation system**

Add CSS and JS for scroll-reveal:
- CSS: `.reveal` class starts with `opacity: 0; transform: translateY(30px)` and `.reveal.active` transitions to visible
- `.reveal-left` starts from left, `.reveal-right` from right
- JS: `IntersectionObserver` adds `.active` class when elements enter viewport
- Apply `.reveal` classes to all section content that should animate in

**Step 2: Add smooth scrolling**

- CSS: `html { scroll-behavior: smooth; }`
- Add `scroll-padding-top` to account for sticky nav height
- Nav links already use `#anchor` hrefs so smooth scroll works automatically

**Step 3: Add nav shadow on scroll**

JS: On scroll, add/remove shadow class on nav when page is scrolled past 50px.

**Step 4: Verify in browser**

Scroll through entire page and check:
- Elements fade in as they enter viewport
- Nav links smooth-scroll to sections
- Nav gets shadow when scrolled

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add scroll-reveal animations and smooth scrolling"
```

---

### Task 9: Mobile Polish and Responsive Tweaks

**Files:**
- Modify: `index.html`

**Step 1: Test and fix mobile layout**

Resize browser to mobile widths and fix:
- Hero text sizes scale down appropriately (text-3xl on mobile vs text-6xl on desktop)
- Stat counters stack or wrap on small screens
- Bird profile cards stack vertically on mobile
- Video grid goes to single column on small screens
- All padding/margins feel right on mobile
- Touch targets are large enough (min 44x44px for buttons/links)

**Step 2: Verify on multiple breakpoints**

Check at: 375px (iPhone), 768px (tablet), 1024px (laptop), 1440px (desktop)

**Step 3: Commit**

```bash
git add index.html
git commit -m "fix: mobile responsive polish and touch targets"
```

---

### Task 10: Create GitHub Repo and Deploy

**Step 1: Create GitHub repository**

```bash
cd /Users/kevincohen/Desktop/SkyAndSunny.com
gh repo create SkyAndSunny.com --public --source=. --push
```

This creates the repo, sets origin, and pushes all commits.

**Step 2: Verify on GitHub**

Run: `gh repo view --web` to open in browser and verify files are there.

**Step 3: Commit any final changes**

If anything was adjusted, commit it.

---

## Notes

- **Stats from real TikTok:** 11.9K Followers, 882.9K Likes, 13M+ Views
- **TikTok profile URL:** `https://www.tiktok.com/@skyandsunny.com`
- **Bio from TikTok:** "Sunny ☀️ Sky🦜"
- **All images are placeholders** — designed to be easily swapped with real photos later
- **No build step** — just open `index.html` in a browser to preview
- **Tailwind config** is inline in a `<script>` tag, defining custom colors from the design doc
