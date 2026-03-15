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
        <h1 className="text-[20vw] leading-[0.85] font-black text-foreground" style={{ fontFamily: 'laca, sans-serif', fontWeight: 900, letterSpacing: '-0.04em' }}>
          TODITA
        </h1>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
      </footer>
    </div>
  );
};

export default ToditaComic;
