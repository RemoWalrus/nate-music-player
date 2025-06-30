
import { useEffect, useRef, useState } from "react";
import { average } from "color.js";
import { useLocation } from "react-router-dom";

interface AlbumArtProps {
  albumUrl: string;
  setBackgroundColor: (color: string) => void;
}

const AlbumArt = ({ albumUrl, setBackgroundColor }: AlbumArtProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState(albumUrl);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  
  // Check if we're on an album page
  const isAlbumPage = location.pathname.startsWith('/album/') || location.pathname === '/chipotle';

  useEffect(() => {
    setImageSrc(albumUrl);
    setHasError(false);
  }, [albumUrl]);

  useEffect(() => {
    const extractColor = async () => {
      if (imageRef.current && !hasError) {
        try {
          const colors = await average(imageRef.current.src);
          if (Array.isArray(colors)) {
            const [r, g, b] = colors;
            setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
          }
        } catch (error) {
          console.error("Error extracting color:", error);
          setBackgroundColor("rgb(30, 30, 30)");
        }
      }
    };

    if (imageSrc && !hasError) {
      extractColor();
    }
  }, [imageSrc, setBackgroundColor, hasError]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", imageSrc);
    console.error("Image error event:", e);
    
    if (!hasError) {
      setHasError(true);
      setImageSrc("/placeholder.svg");
      setBackgroundColor("rgb(30, 30, 30)");
    }
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageSrc);
    setHasError(false);
  };

  return (
    <div className={`relative ${isAlbumPage ? 'w-72 h-72 sm:w-96 sm:h-96' : 'w-64 h-64 sm:w-80 sm:h-80'}`}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Album art"
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default AlbumArt;
