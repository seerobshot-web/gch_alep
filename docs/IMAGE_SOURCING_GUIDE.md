# IMAGE_SOURCING_GUIDE — Faith × Technology visual assets

Brand: Glory Cloud Hosts (GCH). This guide governs every photo/video used
on the public site. All sources: **Unsplash.com and Pexels.com only** —
free for commercial use, no attribution required. Always download from the
asset's own page (CDN hotlinks expire per-session), then drop the file
into `apps/public-site/public/images/` per the naming convention below.

## Palette rules for photography

| Token | Hex | Photography pairing |
| --- | --- | --- |
| Cloudlight (base bg) | `#F6F2E7` | Golden-hour, sunset church exteriors, warm indoor worship light. Never untreated cool/blue tech shots. |
| Ember Core (high-emphasis) | `#A83E1B` | Solid overlay 40–60% opacity, multiply blend, over any photo for Mission-hero / CTA sections. |
| Verdigris Sky (info) | `#3E6E64` | Outdoor greenery, fellowship photos; or as the shadow tone in duotones. 60% wash over data-center shots on Pricing. |
| Gradient Ember (gold→ember) | decorative | Icon fills, dividers, stained-glass motif ONLY. Never a photo wash under text. |

**Duotone recipe for cool server photography** (converts blue/cyan casts
to amber/rust so tech shots sit next to cloudlight/ember sections):

```css
filter: sepia(0.4) saturate(1.1) hue-rotate(-15deg) brightness(1.05) contrast(1.1);
```

**Hero video rules:** 8–15 s seamless loops, 16:9 landscape, played at
15–25% opacity behind hero text with an `--ember-core → transparent`
gradient overlay so white text stays AA-compliant. Prefer repeating gentle
motion (candle flame, slow crowd sway, prayer circle); calm left or right
negative space for the headline; avoid bright stage LEDs, blue casts, fast
camera moves. If no perfect loop exists, take a 20–30 s clip and cross-fade
the ends into a 10 s loop.

## Directory + naming convention

```
apps/public-site/public/images/
  hero/         home-hero-poster.jpg          (video poster frames)
  video/        home-hero-loop-16x9.mp4       (compressed loops, <4 MB)
  worship/      worship-gathering-16x9-cisneros.jpg
  architecture/ church-steeple-golden-3x2-fredrickson.jpg
  tech/         server-rows-21x9-vick-duotone.jpg   (-duotone = pre-baked filter)
  workspace/    desk-flatlay-4x3-grovemade.jpg
  mockups/      iphone-blank-9x16-cottonbro.jpg
```

Pattern: `{subject}-{ratio}-{creator}[-duotone].{ext}` — lowercase, hyphens.

## Wireframe → asset map

| Wireframe | Placement | Visual treatment |
| --- | --- | --- |
| Home (full scroll) | Hero | 8–15 s video loop, gentle congregation motion, 16:9, ember-to-transparent gradient overlay |
| Home | Why GCH (2-col stack) | Top landscape: diverse worship gathering · Bottom square: candid pastor/volunteer support |
| Home | Features grid | Gradient-ember icon fills on `#F6F2E7` — no photography |
| About | Mission hero | High-contrast candid prayer hands, Ember Core overlay 60% multiply |
| About | Our Story (right col) | Golden-hour mood — church silhouette or stained glass |
| Features | Hero/header | Wide data-center shot with the duotone recipe applied |
| Migration | Hero | Dark server room with amber cast (minimal duotone needed) |
| Migration | Full-bleed section | Golden-hour church exterior w/ steeple, 3:2, sage text panels overlapping |
| Support | Hero | Warm desk flatlay (laptop + phone) anchoring the "Real people" headline |
| Blog | Featured post (left) | Worship/praise photography with negative space, no text-heavy frames |
| Pricing | Optional bg wash | Solid colors preferred; at most a 5% opacity golden-hour exterior wash behind the header. 21:9 data-center shot w/ verdigris 60% wash if a photo band is used |
| Contact | Form layout | NO photography — verdigris typography and UI styling only |
| Testimonials/trust strips | Accent | Quiet small-group prayer, horizontal, soft mask/rounded corners |

## Copy-paste Google search strings (scoped to approved platforms)

Video loops (Hero & About):

```
site:pexels.com/video OR site:unsplash.com intitle:"worship" OR intitle:"praise" "4k" OR "HD"
site:pexels.com/video intitle:"praying" "hands" "indoor" "landscape"
site:pexels.com/video "church" "golden hour" "motion"
worship gathering golden hour 8s loop site:pexels.com OR site:unsplash.com
prayer circle gentle motion 10s loop site:pexels.com OR site:unsplash.com
congregation hands raised slow motion 12s loop site:pexels.com OR site:unsplash.com
church exterior golden hour 10s loop site:pexels.com OR site:unsplash.com
candlelight prayer 8s loop site:pexels.com OR site:unsplash.com
choir singing gentle motion 10s loop site:pexels.com OR site:unsplash.com
```

Photography (faith & community):

```
site:unsplash.com "worship gathering" candid diverse congregation
site:unsplash.com OR site:pexels.com "church exterior" steeple "golden hour"
site:unsplash.com "people praying" intimate small group
site:unsplash.com "church volunteers" serving candid
site:pexels.com "pastor support" counseling prayer candid
site:pexels.com "church community" outdoors fellowship picnic
```

Photography (tech & mockups):

```
site:unsplash.com "server rack" OR "data center" clean symmetrical
site:unsplash.com "dark server room" "yellow lights" OR "amber"
site:pexels.com "iphone mockup" "blank screen" desk warm flatlay
site:unsplash.com "workspace" laptop phone "coffee" warm tones
site:unsplash.com "data center" wide aisle warm lighting
```

## Verified asset shortlist

<!-- FILLED FROM VERIFIED SOURCING RUN — see section below -->

## Sourcing checklist

- [ ] Every asset downloaded from its own Unsplash/Pexels page (license
      re-checked at download time)
- [ ] Tech shots exported twice: original + `-duotone` pre-baked variant
- [ ] Video loops compressed (H.264, ≤4 MB, muted, `playsinline loop`)
      with a poster JPEG in `images/hero/`
- [ ] Faces in candid congregation shots reviewed for prominence — prefer
      crowd-level framing over identifiable close-ups on marketing pages
- [ ] File names follow the convention; no spaces, no CDN query strings
