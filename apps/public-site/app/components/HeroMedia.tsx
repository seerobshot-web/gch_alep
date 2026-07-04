/**
 * Full-bleed hero with an optional background video loop or photo, per the
 * IMAGE_SOURCING_GUIDE rules: media sits at low opacity beneath an
 * ember-core → transparent gradient so white headline text stays
 * AA-contrast-compliant. Assets live in /public/images (never hotlinked
 * from Unsplash/Pexels CDNs).
 */
export function HeroMedia({
  videoSrc,
  posterSrc,
  imageSrc,
  imageAlt = '',
  mediaOpacity = 0.2,
  children
}: {
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  mediaOpacity?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ember-core">
      {videoSrc ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: mediaOpacity }}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imageSrc ? (
        // plain <img>: hero art is local, full-bleed, and above the fold —
        // next/image adds nothing here and complicates object-cover sizing
        <img
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: mediaOpacity }}
          src={imageSrc}
          alt={imageAlt}
        />
      ) : null}
      {/* ember → transparent gradient keeps white text readable over motion */}
      <div className="absolute inset-0 bg-gradient-to-r from-ember-core via-ember-core/70 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 text-white">{children}</div>
    </section>
  );
}
