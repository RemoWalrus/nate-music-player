
import { useEffect, useRef } from "react";
import { average } from "color.js";

interface AlbumArtProps {
  albumUrl: string;
  setBackgroundColor: (color: string) => void;
}

const AlbumArt = ({ albumUrl, setBackgroundColor }: AlbumArtProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColor = async () => {
      if (imageRef.current) {
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

    if (albumUrl) {
      extractColor();
    }
  }, [albumUrl, setBackgroundColor]);

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
      <img
        ref={imageRef}
        src={albumUrl}
        alt="Album art"
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
        onLoad={() => {
          console.log("Image loaded successfully:", albumUrl);
        }}
        onError={(e) => {
          console.error("Image failed to load:", albumUrl);
          console.error("Image error event:", e);
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
  );
};

export default AlbumArt;
