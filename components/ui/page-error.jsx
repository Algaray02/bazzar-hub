import { AlertCircle } from "lucide-react";

export function PageError({ message = "An error occurred", onRetry = null }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="font-bold text-red-400 mb-2">Error</h2>
        <p className="text-sm text-red-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
}

export function InlineError({ message = "An error occurred" }) {
  return (
    <div className="text-red-400 text-sm flex items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}