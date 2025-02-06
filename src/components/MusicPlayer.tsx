import { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { average } from "color.js";

interface Track {
  name: string;
  artist: string;
  albumUrl: string;
  isPlaying: boolean;
}

interface MusicPlayerProps {
  track: Track;
  setTrack: (track: Track) => void;
  setBackgroundColor: (color: string) => void;
}

const MusicPlayer = ({ track, setTrack, setBackgroundColor }: MusicPlayerProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColor = async () => {
      if (imageRef.current) {
        try {
          const color = await average(imageRef.current);
          setBackgroundColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
        } catch (error) {
          console.error("Error extracting color:", error);
        }
      }
    };

    extractColor();
  }, [track.albumUrl]);

  const togglePlayback = () => {
    setTrack({ ...track, isPlaying: !track.isPlaying });
    console.log("Toggled playback:", !track.isPlaying);
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl -z-10" />
      <div className="p-8 rounded-3xl flex flex-col items-center space-y-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <img
            ref={imageRef}
            src={track.albumUrl}
            alt={`${track.name} album art`}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-white text-2xl font-semibold tracking-wide">
            {track.name}
          </h2>
          <p className="text-white/80 text-lg">
            {track.artist}
          </p>
        </div>

        <button
          onClick={togglePlayback}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          {track.isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;