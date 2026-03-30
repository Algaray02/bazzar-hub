import { Loader2 } from "lucide-react";

export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
        <p className="text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoader({ message = "Loading..." }) {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-fuchsia-500" />
      <span className="text-sm text-zinc-400">{message}</span>
    </div>
  );
}