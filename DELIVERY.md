# Windleaf — launch & handover

Everything that has to happen between "the code is done" and "the client owns a
live, indexed site that receives enquiries". Work top to bottom; the ordering is
deliberate, because DNS propagation and search-console verification both have
waiting time built in and should be started early.

---

## 0. Blockers — the site cannot go live with these

| Item | Where | Status |
| ---- | ----- | ------ |
| Real contact email, phone, address | `src/app/contact/page.tsx` → `CONTACT_DETAILS` | placeholder (`info@windleaf.com`, `+91 9XXX927372`, `XYZ, India-61XX05`) |
| Enquiry form has no backend | `src/components/ContactForm.tsx` | validates, then discards — see §2 |
| Production domain | `NEXT_PUBLIC_SITE_URL` | unset |
| Founder photo | `/about` | monogram placeholder |
| Gallery images | `GALLERY` in `site.ts` | Unsplash stand-ins — **licence-check before launch** |
| Event dates / venue | Technology page banner | placeholders |

The form is the important one. Right now a visitor fills it in, sees "Thank
you", and nothing is sent anywhere. Do not launch in that state.

---

## 1. Domain

**Recommendation:** `windleafenergy.com` or similar — register it in the
*client's* account, not yours, and add yourself as a collaborator. Handing over
a domain later is far more painful than granting access now.

### Pick one canonical hostname and stick to it

Decide `www.` or apex, and redirect the other. On Vercel: add both domains,
mark one as primary, and Vercel issues the 308 automatically. Mixing the two
splits your ranking signals between what Google sees as two sites.

### DNS

| Record | Host | Value |
| ------ | ---- | ----- |
| A | `@` | `76.76.21.21` (Vercel apex) |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel shows the exact current values in **Project → Settings → Domains** —
use those rather than these, in case they have changed. TTL 3600 is fine.
Propagation is usually minutes, occasionally up to 48 hours.

### Then set the environment variable

In **Vercel → Settings → Environment Variables**, Production scope:

```
NEXT_PUBLIC_SITE_URL = https://windleafenergy.com
```

Redeploy after setting it. This one variable drives `metadataBase`, every
canonical tag, `sitemap.xml`, `robots.txt` and the JSON-LD — see
`src/lib/site-url.ts`. Until it is set, those fall back to Vercel's own
production hostname, which works but advertises `*.vercel.app` as canonical.

---

## 2. Email delivery

Two separate problems that get confused with each other. You need both.

### 2a. Receiving enquiries from the form

The form needs a backend. Three options, in the order I would consider them:

**Resend + a Next.js route handler — recommended.**
Purpose-built for transactional email, generous free tier (3,000/month), clean
API, and the sending domain is verified properly so mail actually lands. Roughly:

```ts
// src/app/api/enquiry/route.ts
import { Resend } from 'resend'

export async function POST(request: Request) {
  const data = await request.json()
  // Re-validate on the server. The client-side check in ContactForm.tsx is a
  // convenience for the user, not a security boundary — anything can POST here.
  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'Windleaf website <enquiries@windleafenergy.com>',
    to: 'info@windleafenergy.com',
    replyTo: data.email,
    subject: `Enquiry — ${data.name} (${data.country})`,
    text: /* formatted body */ '',
  })
  return Response.json({ ok: true })
}
```

Then point `ContactForm`'s submit handler at it. Keep `RESEND_API_KEY` in
Vercel's environment variables — never in the repo.

Add a honeypot field and a basic rate limit before launch. A public contact
form with no spam control fills an inbox within weeks.

**Formspree / Web3Forms** — no backend code at all, just a form action URL.
Genuinely fine for a brochure site and the fastest route to "it works". The
cost is that enquiries live in a third-party dashboard and the free tiers cap
submissions.

**SMTP via Nodemailer** — works, but you own deliverability, and mail sent
straight from a server without SPF/DKIM alignment routinely lands in spam.
Only worth it if the client insists on their own mail server.

### 2b. Mailboxes at the new domain

Separate from the above. `info@windleafenergy.com` has to actually exist.

- **Google Workspace** — ~$6/user/month, what most clients expect.
- **Zoho Mail** — free tier for a single domain, popular for small teams.
- Whichever you pick, add its MX records **before** pointing anything else, and
  do not let a website host's default MX records overwrite them.

### 2c. Authentication records — do not skip these

Add to DNS once the sending domain is chosen. Without them, mail from the site
is unsigned and filtered aggressively:

