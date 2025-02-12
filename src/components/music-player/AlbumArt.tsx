
import { useEffect, useRef, useState } from "react";
import { average } from "color.js";

interface AlbumArtProps {
  albumUrl: string;
  setBackgroundColor: (color: string) => void;
}

const AlbumArt = ({ albumUrl, setBackgroundColor }: AlbumArtProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const extractColor = async () => {
      if (imageRef.current && imageLoaded) {
        try {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error("Could not get canvas context");
            return;
          }

          // Set canvas dimensions to match the loaded image
          const imgWidth = imageRef.current.naturalWidth || imageRef.current.width;
          const imgHeight = imageRef.current.naturalHeight || imageRef.current.height;

          // Ensure we have valid dimensions
          if (imgWidth <= 0 || imgHeight <= 0) {
            console.error("Invalid image dimensions:", imgWidth, imgHeight);
            return;
          }

          canvas.width = imgWidth;
          canvas.height = imgHeight;

          // Draw the image onto the canvas
          ctx.drawImage(imageRef.current, 0, 0);

          // Use color.js to extract the average color
          const colors = await average(imageRef.current.src, { format: 'rgb' });

          if (Array.isArray(colors)) {
            const [r, g, b] = colors;
            setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
          }
        } catch (error) {
          console.error("Error extracting color:", error);
          setBackgroundColor("rgb(30, 30, 30)"); // Fallback color
        }
      }
    };

    if (albumUrl) {
      extractColor();
    }
  }, [albumUrl, setBackgroundColor, imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load");
    e.currentTarget.src = "/placeholder.svg";
    setBackgroundColor("rgb(30, 30, 30)");
  };

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
      <img
        ref={imageRef}
        src={albumUrl}
        alt="Album art"
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default AlbumArt;
