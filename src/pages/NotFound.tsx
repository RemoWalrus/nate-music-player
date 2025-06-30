
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [showSplash, setShowSplash] = useState(false);

  // Array of background colors similar to those used by the music player
  const backgroundColors = [
    "rgb(30, 30, 30)",
    "rgb(45, 55, 72)",
    "rgb(76, 29, 149)",
    "rgb(124, 58, 237)",
    "rgb(59, 130, 246)",
    "rgb(16, 185, 129)",
    "rgb(245, 158, 11)",
    "rgb(239, 68, 68)",
    "rgb(236, 72, 153)",
    "rgb(14, 165, 233)",
    "rgb(34, 197, 94)",
    "rgb(168, 85, 247)"
  ];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Set a random background color
    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    setBackgroundColor(randomColor);

    // Start splash animation after drop animation completes
    const splashTimer = setTimeout(() => {
      setShowSplash(true);
    }, 2000); // 2s for drop to fall

    return () => clearTimeout(splashTimer);
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-500 ease-in-out relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Falling Drop */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-6 bg-white/90 rounded-full animate-[drop-fall_2s_ease-in_forwards] relative">
          {/* Drop tail effect */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white/60 rounded-full animate-[drop-tail_2s_ease-in_forwards]"></div>
        </div>
      </div>

      {/* Main Circle with Splash Effect */}
      <div className={`bg-white/95 rounded-full p-20 shadow-2xl text-center max-w-xl mx-4 relative transition-all duration-300 ${
        showSplash ? 'animate-[splash_0.5s_ease-out]' : ''
      }`}>
        
        {/* Splash Effect */}
        {showSplash && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/70 rounded-full animate-[splash-drop_0.8s_ease-out_forwards]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-80px)`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </>
        )}

        <Link to="/" className="hover:opacity-80 transition-opacity mb-8 inline-block">
          <img 
            src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
            alt="Nathan Garcia Logo" 
            className="h-24 w-32 mx-auto mb-6"
          />
        </Link>
        <h1 className="text-8xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline text-lg">
          Return to Home
        </Link>
      </div>

      <style>{`
        @keyframes drop-fall {
          0% {
            transform: translateY(-100vh) translateX(-50%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(40vh) translateX(-50%);
            opacity: 1;
          }
        }

        @keyframes drop-tail {
          0% {
            height: 4px;
            opacity: 0.6;
          }
          50% {
            height: 16px;
            opacity: 0.8;
          }
          100% {
            height: 2px;
            opacity: 0.3;
          }
        }

        @keyframes splash {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes splash-drop {
          0% {
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-80px) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-120px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
