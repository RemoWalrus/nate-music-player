import { useEffect } from "react";
import { Link } from "react-router-dom";

const ToditaComic = () => {
  useEffect(() => {
    document.title = "Todita Comic | Nathan Music";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm shadow-md py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="hover:opacity-80 transition-opacity inline-block">
            <img
              src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg"
              alt="Nathan Garcia Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
          TODITA
        </h1>
        <p className="text-xl sm:text-2xl font-light text-muted-foreground tracking-widest uppercase">
          A Webcomic Experience
        </p>
        <div className="mt-8 px-6 py-3 rounded-full border border-border bg-muted/50">
          <span className="text-sm text-muted-foreground tracking-wider uppercase">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
      </footer>
    </div>
  );
};

export default ToditaComic;
