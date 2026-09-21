# Mehwish — Personal Portfolio Website

A single-page personal portfolio built for The Sky Gen Web Development
Project 01 (Beginner Level).

## Live link
_(add your deployed URL here after hosting on Netlify/Vercel/GitHub Pages)_

## Description
A responsive, single-page portfolio site presenting me as a frontend
developer — built with plain HTML, CSS and vanilla JavaScript, no
frameworks or page builders.

## Features
- Sticky navbar with smooth-scroll links (Home, About, Skills, Projects, Contact)
- Hero section with name, tagline, and a call-to-action button
- Auto-scrolling tech-stack marquee (pauses on hover)
- About section with a short bio and a downloadable CV button
- Skills section — 6 skills shown with icons and animated progress bars
- Projects section — 3 project cards with image, title, description, and link
- Contact form with real JavaScript validation (name, email format, message length)
- Footer with copyright and social links
- Mobile hamburger menu + scroll-to-top button
- Fully responsive at 360px, 768px, and 1440px — no horizontal scroll
- 3+ CSS hover effects (nav underline, card lift, button scale/color shift)
- Scroll-driven background color morph (tied to scroll position)
- Custom magnetic cursor (desktop) with magnetic pull on interactive elements
- Project cards expand in-place into full case studies (FLIP animation)
- A 3D robot mascot (built from primitive Three.js shapes — sphere, cylinder,
  torus, no imported model file) that waves on load and greets again when you
  scroll back to the hero
- Click the robot to open a scripted chat panel (button-driven Q&A about
  projects, skills, and contact — not a live AI, just fixed responses)
- Light/dark theme toggle (persists via localStorage)
- Custom favicon
- The robot follows you: after you scroll past the hero, she shrinks into a
  floating badge that slides to sit alongside whichever section you're
  reading (About/Skills/Projects/Contact)
- A pulsing "Ask me" hint on the robot so visitors know she's clickable
- Type-your-own-question box in the chat panel with simple keyword matching
  (not a live AI — a fixed keyword→reply map, so it's fully explainable and
  never hallucinates), on top of the quick-reply buttons
- Her eyes/head subtly track your cursor — she feels aware of you, not just decorative

## Tech stack
HTML5, CSS3 (Flexbox + Grid), vanilla JavaScript (ES6), Google Fonts, Font Awesome, Three.js (r128, via CDN)

## Third-party credits
- [Three.js](https://threejs.org/) — MIT licensed, used for the 3D robot mascot
- [Font Awesome](https://fontawesome.com/) — icon set, via CDN
- [Google Fonts](https://fonts.google.com/) — Fraunces, Space Grotesk, JetBrains Mono, Caveat

## Setup
No build step required — it's static.

```bash
# just open index.html directly, or serve it locally:
npx serve .
```

