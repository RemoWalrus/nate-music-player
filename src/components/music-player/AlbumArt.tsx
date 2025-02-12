
import { useEffect, useRef } from "react";
import { average } from "color.js";
import WaveformVisualizer from "./WaveformVisualizer";

interface AlbumArtProps {
  albumUrl: string;
  setBackgroundColor: (color: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AlbumArt = ({ albumUrl, setBackgroundColor, audioRef }: AlbumArtProps) => {
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
        onError={(e) => {
          console.error("Image failed to load");
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <WaveformVisualizer audioRef={audioRef} />
    </div>
  );
};

export default AlbumArt;
