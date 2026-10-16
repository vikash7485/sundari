# Sundari Jewellers – website + admin panel

**सुन्दरी ज्वेलर्स** · Mahadev Chowk, Tajpur Road, Samastipur, Bihar

A mobile-first, bilingual (English / हिंदी) website for the shop, plus a password-protected
admin panel at **`/admin`** where the owner adds products, updates the daily gold/silver rate,
uploads shop photos and edits timings.

- **Visitor site:** React 19 + Tailwind CSS 4 (Vite)
- **Database, photo storage and login:** Supabase (free plan is enough)
- **Demo mode:** until Supabase keys are added, the site runs on built-in sample data and admin
  changes are saved only in your own browser – handy for trying things out.

---

## 1. Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:5173 – the site works immediately in **demo mode** with 12 sample products
(all marked **SAMPLE**). Admin: http://localhost:5173/admin – the demo password is
`VITE_DEMO_ADMIN_PASSWORD` in `.env` (default `sundari-demo`).

## 2. Connect Supabase (so every visitor sees the owner's products)

1. Create a free project at <https://supabase.com> (region: **Mumbai** for speed in India).
2. **SQL Editor → New query** → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   Then do the same with [`supabase/seed.sql`](supabase/seed.sql) (categories, settings, 12 sample products, 6 sample photos).
3. **Authentication → Users → Add user → Create new user**: the owner's email + a strong password,
   tick **Auto Confirm User**.
4. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up”.
5. Back in **SQL Editor**, make that email an admin:
   ```sql
   insert into public.admins (email) values ('owner-email@example.com');
   ```
6. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key**.
7. Copy `.env.example` to `.env` and fill in:
   ```ini
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...            # or sb_publishable_...
   VITE_ADMIN_EMAIL=owner-email@example.com # login screen pre-fills it, owner only types the password
   VITE_SITE_URL=https://www.your-domain.in
   ```
8. Restart `npm run dev`. The demo banner in `/admin` disappears once Supabase is connected.

Security: anyone can *read* products/rates (that's the website), but only logged-in emails listed in
the `admins` table can add, edit or delete anything – this is enforced by the database (Row Level
Security), not just the website.

## 3. Put it online

Any static host works. Easiest: **Netlify** or **Vercel** (both free).

- Build command: `npm run build` · Output folder: `dist`
- Add the same `VITE_…` values from `.env` as environment variables in the host's settings.
- `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included so links like `/product/1005` work.
- Set `VITE_SITE_URL` to the real domain – it's used for the WhatsApp/Facebook preview image,
  Google's shop info and `sitemap.xml`.

After going live:

1. Create/claim the shop on **Google Business Profile** (Google Maps).
2. In `/admin → Shop Settings → Google Maps & reviews`, paste the **“Ask for reviews” link** and
   (optional) the shop's exact Google Maps name so the map pin lands on the shop.
3. Add the site to **Google Search Console** and submit `https://your-domain/sitemap.xml`.

## 4. Owner's daily use (`/admin`, works on a phone)

| Task | Where |
| --- | --- |
| Update today's gold & silver rate | **Rates** – type 24K, tap *Auto-fill* for 22K/18K, add silver, **Update rate** |
| Add a product | **Products → +** – take photos with the camera, fill title / weight / price, **Add product** |
| Mark sold out | **Products** – tap the green *In stock* pill |
| Shop photos | **Gallery** – select many photos at once |
| Timings, “Why Choose Us”, banner, logo | **Settings** |
| Remove all sample items | **Home (Dashboard) → Delete samples** |

Every photo is resized and converted to **WebP** on the phone before upload (a 5 MB camera photo
becomes ~150 KB), and the site lazy-loads images, so pages stay fast on mobile data.

Each product gets a code like **SJ-1005**. The WhatsApp button sends:
*“Namaste, mujhe ye product pasand aaya: {title} (Code: SJ-1005). Kya ye available hai?”*

## 5. Photos to upload

Everything below is uploaded from `/admin` – no code changes needed.

| What | How many | Tips | Where in admin |
| --- | --- | --- | --- |
| **Hero banner** | 1 | Wide (landscape) bridal jewellery photo, at least 2000 × 1100 px. Keep the jewellery on the **right half** – the shop name sits on the left on computers and at the bottom on phones. | Settings → Home page banner |
| **Logo** *(optional)* | 1 | Square, at least 400 × 400 px, shown in a circle. Without it, the gold “सु” monogram is used. | Settings → Logo |
| **Shop gallery** | 6–12 | Shop front with signboard, each display counter (gold, silver, bridal), a wide interior shot, the workshop/craftsmen (supports “own manufacturing”), customer seating. Mix of portrait and landscape. | Gallery |
| **Products** | 1–5 per product | Plain background (cream cloth or black velvet), daylight, fill the frame. First photo = cover; add a close-up and one worn/on-stand photo. | Products → Add product |
| **Category tiles** *(optional)* | up to 13 | Square photo per category. Without them, gold line-art icons are shown. | Categories → tap the round icon |
| Share preview | done | `public/og-image.png` is already designed. Replace it later with a photo version if you like (1200 × 630). | file in `public/` |

## 6. Changing fixed text

- Shop name, phones, address, WhatsApp number: [`src/config.js`](src/config.js)
- All English/Hindi interface text: [`src/i18n/strings.js`](src/i18n/strings.js)
- Colours and fonts: the `@theme` block at the top of [`src/index.css`](src/index.css)
- First language for new visitors: `DEFAULT_LANG` in `src/config.js` (visitors' own choice is remembered)

## Project layout

```
src/
  pages/          Home, Collection, ProductDetail, GalleryPage, About, Contact
  components/     Header, Hero, RateStrip, CategoryGrid, ProductCard, Lightbox, forms…
  admin/          Admin panel (lazy-loaded) + backends/supabase.js & backends/local.js (demo)
  lib/            api.js (public reads via Supabase REST), image.js (WebP compression), seo.js…
  data/           seed.js (sample data), icons.js (category line icons)
supabase/         schema.sql, seed.sql
scripts/          generate-samples.mjs (sample artwork), make-seed-sql.mjs, og-image.html
```

Regenerate sample artwork / seed SQL after editing `src/data/seed.js`:

```bash
npm run samples
node scripts/make-seed-sql.mjs
```
