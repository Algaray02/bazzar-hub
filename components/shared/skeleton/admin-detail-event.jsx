import { Card, CardContent } from "@/components/ui/card";

const SkeletonCard = () => (
  <Card className="bg-[#0F0F11] border-white/10 animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-zinc-800 rounded w-24" />
          <div className="h-8 bg-zinc-800 rounded w-32" />
        </div>
        <div className="p-3 bg-fuchsia-500/10 rounded-xl">
          <div className="w-6 h-6 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="h-3 bg-zinc-800 rounded w-40 mt-4" />
    </CardContent>
  </Card>
);

const SkeletonTable = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-zinc-800/50 rounded animate-pulse" />
    ))}
  </div>
);

export const AdminDetailEventSkeleton = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
            <div className="h-5 bg-zinc-800 rounded w-24 animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-zinc-800 rounded w-36 animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-12 bg-zinc-800 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonTable />
        </div>
        <div className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="aspect-video bg-zinc-800 rounded-lg" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-800 rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};