import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TODITA_LETTERS = ["T", "O", "D", "I", "T", "A"];
const UNIVERSE_LETTERS = ["U", "N", "I", "V", "E", "R", "S", "E"];
const COMIC_LETTERS = ["C", "O", "M", "I", "C"];
const COMING_SOON_LINE1 = ["C", "O", "M", "I", "N", "G"];
const COMING_SOON_LINE2 = ["S", "O", "O", "N"];
const PIXEL_COLS = 20;
const PIXEL_ROWS = 12;

type Phase = "idle" | "swipe" | "todita" | "ready" | "swipe2" | "universe" | "ready2" | "swipe3" | "comic" | "ready3" | "swipe4" | "comingsoon";

const PixelGrid = ({ progress, color }: { progress: boolean[]; color: string }) => (
  <div className="absolute inset-0 grid" style={{
    gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
    gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
  }}>
    {progress.map((visible, i) => (
      <div
        key={i}
        className="w-full h-full transition-all duration-150"
        style={{
          backgroundColor: visible ? color : "transparent",
          transform: visible ? "scale(1)" : "scale(0)",
        }}
      />
    ))}
  </div>
);

const AnimatedWord = ({
  letters,
  visible,
  fontSize,
  fontWeight,
  shadow,
}: {
  letters: string[];
  visible: number;
  fontSize: string;
  fontWeight: number;
  shadow: string;
}) => (
  <>
    {letters.map((letter, idx) => (
      <motion.span
        key={idx}
        initial={{ opacity: 0, scale: 1.4, y: 30 }}
        animate={
          idx < visible
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 1.4, y: 30 }
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          color: "white",
          textShadow: shadow,
          display: "inline-block",
          fontFamily: "laca, sans-serif",
          fontWeight,
          fontSize,
          lineHeight: 0.85,
          letterSpacing: "-0.06em",
        }}
      >
        {letter}
      </motion.span>
    ))}
  </>
);

const runSwipe = (
  direction: "ltr" | "rtl",
  setProgress: React.Dispatch<React.SetStateAction<boolean[]>>,
  onDone: () => void
) => {
  let count = 0;
  const reveal = () => {
    setProgress((prev) => {
      const next = [...prev];
      const col = direction === "ltr" ? count : PIXEL_COLS - 1 - count;
      for (let row = 0; row < PIXEL_ROWS; row++) {
        const idx = row * PIXEL_COLS + col;
        if (col >= 0 && col < PIXEL_COLS && idx >= 0 && idx < PIXEL_ROWS * PIXEL_COLS) {
          next[idx] = true;
        }
      }
      return next;
    });
    count++;
    if (count < PIXEL_COLS + 3) {
      setTimeout(reveal, 40);
    } else {
      setTimeout(onDone, 400);
    }
  };
  reveal();
};

