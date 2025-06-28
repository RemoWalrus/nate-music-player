
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
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
