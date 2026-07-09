
export function SkeletonProductCard({ aspect = "aspect-[3/4]" }) {
  return (
    <div className="bg-white border border-accent rounded-md overflow-hidden flex flex-col animate-pulse">
      {/* image box */}
      <div className={`${aspect} bg-ink/10 relative overflow-hidden shimmer`}>
        {/* woven-label ghost */}
        <div className="absolute top-2 left-2 h-5 w-20 rounded-sm border border-dashed border-ink/20 bg-canvas/60" />
      </div>

      <div className="p-4 space-y-3">
        {/* title + meta lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-ink/10 rounded w-3/4" />
          <div className="h-2.5 bg-ink/10 rounded w-1/2" />
        </div>

        {/* spec rows behind dashed divider */}
        <div className="border-t border-dashed border-accent pt-2.5 space-y-1.5">
          <div className="h-2.5 bg-ink/10 rounded w-2/3" />
          <div className="h-2.5 bg-ink/10 rounded w-1/3" />
          <div className="h-2.5 bg-ink/10 rounded w-4/5" />
        </div>

        {/* price footer: cost hairline + price pill */}
        <div className="border-t border-accent pt-2.5 flex items-center justify-between">
          <div className="h-2.5 bg-ink/10 rounded w-14" />
          <div className="h-5 bg-ink/10 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonGrid({
  count = 8,
  aspect = "aspect-[3/4]",
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}) {
  return (
    <div className={`grid ${cols} gap-6`} aria-busy="true" aria-label="Loading results">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} aspect={aspect} />
      ))}
    </div>
  );
}
