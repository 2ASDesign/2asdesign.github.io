# 2AS Design Consultancy · Website

A static bilingual site (English / Arabic with a toggle). It has no build step, so it can be hosted free on GitHub Pages.

## Pages
| File | Content |
|---|---|
| `index.html` | Home: positioning, services, selected work, review teaser, method, founder, CTA |
| `review.html` | THE 2AS REVIEW: 3 levels, an anonymised review extract, the Ola Tower decision study |
| `partners.html` | Partner network: Al Saher, RS Studio, man™, Voom |
| `brief.html` | Interactive questionnaire (6 steps) with an automatic service recommendation |

## Before publishing: edit `assets/js/site.js` → `CONFIG`
- `email`: the new 2AS Gmail. Brief answers are sent there. Currently set to Sara's personal Gmail as a placeholder.
- `whatsapp`: number in international format, digits only.
- `linkedin` / `instagram`: company page links once they exist.

## How brief answers reach you
The form posts to **FormSubmit** (formsubmit.co), a free service that needs no server.
- The first submission sends an activation email to the address in `CONFIG.email`. Open it and click **Activate**. After that, every brief arrives as an email table.
- If sending fails, the visitor is offered a pre-filled WhatsApp message instead.

## Publish on GitHub Pages with a custom domain
1. Create a GitHub account, then a new repository, for example `2as-website`.
2. Upload the contents of this folder (`index.html` should sit at the top level of the repository).
3. Go to Settings → Pages → Source: `Deploy from a branch` → `main` / root → Save. The site appears at `https://<username>.github.io/2as-website/`.
4. Buy the domain (for example `2asdesign.com` or `2as.design`) from Namecheap, GoDaddy or Cloudflare.
5. In Settings → Pages → Custom domain, enter the domain. GitHub creates a `CNAME` file.
6. At the domain registrar, add these DNS records:
   - Four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - One `CNAME` record for `www` pointing to `<username>.github.io`.
7. Back in Settings → Pages, tick **Enforce HTTPS** once it becomes available.

## Images
Every portfolio image sits in `assets/img/` as WebP, at 1800 px max.

Credits are written under each image:
- MENA projects: Design Direction & Management.
- Yasmin Villa: with RS Studio.
- Landmark 901: designed with RS Studio, executed by Marhab.
- Stone Residence: Head of Technical Office & Design Team, Marhab.

The Ola Tower alternatives are labelled as AI visualisations.
