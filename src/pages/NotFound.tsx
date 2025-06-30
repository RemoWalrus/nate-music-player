import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");

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
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-500 ease-in-out"
      style={{ backgroundColor }}
    >
      <div className="bg-white/95 rounded-full p-16 shadow-2xl text-center max-w-lg mx-4">
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
    </div>
  );
};

export default NotFound;
