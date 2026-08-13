/**
 * HangingLogoStrip
 * A vertical striped ribbon with an "HH" logo clip at the top, meant to
 * sit visually above/behind a card so the card looks like it's hanging
 * from it. Purely decorative — `aria-hidden` — so it never affects
 * layout logic or (when used in the ID card preview) DOM export.
 */
export default function HangingLogoStrip({
  className = "",
  strapHeight = "clamp(4.5rem,10vh,7rem)",
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex flex-col items-center ${className}`}
    >
      {/* Logo clip */}
      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-mustard shadow-[3px_3px_0_#000]">
        <span className="font-display text-[11px] leading-none text-forest-dark">
          HH
        </span>

        {/* Grommet the ribbon threads through */}
        <span className="absolute -top-1.5 h-2 w-4 rounded-full border-2 border-ink bg-mustard" />
      </div>

      {/* Striped ribbon */}
      <div
        style={{ height: strapHeight }}
        className="hhgoa-ribbon -mt-0.5 w-4 rounded-b-sm border-x-2 border-ink/30 shadow-sm"
      />
    </div>
  );
}
