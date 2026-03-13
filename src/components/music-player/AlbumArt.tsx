
import { useEffect, useRef, useState, useCallback } from "react";
import { average } from "color.js";
import { useLocation } from "react-router-dom";

interface AlbumArtProps {
  albumUrl: string;
  setBackgroundColor: (color: string) => void;
  trackName?: string;
  artistName?: string;
}

const AlbumArt = ({ albumUrl, setBackgroundColor, trackName, artistName }: AlbumArtProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState(albumUrl);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  
  const isAlbumPage = location.pathname.startsWith('/albums/') || location.pathname === '/chipotle';

  useEffect(() => {
    setImageSrc(albumUrl);
    setHasError(false);
  }, [albumUrl]);

  const extractColor = useCallback(async () => {
    if (imageRef.current && !hasError && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
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
  }, [setBackgroundColor, hasError]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", imageSrc);
    if (!hasError) {
      setHasError(true);
      setImageSrc("/placeholder.svg");
      setBackgroundColor("rgb(30, 30, 30)");
    }
  };

  const handleImageLoad = () => {
    setHasError(false);
    extractColor();
  };

  // Also extract color if image is already cached/loaded when src changes
  useEffect(() => {
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0 && !hasError) {
      extractColor();
    }
  }, [imageSrc, extractColor, hasError]);

  return (
    <div className={`relative ${isAlbumPage ? 'w-72 h-72 sm:w-96 sm:h-96' : 'w-64 h-64 sm:w-80 sm:h-80'}`}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={trackName ? `${artistName || 'Nathan Garcia'} ${trackName} song cover art` : 'Album art'}
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default AlbumArt;