const ToditaComic = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [toditaCount, setToditaCount] = useState(0);
  const [universeCount, setUniverseCount] = useState(0);
  const [comicCount, setComicCount] = useState(0);
  const [csLine1Count, setCsLine1Count] = useState(0);
  const [csLine2Count, setCsLine2Count] = useState(0);

  const [swipe1, setSwipe1] = useState<boolean[]>(Array(PIXEL_ROWS * PIXEL_COLS).fill(false));
  const [swipe2, setSwipe2] = useState<boolean[]>(Array(PIXEL_ROWS * PIXEL_COLS).fill(false));
  const [swipe3, setSwipe3] = useState<boolean[]>(Array(PIXEL_ROWS * PIXEL_COLS).fill(false));
  const [swipe4, setSwipe4] = useState<boolean[]>(Array(PIXEL_ROWS * PIXEL_COLS).fill(false));

  const scrollRef1 = useRef(false);
  const scrollRef2 = useRef(false);
  const scrollRef3 = useRef(false);

  useEffect(() => {
    document.title = "Todita Comic | Nathan Music";
    const t = setTimeout(() => setPhase("swipe"), 300);
    return () => clearTimeout(t);
  }, []);

  // Swipe 1: initial red background (ltr)
  useEffect(() => {
    if (phase === "swipe") {
      runSwipe("ltr", setSwipe1, () => setPhase("todita"));
    }
  }, [phase]);

  // Todita letters
  useEffect(() => {
    if (phase === "todita" && toditaCount < TODITA_LETTERS.length) {
      const t = setTimeout(() => setToditaCount((v) => v + 1), 250);
      return () => clearTimeout(t);
    }
    if (phase === "todita" && toditaCount >= TODITA_LETTERS.length) {
      const t = setTimeout(() => setPhase("ready"), 300);
      return () => clearTimeout(t);
    }
  }, [phase, toditaCount]);

  // Swipe 2: dark red (ltr)
  useEffect(() => {
    if (phase === "swipe2") {
      runSwipe("ltr", setSwipe2, () => setPhase("universe"));
    }
  }, [phase]);

  // Universe letters
  useEffect(() => {
    if (phase === "universe" && universeCount < UNIVERSE_LETTERS.length) {
      const t = setTimeout(() => setUniverseCount((v) => v + 1), 200);
      return () => clearTimeout(t);
    }
    if (phase === "universe" && universeCount >= UNIVERSE_LETTERS.length) {
      const t = setTimeout(() => setPhase("ready2"), 300);
      return () => clearTimeout(t);
    }
  }, [phase, universeCount]);

  // Swipe 3: back to red (rtl)
  useEffect(() => {
    if (phase === "swipe3") {
      runSwipe("rtl", setSwipe3, () => setPhase("comic"));
    }
  }, [phase]);

  // Comic letters
  useEffect(() => {
    if (phase === "comic" && comicCount < COMIC_LETTERS.length) {
      const t = setTimeout(() => setComicCount((v) => v + 1), 200);
      return () => clearTimeout(t);
    }
    if (phase === "comic" && comicCount >= COMIC_LETTERS.length) {
      const t = setTimeout(() => setPhase("ready3"), 300);
      return () => clearTimeout(t);
    }
  }, [phase, comicCount]);

  // Swipe 4: dark red (ltr)
  useEffect(() => {
    if (phase === "swipe4") {
      runSwipe("ltr", setSwipe4, () => setPhase("comingsoon"));
    }
  }, [phase]);

  // Coming Soon letters
  useEffect(() => {
    if (phase === "comingsoon" && csLine1Count < COMING_SOON_LINE1.length) {
      const t = setTimeout(() => setCsLine1Count((v) => v + 1), 150);
      return () => clearTimeout(t);
    }
    if (phase === "comingsoon" && csLine1Count >= COMING_SOON_LINE1.length && csLine2Count < COMING_SOON_LINE2.length) {
      const t = setTimeout(() => setCsLine2Count((v) => v + 1), 150);
      return () => clearTimeout(t);
    }
  }, [phase, csLine1Count, csLine2Count]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (phase === "ready" && !scrollRef1.current) {
      scrollRef1.current = true;
      setPhase("swipe2");
    } else if (phase === "ready2" && !scrollRef2.current) {
      scrollRef2.current = true;
      setPhase("swipe3");
    } else if (phase === "ready3" && !scrollRef3.current) {
      scrollRef3.current = true;
      setPhase("swipe4");
    }
  }, [phase]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => { if (e.deltaY > 0) handleScroll(); };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => { if (e.touches[0].clientY < touchStartY - 30) handleScroll(); };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleScroll]);

  const redBg = "hsl(0, 72%, 47%)";
  const darkRedBg = "hsl(0, 72%, 30%)";
  const shadow1 = "3px 3px 0px hsla(0, 72%, 25%, 0.35)";
  const shadow2 = "3px 3px 0px hsla(0, 72%, 15%, 0.35)";

  // Determine which word to show
  const showTodita = phase === "todita" || phase === "ready";
  const showUniverse = phase === "universe" || phase === "ready2";
  const showComic = phase === "comic" || phase === "ready3";
  const showComingSoon = phase === "comingsoon";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Layer 0: swipe1 red */}
      {phase !== "idle" && <div className="absolute inset-0 z-0"><PixelGrid progress={swipe1} color={redBg} /></div>}
      {/* Layer 1: swipe2 dark red */}
      {(["swipe2","universe","ready2","swipe3"].includes(phase) || ["swipe3","comic","ready3","swipe4"].includes(phase) || phase === "comingsoon") && (
        <div className="absolute inset-0 z-[1]"><PixelGrid progress={swipe2} color={darkRedBg} /></div>
      )}
      {/* Layer 2: swipe3 red */}
      {(["swipe3","comic","ready3","swipe4","comingsoon"].includes(phase)) && (
        <div className="absolute inset-0 z-[2]"><PixelGrid progress={swipe3} color={redBg} /></div>
      )}
      {/* Layer 3: swipe4 dark red */}
      {(phase === "swipe4" || phase === "comingsoon") && (
        <div className="absolute inset-0 z-[3]"><PixelGrid progress={swipe4} color={darkRedBg} /></div>
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        {showTodita && (
          <div>
            <AnimatedWord letters={TODITA_LETTERS} visible={toditaCount} fontSize="20vw" fontWeight={900} shadow={shadow1} />
          </div>
        )}

        {showUniverse && (
          <div>
            <AnimatedWord letters={UNIVERSE_LETTERS} visible={universeCount} fontSize="12.5vw" fontWeight={400} shadow={shadow2} />
          </div>
        )}

        {showComic && (
          <div>
            <AnimatedWord letters={COMIC_LETTERS} visible={comicCount} fontSize="12.5vw" fontWeight={400} shadow={shadow1} />
          </div>
        )}

        {showComingSoon && (
          <div className="flex flex-col items-center">
            <div>
              <AnimatedWord letters={COMING_SOON_LINE1} visible={csLine1Count} fontSize="8.5vw" fontWeight={700} shadow={shadow2} />
            </div>
            <div>
              <AnimatedWord letters={COMING_SOON_LINE2} visible={csLine2Count} fontSize="8.5vw" fontWeight={700} shadow={shadow2} />
            </div>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      {(phase === "ready" || phase === "ready2" || phase === "ready3") && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          key={phase}
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
