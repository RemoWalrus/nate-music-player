import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["T", "O", "D", "I", "T", "A"];
const PIXEL_COLS = 20;
const PIXEL_ROWS = 12;

const ToditaComic = () => {
  const [phase, setPhase] = useState<"idle" | "swipe" | "letters">("idle");
  const [visibleLetters, setVisibleLetters] = useState(0);

  useEffect(() => {
    document.title = "Todita Comic | Nathan Music";
    // Start animation
    const t1 = setTimeout(() => setPhase("swipe"), 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "swipe") {
      // After swipe completes, start showing letters
      const t = setTimeout(() => setPhase("letters"), PIXEL_COLS * 40 + 400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "letters" && visibleLetters < LETTERS.length) {
      const t = setTimeout(() => setVisibleLetters((v) => v + 1), 250);
      return () => clearTimeout(t);
    }
  }, [phase, visibleLetters]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Pixelated swipe overlay */}
      {(phase === "swipe" || phase === "letters") && (
        <div className="absolute inset-0 z-0 grid" style={{
          gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
        }}>
          {Array.from({ length: PIXEL_ROWS * PIXEL_COLS }).map((_, i) => {
            const col = i % PIXEL_COLS;
            const row = Math.floor(i / PIXEL_COLS);
            // Swipe from left to right, with slight row offset for pixelated feel
            const delay = col * 0.04 + (row % 3) * 0.02;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay,
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="w-full h-full"
                style={{ backgroundColor: "hsl(0, 72%, 47%)" }}
              />
            );
          })}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-transparent py-4 px-6">
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6 relative z-10">
        <h1
          className="text-[20vw] leading-[0.85] font-black"
          style={{
            fontFamily: "laca, sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          {LETTERS.map((letter, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 1.4, y: 30 }}
              animate={
                phase === "letters" && idx < visibleLetters
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 1.4, y: 30 }
              }
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                color: "hsl(0, 72%, 35%)",
                WebkitTextStroke: "2px white",
                paintOrder: "stroke fill",
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-sm" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
        © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
      </footer>
    </div>
  );
};

export default ToditaComic;
