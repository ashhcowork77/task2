/**
 * Loading skeleton for Activities list page
 * Displays placeholder content while data is being fetched
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] px-5 py-14 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 md:grid-cols-12">
          <div className="space-y-5 md:col-span-7">
            <div className="h-3 w-32 animate-pulse bg-black/10" />
            <div className="h-16 w-full max-w-2xl animate-pulse bg-black/10" />
            <div className="h-16 w-3/4 animate-pulse bg-black/10" />
          </div>
          <div className="space-y-3 md:col-span-4 md:col-start-9 md:pt-14">
            <div className="h-4 w-full animate-pulse bg-black/10" />
            <div className="h-4 w-4/5 animate-pulse bg-black/10" />
            <div className="h-4 w-2/3 animate-pulse bg-black/10" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white">
              <div className="aspect-square animate-pulse bg-black/10" />
              <div className="space-y-4 p-6">
                <div className="h-7 w-3/4 animate-pulse bg-black/10" />
                <div className="h-4 w-full animate-pulse bg-black/10" />
                <div className="h-4 w-2/3 animate-pulse bg-black/10" />
                <div className="h-px bg-black/10" />
                <div className="flex gap-4">
                  <div className="h-4 w-20 animate-pulse bg-black/10" />
                  <div className="h-4 w-24 animate-pulse bg-black/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
