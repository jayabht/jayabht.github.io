# Jaya Bhattacharya — Portfolio

Personal portfolio for Jaya Bhattacharya, copywriter and content strategist.
Static HTML/CSS/JS, no build step, no dependencies. Hosted on GitHub Pages at
<https://jayabht.github.io>.

## Design system

Editorial noir — a near-black canvas, bone text, one signal-orange accent.

| Token       | Value     | Used for                          |
|-------------|-----------|-----------------------------------|
| `--ink`     | `#0C0C0D` | page background                   |
| `--ink-2`   | `#131315` | raised sections (about, contact)  |
| `--bone`    | `#F2EDE4` | body text                         |
| `--signal`  | `#FF4A1C` | accents, numerals, hover states   |

Type is **Instrument Serif** for display and **Space Grotesk** for everything
else, both from Google Fonts. All tokens live in the `:root` block at the top of
`style.css` — change them there and the whole site follows.

## Structure

```
index.html      the whole site; all copy lives here
style.css       tokens first, then sections in page order
script.js       scroll reveals, lightbox, video and marquee behaviour
assets/img/     stills, mailers, push notifications, campaign creative
assets/video/   films (.mp4) with matching poster frames (.jpg)
404.html        not-found page
.nojekyll       serve files as-is, no Jekyll processing
```

Page order: hero → client marquee → stats → about → index → work → contact.

## Editing

**Copy** — open `index.html` and edit the text. Each project is one
`<article class="project">` with a `project__headline` and `project__sub`.

**Colours or type** — the `:root` block in `style.css`.

**Add a project** — copy an existing `<article class="project">`, change the
number, client, scope, tags, headline and sub, then point the tiles at files in
`assets/`. Add a matching row to the `.idxlist` nav so it appears in the index.

**Add an image** to a project:

```html
<figure class="tile reveal">
  <button class="tile__btn" type="button" data-full="assets/img/NAME.jpg">
    <img src="assets/img/NAME.jpg" alt="Client — Block name" loading="lazy" decoding="async">
  </button>
  <figcaption>Optional caption — this is where the metrics go.</figcaption>
</figure>
```

The `reveal` class fades the tile in on scroll. Keep it.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

Every push to `main` republishes the site, usually live within a minute.

```bash
git add -A
git commit -m "Update portfolio"
git push
```

## Media

Videos are H.264, capped at 1080px wide (the three longest at 720p), with
`-movflags +faststart` so they stream instead of downloading in full, and
`preload="none"` so nothing loads until played. Total media is ~85MB.

Replacing a video? Generate a matching poster frame with the same basename:

```bash
ffmpeg -i assets/video/NAME.mp4 -frames:v 1 -q:v 4 assets/video/NAME.jpg
```
