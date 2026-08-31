# Jaya Bhattacharya — Portfolio

Personal site for Jaya Bhattacharya, creative strategist working across content,
brand and AI. Live at <https://jayabht.github.io>.

Hand-authored HTML, CSS and JavaScript. No framework, no build step, no
dependencies, no tracking — so the site loads fast and the copy can be edited
directly in `index.html` without installing anything.

## Design system

Ink ground, bone type, one vermillion accent. All tokens sit in the `:root`
block at the top of `style.css`.

| Token     | Value     | Role                        |
|-----------|-----------|-----------------------------|
| `--ink`   | `#0B0B0C` | page ground                 |
| `--bone`  | `#EFECE3` | body text                   |
| `--acc`   | `#FF4A1C` | the single accent, sparingly|

Type: **Bricolage Grotesque** for display, **Instrument Sans** for reading,
**JetBrains Mono** for metadata and labels. Three families, one job each.

## Structure

```
index.html      the whole site — all copy lives here, in page order
style.css       tokens, then sections top to bottom
script.js       reveals, hero rotator, count-ups, lightbox, menu
404.html        not-found page
robots.txt      / sitemap.xml
assets/img/     stills, campaign creative, portrait
assets/video/   films (.mp4) + matching poster frames (.jpg)
```

Page order: hero → brand ticker → about → proof strip → work index → five case
studies (Bewakoof, Deltic, Emirates Draws, Being Human, Hersay) → personal work
→ more work → contact.

Social work uses `.feed` — a three-across square grid with hairline gutters, so
it reads the way it ran. Film and mixed-aspect sets use `.band`, a full-bleed
horizontal strip you can drag.

## Editing

**Copy** — open `index.html` and edit the text directly.

**The hero rotator** — the phrases cycling after "worth saying to" are the
`.rot__i` spans in the hero. Keep them short; a long one will overflow the line.

**Colour or type** — the `:root` block in `style.css`.

**Add work to a case study** — copy an existing `<figure class="shot">` and
point it at a file in `assets/`. Captions are where the metrics go.

**Move a project out of the archive** — the archive rows are `<article
class="arc">`; a full case study is `<article class="case">`. Promoting one
means giving it a hook line and the three context columns.

## Interactions

Restrained on purpose — you notice the content first.

- Hero sentence completes itself with a rotating object (paused when the tab is hidden)
- Scroll reveals with a slight sibling cascade
- Metrics count up when they arrive
- Work rows drag horizontally with a pointer; native scroll on touch
- Hovering an archive row floats a preview near the pointer (desktop only)
- Lightbox: arrows, ←/→, Esc, counter, captions
- Nav underline tracks the section you're in; bar tucks away on scroll-down
- Full-screen menu on mobile rather than a drawer

Two safeguards: animations that start hidden are gated behind an `html.js` class
so the page stays readable if the script fails, and a 2.5s failsafe reveals
everything regardless. Everything is disabled under `prefers-reduced-motion`.

## Preview locally

```bash
python3 -m http.server 8000
```

## Publishing

Every push to `main` republishes, usually live within a minute.

```bash
git add -A && git commit -m "Update" && git push
```

## Media

Videos are H.264 capped at 1080px (the three longest at 720p), `+faststart`, and
`preload="none"` so nothing downloads until played. Replacing one? Generate a
matching poster with the same basename:

```bash
ffmpeg -i assets/video/NAME.mp4 -frames:v 1 -q:v 4 assets/video/NAME.jpg
```
