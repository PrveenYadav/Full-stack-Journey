import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 px-4 transition-colors duration-300 dark:bg-black">
      <div className="max-w-md text-center">
        <h2 className="text-5xl font-extrabold text-zinc-200 dark:text-zinc-800 tracking-tight">
          404
        </h2>
        
        <h1 className="mt-2 text-4xl font-bold text-zinc-900 dark:text-white">
            Not Found
        </h1>
        
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-md">
          Sorry, we couldn’t find the page or post you’re looking for. It might have been deleted or moved.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-md bg-black px-8 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-lg"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}