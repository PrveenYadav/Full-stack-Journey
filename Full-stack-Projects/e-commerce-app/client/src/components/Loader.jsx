
export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
    
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
          <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-[var(--brand)] animate-spin absolute inset-0"></div>
        </div>

        <h1 className="text-2xl tracking-[0.3em] font-light text-gray-900 dark:text-white animate-pulse">
          OUTFYTLY
        </h1>

      </div>
    </div>
  );
}

