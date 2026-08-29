# Jaya Bhattacharya — Portfolio

Personal portfolio site for Jaya Bhattacharya, copywriter and content strategist.
Static HTML/CSS/JS, no build step, hosted on GitHub Pages.

## Structure

```
index.html      the whole site (all copy lives here — edit text directly)
style.css       design tokens at the top (:root), then sections top-to-bottom
script.js       lightbox + video behaviour
assets/img/     stills, mailers, push notifications, campaign creative
assets/video/   promo films (.mp4) with matching poster frames (.jpg)
.nojekyll       tells GitHub Pages to serve files as-is
```

## Editing

**Change copy** — open `index.html` and edit the text. It reads in the same order
as the page, top to bottom: hero → about → education → work → contact.

**Change colours or type** — everything is in the `:root` block at the top of
`style.css`. `--cream` is the background, `--green` the dark sections,
`--accent` the terracotta highlight.

**Add a project** — copy an existing `<article class="project">` block, change
the client name, scope and tags, then point the `<img>` / `<video>` tags at new
files in `assets/`. Add a matching link to the `.clientnav` list.

**Add an image** — drop it in `assets/img/` and reference it as:

```html
<figure class="tile">
  <button class="tile__btn" type="button" data-full="assets/img/NAME.jpg">
    <img src="assets/img/NAME.jpg" alt="" loading="lazy" decoding="async">
  </button>
  <figcaption>Optional caption</figcaption>
</figure>
```

## Preview locally

```bash
cd jaya-portfolio
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

Every push to `main` republishes the site. GitHub Pages is configured to deploy
from the `main` branch, root folder.

```bash
git add -A
git commit -m "Update portfolio"
git push
```

## Notes on media

Videos are re-encoded to H.264 at up to 1080px wide (CRF 27, faststart) so they
stream rather than download in full. Poster frames are generated from the first
frame. If you replace a video, generate a poster with the same basename:

```bash
ffmpeg -i assets/video/NAME.mp4 -frames:v 1 -q:v 4 assets/video/NAME.jpg
```