- **SPF** — one TXT record listing every service allowed to send as you
  (mail host *and* Resend). One SPF record only; multiple records is a hard
  fail, so merge them.
- **DKIM** — the CNAME/TXT records your provider gives you.
- **DMARC** — start permissive, tighten later:
  `v=DMARC1; p=none; rua=mailto:dmarc@windleafenergy.com`

Verify with [mail-tester.com](https://www.mail-tester.com) — aim for 9/10 or
better before handing over.

---

## 3. Indexing

Already handled in code:

- `src/app/sitemap.ts` → `/sitemap.xml`, all six routes
- `src/app/robots.ts` → `/robots.txt`, referencing the sitemap
- `metadataBase` + per-page `alternates.canonical` on every route
- Organization and WebSite JSON-LD in `layout.tsx`
- **Preview deployments serve `noindex`** — both in `robots.txt` and as a meta
  tag. This matters: a crawled Vercel preview URL competes with the live site
  for identical content. Confirm after launch that production does *not*
  noindex, by loading `https://<domain>/robots.txt` and expecting `Allow: /`.

Manual steps at launch:

1. **Google Search Console** → add the domain property, verify via DNS TXT
   (survives host changes; the HTML-file method does not).
2. Submit `https://<domain>/sitemap.xml`.
3. **URL Inspection → Request indexing** on the homepage. This takes days to
   weeks; do it on launch day, not a month later.
4. **Bing Webmaster Tools** — accepts a Search Console import, ~2 minutes.
5. Check coverage again after a week for crawl errors.

---

## 4. SEO

### Already in place

Unique `title` and `description` per route (`SEO` in `src/content/site.ts`),
one `h1` per page, semantic headings, real alt text, canonical URLs, Open Graph
and Twitter card metadata, static pre-rendering of all six routes, and copy that
ships as HTML rather than being assembled client-side.

### Worth doing before launch

- **An OG image.** There is currently no `openGraph.images`, so links shared on
  LinkedIn or WhatsApp render as a bare text box. A 1200x630 PNG at
  `public/og.png` plus `images: ['/og.png']` in `layout.tsx` fixes it. For a B2B
  consultancy where LinkedIn is the main channel, this is the highest-value
  item on this list.
- **Fill the placeholder contact details.** Google reads NAP (name, address,
  phone) for local and professional-services results; `XYZ, India-61XX05`
  actively harms that.
- **Google Business Profile**, if there is a physical office.
- **`LocalBusiness` address fields** in the JSON-LD once the real address
  exists — add `address` and `telephone` to `ORGANIZATION_JSONLD`.

### Worth doing after launch

- Per-service pages instead of anchors. `/services` currently holds all eight
  services as `#anchors` on one long page, so they compete for one URL. Splitting
  "Technical Due Diligence" into its own page is what would let it rank for that
  term. This is a content decision, not a technical one — raise it with the
  client rather than doing it unilaterally.
- A short case-study or insight post every month or two. Nothing moves a
  consultancy site more than pages that answer the questions clients search for.
- Add `FAQPage` JSON-LD if an FAQ section gets written.

### Do not bother with

Keyword density, meta keywords, or an SEO plugin. The technical foundation here
is already better than most agency output; remaining gains are in content and
inbound links.

---

## 5. Pre-handover checklist

```
[ ] npm run typecheck && npm run build     — both clean
[ ] All §0 placeholders replaced
[ ] Form submits and an email arrives at the real inbox
[ ] Form spam protection in place
[ ] NEXT_PUBLIC_SITE_URL set in Vercel production
[ ] https://<domain>/robots.txt shows "Allow: /"
[ ] https://<domain>/sitemap.xml lists the real domain
[ ] View source: canonical tags point at the real domain
[ ] Search Console verified, sitemap submitted, homepage indexing requested
[ ] SPF, DKIM, DMARC pass mail-tester
[ ] OG image renders (test with LinkedIn Post Inspector)
[ ] Lighthouse: mobile and desktop
[ ] Checked on a real iPhone and a real Android, not just devtools
[ ] Gallery image licences confirmed
[ ] Domain, Vercel project and email all owned by the client's accounts
```

## 6. What to hand the client

Repository access, the Vercel project transferred to their account, the domain
registrar login, a one-page note on editing copy (`src/content/site.ts` is the
single source of truth — they do not need to touch JSX), Search Console access,
and whatever credentials the email service uses.
