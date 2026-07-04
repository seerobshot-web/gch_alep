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

## Asset shortlist (index-verified)

**Verification status:** this environment's egress proxy blocks direct
fetches to unsplash.com/pexels.com (403 policy denial), so every entry
below is **index-verified** — the exact canonical URL, page title, and
creator were confirmed against the live search index — but not
click-verified. Before download, open each link once to confirm frame,
orientation, and license (≈30 s each). ⚠ = caution noted.

### 1 · Home hero video background (16:9 loop, ember gradient overlay)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [pexels.com/video/people-praying-inside-the-church-9490591](https://www.pexels.com/video/people-praying-inside-the-church-9490591/) | Daniel Santos | Congregation praying indoors, gentle motion; add ember overlay for headline contrast |
| B | [pexels.com/video/people-in-a-prayer-gathering-3373659](https://www.pexels.com/video/people-in-a-prayer-gathering-3373659/) | Luis Quintero | Diverse crowd, hands raised, warm stage light — strongest palette fit |
| alt | [pexels.com/video/praying-in-church-28144955](https://www.pexels.com/video/praying-in-church-28144955/) | Daniel Santos | Newer upload (likely 4K); verify negative space |
| ⚠ alt | [pexels.com/video/people-in-a-prayer-meeting-2014793](https://www.pexels.com/video/people-in-a-prayer-meeting-2014793/) | Luis Quintero | Grayscale — only usable with an ember monochrome tint; otherwise reject |

### 2 · Home "Why GCH" photo stack (1 landscape + 1 square)

| Pick | Asset | Creator | Crop |
| --- | --- | --- | --- |
| A (landscape) | [unsplash.com/photos/jfU3_67YiwQ](https://unsplash.com/photos/jfU3_67YiwQ) — "Keep Em Up" | Edward Cisneros | 16:9/21:9 · warm stage glow, raised hands |
| B (landscape) | [unsplash.com/photos/QSa-uv4WJ0k](https://unsplash.com/photos/QSa-uv4WJ0k) | Edward Cisneros | Praise Chapel OC worship service — verify orientation |
| A (square) | [unsplash.com/photos/w3WN3l6KbGc](https://unsplash.com/photos/w3WN3l6KbGc) — "A moment in worship" | Joel Muniz | 1:1 · candid LA church moment |
| B (square) | [unsplash.com/photos/people-raise-their-hands-during-a-church-service-CtgQ4wlLoXU](https://unsplash.com/photos/people-raise-their-hands-during-a-church-service-CtgQ4wlLoXU) | (confirm on page) | 1:1 crop candidate |

Hand-pick backups: [@everythingcaptured](https://unsplash.com/@everythingcaptured) · [@jmuniz](https://unsplash.com/@jmuniz) · [@jacksharp_photography](https://unsplash.com/@jacksharp_photography)

### 3 · About "Founding Story" (soft golden-hour mood)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [unsplash.com/photos/people-near-buildings-during-golden-hour-Y667Q584o_E](https://unsplash.com/photos/people-near-buildings-during-golden-hour-Y667Q584o_E) — St Peter's at golden hour | Alberico Bartoccini | 3:2 street vista toward the dome, amber light |
| B | [unsplash.com/photos/sunlight-shining-through-a-stained-glass-window-in-a-church-cRVnk9Sn2cA](https://unsplash.com/photos/sunlight-shining-through-a-stained-glass-window-in-a-church-cRVnk9Sn2cA) | Jacob Bentzinger | Sunbeams through stained glass — likely portrait; confirm before a wide slot |
| alt | [unsplash.com/photos/sunlight-shining-through-the-stained-glass-windows-of-a-church-b0gNe0ano3c](https://unsplash.com/photos/sunlight-shining-through-the-stained-glass-windows-of-a-church-b0gNe0ano3c) | (confirm on page) | Multiple windows, tagged "prayer" |
| lead | [unsplash.com/@kfred](https://unsplash.com/@kfred) | Karl Fredrickson | 45-photo profile, church/sunset — browse for the steeple work |

### 4 · About mission hero (strong shapes for 60% ember multiply)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [pexels.com/photo/people-raising-hands-2019333](https://www.pexels.com/photo/people-raising-hands-2019333/) | Luis Quintero | Raised-arm crowd — silhouettes stay legible under heavy overlay |
| B | [pexels.com/photo/grayscale-photography-of-person-in-praying-hands-8748306](https://www.pexels.com/photo/grayscale-photography-of-person-in-praying-hands-8748306/) | (confirm on page) | Grayscale is ideal here — the ember overlay supplies all the color |
| alt | [unsplash.com/photos/a-silhouette-of-a-person-reaching-up-to-a-cross-yRc2xdK0zj8](https://unsplash.com/photos/a-silhouette-of-a-person-reaching-up-to-a-cross-yRc2xdK0zj8) | Jametlene Reskp | Single-figure silhouette + cross — strongest graphic shape of the set |

### 5 · Features "Uptime" header (clean data-center rows, duotone applied)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [unsplash.com/photos/cable-network-M5tzZtFCOfs](https://unsplash.com/photos/cable-network-M5tzZtFCOfs) — "Cable network" | Taylor Vick | The canonical real (non-render) data-center photo; neutral grays take the warm duotone predictably; 16:9→21:9 |
| ⚠ B | [unsplash.com/photos/a-server-room-with-rows-of-data-servers-_ov9HrXs9ms](https://unsplash.com/photos/a-server-room-with-rows-of-data-servers-_ov9HrXs9ms) | Planet Volumes | Bright, clean rows — but this account publishes 3D renders; confirm it doesn't read CGI after the filter |
| ⚠ alt | [unsplash.com/photos/servers-line-a-data-center-hallway-Uiy3_TW6m3M](https://unsplash.com/photos/servers-line-a-data-center-hallway-Uiy3_TW6m3M) | Planet Volumes | One-point hallway symmetry, ideal 21:9 composition; same render caution |

### 6 · Migration "We handle it" (warm/amber symmetrical rack)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| **A — top pick** | [unsplash.com/photos/brown-wooden-hallway-with-gray-metal-doors-lVZjvw-u9V8](https://unsplash.com/photos/brown-wooden-hallway-with-gray-metal-doors-lVZjvw-u9V8) | İsmail Enes Ayhan | Symmetrical control-cabinet aisle with a native warm amber cast — the "minimal duotone needed" case; 16:9/21:9 |
| ⚠ B | [unsplash.com/photos/dark-server-room-network-with-yellow-lights3d-rendering-ET7UmCN0_Vw](https://unsplash.com/photos/dark-server-room-network-with-yellow-lights3d-rendering-ET7UmCN0_Vw) | (confirm on page) | Perfect amber color story but self-described 3D render AND dark bg (conflicts with the no-dark-backgrounds token rule) — last resort |
| texture | [unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w](https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w) | Scott Rodgerson | Blue-cast cabling close-up — card/texture use only, fights the duotone as a hero |

### 7 · Migration full-bleed (golden-hour church exterior + steeple)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [unsplash.com/photos/a-church-with-a-steeple-at-sunset-5OmBr7pXho4](https://unsplash.com/photos/a-church-with-a-steeple-at-sunset-5OmBr7pXho4) | Aaron Burden | Backlit steeple at sunset, 3:2 with sky headroom for text panels |
| B | [unsplash.com/photos/a-church-steeple-with-the-sun-setting-behind-it-vEGOsXowTOM](https://unsplash.com/photos/a-church-steeple-with-the-sun-setting-behind-it-vEGOsXowTOM) | Nik (Wells, Somerset) | Sun directly behind steeple — strong flare glow under gradient overlays |
| ⚠ alt | [unsplash.com/photos/a-church-steeple-silhouettes-against-a-fiery-sunset-PAlReNuLI_Q](https://unsplash.com/photos/a-church-steeple-silhouettes-against-a-fiery-sunset-PAlReNuLI_Q) | Nikola Tomašić | "Fiery" may read red rather than amber — check against #A83E1B |
| alt | [pexels.com/photo/historic-church-with-tree-in-golden-hour-31239291](https://www.pexels.com/photo/historic-church-with-tree-in-golden-hour-31239291/) | amir modarres | Church + willow, pastoral/softer mood |

### 8 · Support / blog workspace (warm desk flatlay)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [unsplash.com/photos/RvPDe41lYBA](https://unsplash.com/photos/RvPDe41lYBA) | Grovemade | Laptop on walnut stand — signature warm wood, near-zero filter needed (legacy short slug; expect redirect) |
| B | [unsplash.com/photos/laptop-coffee-and-plant-on-a-wooden-desk-Kx4DzUnAIFg](https://unsplash.com/photos/laptop-coffee-and-plant-on-a-wooden-desk-Kx4DzUnAIFg) | Andrea Stuart (tentative) | Laptop + coffee + plant on wood, warm base |
| lead | [unsplash.com/@grovemade](https://unsplash.com/@grovemade) | Grovemade | Whole 7-photo set is on-brand |

### 9 · iPhone mockup for UI compositing

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [pexels.com/photo/space-gray-iphone-6-displaying-black-screen-279218](https://www.pexels.com/photo/space-gray-iphone-6-displaying-black-screen-279218/) | (confirm on page) | Fully black screen — cleanest compositing target |
| B | [pexels.com/photo/white-apple-iphone-on-wooden-table-48605](https://www.pexels.com/photo/white-apple-iphone-on-wooden-table-48605/) | Negative Space | Sunlit wood table; older model — use a bezel-agnostic screenshot crop |
| alt | [pexels.com/photo/person-holding-an-iphone-5053985](https://www.pexels.com/photo/person-holding-an-iphone-5053985/) · [5081926](https://www.pexels.com/photo/person-using-a-smartphone-5081926/) | cottonbro studio | Hand-held variants |

### 10 · Testimonials / trust strip (quiet, intimate prayer)

| Pick | Asset | Creator | Notes |
| --- | --- | --- | --- |
| A | [unsplash.com/photos/man-praying-OptEsFuZwoQ](https://unsplash.com/photos/man-praying-OptEsFuZwoQ) | Jack Sharp | Solitary man praying, muted grey tones — low contrast fits the strip; consider a warm tint toward #F6F2E7 |
| B | [unsplash.com/photos/a-group-of-seniors-holding-hands-and-praying-for-ukraine-together-in-church-community-center-0a6pF-saQN0](https://unsplash.com/photos/a-group-of-seniors-holding-hands-and-praying-for-ukraine-together-in-church-community-center-0a6pF-saQN0) | (confirm on page) | Seniors in a prayer circle — horizontal group composition |
| search | [unsplash.com/s/photos/group-prayer](https://unsplash.com/s/photos/group-prayer) · [people-praying-together](https://unsplash.com/s/photos/people-praying-together) | — | 900–2.4k results if neither lands |

## Sourcing checklist

- [ ] Every asset downloaded from its own Unsplash/Pexels page (license
      re-checked at download time)
- [ ] Tech shots exported twice: original + `-duotone` pre-baked variant
- [ ] Video loops compressed (H.264, ≤4 MB, muted, `playsinline loop`)
      with a poster JPEG in `images/hero/`
- [ ] Faces in candid congregation shots reviewed for prominence — prefer
      crowd-level framing over identifiable close-ups on marketing pages
- [ ] File names follow the convention; no spaces, no CDN query strings
