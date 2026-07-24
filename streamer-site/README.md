# Framekeeper — streamer site

A custom, static one-page site for Framekeeper as a game streamer: hero,
about, weekly schedule, clips, setup/gear, support, and contact/socials.
Dark background with purple/cyan/pink neon accents, clean modern layout.

```
streamer-site/
├─ index.html      ← all page content/sections
├─ styles.css      ← theme, layout, responsive rules
├─ script.js       ← mobile nav toggle, "today" schedule highlight, footer year
└─ devserver.ps1   ← tiny local preview server (no Node/Python needed)
```

## Preview it locally

This machine doesn't have Node or Python installed, so use the included
PowerShell static server:

```powershell
powershell -ExecutionPolicy Bypass -File streamer-site\devserver.ps1 -Port 5500
```

Then open `http://localhost:5500/` in a browser. (Opening `index.html`
directly by double-click also mostly works, but some browsers block the
external `styles.css`/`script.js` on `file://` — the local server avoids that.)

If Node or Python are ever installed, `npx serve .` or `python -m http.server`
work too.

## Things to customize before going live

Search `index.html` for these placeholders and replace with the real info:

- **Twitch/social links** — `twitch.tv/framekeeper`, Discord invite,
  YouTube, Twitter/X, Ko-fi/Streamlabs links are placeholders.
- **Bio & facts** — `[genre]`, `[year]`, main games, city, in the About section.
- **Schedule** — days/times/tags in the `#schedule` grid.
- **Clips** — the 4 `.clip-card` links currently point to `#`; point each at
  a real clip/YouTube URL (or swap the thumbnail div for a real embed/`<img>`).
- **Gear list** — actual PC/mic/camera/capture specs in `#setup`.
- **Email** — `hello@framekeeper.art` in the Contact section.
- **Avatar** — the "FK" placeholder box can be swapped for a real photo:
  replace `.avatar-placeholder` div with an `<img>`.

## Deploying on Render

A `render.yaml` Blueprint lives at the repo root, configured to serve this
folder as a Render **Static Site** (`rootDir: streamer-site`, no build step).

1. Push this repo to GitHub (already done: `rubylaken-sudo/Framekeeper`).
2. In the [Render dashboard](https://dashboard.render.com), click
   **New +** → **Blueprint**, and select this GitHub repo. Render will read
   `render.yaml` and create a `framekeeper-site` static site automatically.
3. Once deployed, Render gives you a URL like
   `https://framekeeper-site.onrender.com`.

If you'd rather set it up manually instead of via Blueprint: **New +** →
**Static Site**, pick the repo, set **Root Directory** to `streamer-site`,
leave **Build Command** blank, and set **Publish Directory** to `.`.

## Pointing framekeeper.art at it

The current framekeeper.art is hosted on **Adobe Portfolio**. To replace it
with this site once deployed (on Render or elsewhere):

1. In Render, open the static site → **Settings** → **Custom Domains**, and
   add `framekeeper.art`. Render will show you the exact DNS record to add
   (usually a CNAME, or an A record for the apex domain).
2. In your domain registrar's DNS settings, replace Adobe Portfolio's
   records with the ones Render gave you.
3. Once DNS propagates and Render shows the domain as verified,
   cancel/downgrade the Adobe Portfolio plan if no longer needed.

No server or database is required — it's plain HTML/CSS/JS.
