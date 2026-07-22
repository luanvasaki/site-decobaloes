export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl animate-pulse">
      <div className="max-w-md mx-auto text-center mb-12">
        <div className="h-3 w-24 bg-primary-100 rounded-full mx-auto mb-4" />
        <div className="h-8 w-3/4 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl mx-auto mb-3" />
        <div className="h-4 w-1/2 bg-primary-50 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50"
          />
        ))}
      </div>
    </div>
  )
}
