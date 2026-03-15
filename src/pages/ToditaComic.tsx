import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TODITA_LETTERS = ["T", "O", "D", "I", "T", "A"];
const UNIVERSE_LETTERS = ["U", "N", "I", "V", "E", "R", "S", "E"];
const PIXEL_COLS = 20;
const PIXEL_ROWS = 12;

type Phase = "idle" | "swipe" | "letters" | "ready" | "swipe2" | "universe";

const ToditaComic = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [universeLetters, setUniverseLetters] = useState(0);
  const [swipe2Progress, setSwipe2Progress] = useState<boolean[]>(
    Array(PIXEL_ROWS * PIXEL_COLS).fill(false)
  );
  const scrollTriggered = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Todita Comic | Nathan Music";
    const t1 = setTimeout(() => setPhase("swipe"), 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "swipe") {
      const t = setTimeout(() => setPhase("letters"), PIXEL_COLS * 40 + 400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "letters" && visibleLetters < TODITA_LETTERS.length) {
      const t = setTimeout(() => setVisibleLetters((v) => v + 1), 250);
      return () => clearTimeout(t);
    }
    if (phase === "letters" && visibleLetters >= TODITA_LETTERS.length) {
      const t = setTimeout(() => setPhase("ready"), 300);
      return () => clearTimeout(t);
    }
  }, [phase, visibleLetters]);

  // Scroll listener for second swipe
  const handleScroll = useCallback(() => {
    if (phase === "ready" && !scrollTriggered.current) {
      scrollTriggered.current = true;
      setPhase("swipe2");
    }
  }, [phase]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleScroll();
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY < touchStartY - 30) handleScroll();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleScroll]);

  // Second pixelated swipe animation
  useEffect(() => {
    if (phase === "swipe2") {
      const total = PIXEL_ROWS * PIXEL_COLS;
      let count = 0;
      const reveal = () => {
        setSwipe2Progress((prev) => {
          const next = [...prev];
          // Reveal column by column with row jitter
          const col = count % PIXEL_COLS;
          const batchStart = Math.floor(count / PIXEL_COLS) * PIXEL_COLS;
          for (let row = 0; row < PIXEL_ROWS; row++) {
            const idx = row * PIXEL_COLS + (count % PIXEL_COLS);
            const jitteredCount = count + (row % 3);
            if (jitteredCount >= 0 && idx < total) {
              next[idx] = true;
            }
          }
          return next;
        });
        count++;
        if (count < PIXEL_COLS + 3) {
          setTimeout(reveal, 40);
        } else {
          setTimeout(() => setPhase("universe"), 400);
        }
      };
      reveal();
    }
  }, [phase]);

  // Universe letters reveal
  useEffect(() => {
    if (phase === "universe" && universeLetters < UNIVERSE_LETTERS.length) {
      const t = setTimeout(() => setUniverseLetters((v) => v + 1), 200);
      return () => clearTimeout(t);
    }
  }, [phase, universeLetters]);

  const showTodita = phase === "letters" || phase === "ready";
  const showUniverse = phase === "universe";
  const darkRedBg = "hsl(0, 72%, 30%)";
  const redBg = "hsl(0, 72%, 47%)";

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* First pixelated swipe - red */}
      {phase !== "idle" && (
        <div className="absolute inset-0 z-0 grid" style={{
          gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
        }}>
          {Array.from({ length: PIXEL_ROWS * PIXEL_COLS }).map((_, i) => {
            const col = i % PIXEL_COLS;
            const row = Math.floor(i / PIXEL_COLS);
            const delay = col * 0.04 + (row % 3) * 0.02;
            return (
              <motion.div
                key={`bg1-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.15, ease: "easeOut" }}
                className="w-full h-full"
                style={{ backgroundColor: redBg }}
              />
            );
          })}
        </div>
      )}

      {/* Second pixelated swipe - darker red */}
      {(phase === "swipe2" || phase === "universe") && (
        <div className="absolute inset-0 z-[1] grid" style={{
          gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
        }}>
          {swipe2Progress.map((visible, i) => (
            <div
              key={`bg2-${i}`}
              className="w-full h-full transition-all duration-150"
              style={{
                backgroundColor: visible ? darkRedBg : "transparent",
                transform: visible ? "scale(1)" : "scale(0)",
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-background py-4 px-6 shadow-md">
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
        {/* TODITA */}
        {(showTodita || phase === "swipe" || phase === "swipe2") && (
          <h1
            className="text-[20vw] leading-[0.85] font-black"
            style={{
              fontFamily: "laca, sans-serif",
              fontWeight: 900,
              letterSpacing: "-0.06em",
            }}
          >
            {TODITA_LETTERS.map((letter, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 1.4, y: 30 }}
                animate={
                  (showTodita || phase === "swipe2") && idx < visibleLetters
                    ? { opacity: phase === "swipe2" ? 0 : 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 1.4, y: 30 }
                }
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  color: "white",
                  textShadow: "3px 3px 0px hsla(0, 72%, 25%, 0.35)",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        )}

        {/* UNIVERSE */}
        {showUniverse && (
          <h1
            className="text-[12.5vw] leading-[0.85]"
            style={{
              fontFamily: "laca, sans-serif",
              fontWeight: 400,
              letterSpacing: "-0.06em",
            }}
          >
            {UNIVERSE_LETTERS.map((letter, idx) => (
              <motion.span
                key={`u-${idx}`}
                initial={{ opacity: 0, scale: 1.4, y: 30 }}
                animate={
                  idx < universeLetters
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 1.4, y: 30 }
                }
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  color: "white",
                  textShadow: "3px 3px 0px hsla(0, 72%, 15%, 0.35)",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        )}
      </div>

      {/* Scroll hint */}
      {phase === "ready" && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-sm" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
        © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
      </footer>
    </div>
  );
};

export default ToditaComic;
