
import { useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { average } from "color.js";

export interface Track {
  id: string;
  name: string;
  artist: string;
  albumUrl: string;
  isPlaying: boolean;
  previewUrl?: string | null;
}

interface MusicPlayerProps {
  track: Track;
  setTrack: (track: Track) => void;
  setBackgroundColor: (color: string) => void;
}

const MusicPlayer = ({ track, setTrack, setBackgroundColor }: MusicPlayerProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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

    if (track.albumUrl) {
      extractColor();
    }
  }, [track.albumUrl, setBackgroundColor]);

  useEffect(() => {
    if (audioRef.current) {
      if (track.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setTrack({ ...track, isPlaying: false });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [track.isPlaying]);

  const togglePlayback = () => {
    if (!track.previewUrl) {
      console.log("No preview URL available for this track");
      return;
    }
    setTrack({ ...track, isPlaying: !track.isPlaying });
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
            onError={(e) => {
              console.error("Image failed to load");
              e.currentTarget.src = "/placeholder.svg";
            }}
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

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            disabled={!track.previewUrl}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
              track.previewUrl 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-white/5 cursor-not-allowed'
            }`}
          >
            {track.isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
          {!track.previewUrl && (
            <div className="flex items-center gap-2 text-white/60">
              <VolumeX className="w-5 h-5" />
              <span className="text-sm">Preview unavailable</span>
            </div>
          )}
          {track.previewUrl && (
            <div className="flex items-center gap-2 text-white/60">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">Preview available</span>
            </div>
          )}
        </div>

        {track.previewUrl && (
          <audio
            ref={audioRef}
            src={track.previewUrl}
            onEnded={() => setTrack({ ...track, isPlaying: false })}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
