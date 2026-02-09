import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-6">
          Error 404
        </p>

        <h1 className="text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight dark:text-white mb-8">
          Lost in <br /> Minimalism.
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-12 leading-relaxed">
          The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back to something better at Outfytly.
        </p>

        <button
          onClick={() => navigate("/")}
          className="cursor-pointer group inline-flex items-center gap-3 px-10 py-5 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-md transition-all"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </button>
      </div>
    </div>
  );
}
