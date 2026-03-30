import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

export function AdminPageLayout({ 
  title, 
  subtitle, 
  children, 
  isLoading, 
  error, 
  errorMessage = "An error occurred",
  loadingMessage = "Loading..."
}) {
  if (isLoading) {
    return <PageLoader message={loadingMessage} />;
  }

  if (error) {
    return <PageError message={error.message || errorMessage} />;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-zinc-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}