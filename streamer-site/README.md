# Framekeeper — streamer site

A custom, static one-page site for Framekeeper as a game streamer: hero,
GTA VI countdown, about, weekly schedule, clips, challenges, setup/gear,
support, and contact/socials. Dark background with neon green accents.

```
streamer-site/
├─ index.html       ← page structure and fallback content
├─ styles.css       ← theme, layout, responsive rules
├─ script.js        ← renders site-data.json, nav, tilt/reveal effects, countdown
├─ site-data.json   ← the content you edit most (followers, schedule, clips…)
├─ admin.html       ← phone-friendly editor that publishes site-data.json
└─ devserver.ps1    ← tiny local preview server (no Node/Python needed)
```

## Updating from your phone

Open `https://<your-site>/admin.html` on your phone (add it to your home screen
for one-tap access). It edits `site-data.json` and commits it to GitHub; Render
redeploys the site automatically, usually within a minute or two.

What you can edit there: currently playing, followers, streams, main games,
streaming since, the weekly schedule (times, labels, rest days), the GTA VI
release date, clips (paste a YouTube Shorts link), and the gear list.

**One-time setup — create a GitHub token for your phone**

1. GitHub → Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token.
2. Repository access: *Only select repositories* → `Framekeeper`.
3. Repository permissions → **Contents: Read and write** (nothing else).
4. Set an expiration, generate, then paste the token into `admin.html` on your
   phone and tap **Save token on this device**.

The token is stored only in that phone's browser (localStorage) and is sent
only to `api.github.com`. Anyone who finds `admin.html` can see the form but
cannot publish without the token. If the phone is lost, revoke the token on
GitHub. When it expires, generate a new one and paste it in again.

Because the admin page commits straight to `main`, run `git pull` in your local
clones before making changes on your computer.

**No token handy?** You can also edit `streamer-site/site-data.json` directly in
the GitHub mobile app or on github.com — same result.

## Editing content on your computer

Most content lives in `site-data.json`. Text that rarely changes (bio, support
cards, challenge list, social links, email) is in `index.html`.

`index.html` also holds fallback values for the data-driven parts, so the page
still shows sensible content if `site-data.json` can't be loaded.

## Preview it locally

This machine doesn't have Node or Python installed, so use the included
PowerShell static server:

```powershell
powershell -ExecutionPolicy Bypass -File streamer-site\devserver.ps1 -Port 5500
```

Then open `http://localhost:5500/` in a browser. (Opening `index.html`
directly by double-click won't work: browsers block `site-data.json` and the
external `styles.css`/`script.js` on `file://` — the local server avoids that.)

If Node or Python are ever installed, `npx serve .` or `python -m http.server`
work too.

## Deploying on Render

A `render.yaml` Blueprint lives at the repo root, configured to serve this
folder as a Render **Static Site** (no build step).

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
