
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [errorNumberColor, setErrorNumberColor] = useState("rgb(30, 30, 30)");
  const [showContent, setShowContent] = useState(false);

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

  // Function to ensure sufficient contrast
  const ensureContrast = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return color;
    
    const [r, g, b] = rgb.map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If the color is too light (luminance > 0.7), darken it
    if (luminance > 0.7) {
      const darkenFactor = 0.6;
      return `rgb(${Math.floor(r * darkenFactor)}, ${Math.floor(g * darkenFactor)}, ${Math.floor(b * darkenFactor)})`;
    }
    
    return color;
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Set a random background color
    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    setBackgroundColor(randomColor);
    setErrorNumberColor(ensureContrast(randomColor));

    // Show content after splash animation completes
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3200); // Animation takes about 3.2 seconds total

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-500 ease-in-out relative overflow-hidden"
      style={{ backgroundColor }}
    >
      <style>
        {`
          @keyframes dropFall {
            0% {
              transform: translateY(-100vh) translateX(-50%);
              opacity: 1;
            }
            85% {
              transform: translateY(calc(50vh - 120px)) translateX(-50%);
              opacity: 1;
            }
            100% {
              transform: translateY(calc(50vh - 100px)) translateX(-50%);
              opacity: 0;
            }
          }
          
          @keyframes splash {
            0% {
              transform: translateX(-50%) translateY(-50%) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translateX(-50%) translateY(-50%) scale(3);
              opacity: 0.9;
            }
            100% {
              transform: translateX(-50%) translateY(-50%) scale(8);
              opacity: 0;
            }
          }

          @keyframes circleReveal {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .drop {
            position: absolute;
            top: 0;
            left: 50%;
            width: 8px;
            height: 12px;
            background: white;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            animation: dropFall 2.5s ease-in forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }
          
          .splash {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, white 0%, transparent 70%);
            border-radius: 50%;
            animation: splash 0.8s ease-out forwards;
            animation-delay: 2.8s;
            opacity: 0;
          }

          .content-circle {
            animation: circleReveal 0.6s ease-out forwards;
            animation-delay: 3.2s;
            transform: scale(0);
            opacity: 0;
          }
        `}
      </style>
      
      <div className="drop"></div>
      <div className="splash"></div>
      
      <div className={`bg-white/95 rounded-full p-20 shadow-2xl text-center max-w-lg mx-4 content-circle`}>
        <Link to="/" className="hover:opacity-80 transition-opacity mb-8 inline-block">
          <img 
            src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
            alt="Nathan Garcia Logo" 
            className="h-24 w-32 mx-auto mb-6"
          />
        </Link>
        <h1 
          className="text-8xl font-bold mb-4"
          style={{ color: errorNumberColor }}
        >
          404
        </h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline text-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
