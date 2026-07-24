 
export function ProductGridSkeleton() {
  return (
    <div>
      {/* Results info skeleton */}
      <div className="mb-6">
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
 
      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-3/4 rounded-2xl bg-gray-200" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
 