
import { useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { average } from "color.js";

export interface Track {
  id: string;
  name: string;
  artist: string;
  albumUrl: string;
  isPlaying: boolean;
  previewUrl?: string | null;
  mp3Url?: string | null;
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
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
      const audioSource = track.mp3Url || track.previewUrl;
      console.log('Audio source:', audioSource);
      
      if (track.isPlaying) {
        console.log('Attempting to play audio...');
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setTrack({ ...track, isPlaying: false });
        });
      } else {
        console.log('Pausing audio...');
        audioRef.current.pause();
      }
    }
  }, [track.isPlaying, track.mp3Url, track.previewUrl]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const audioSource = track.mp3Url || track.previewUrl;
      console.log('Setting new audio source:', audioSource);
      if (audioSource) {
        audioRef.current.src = audioSource;
        // If track was playing, continue playing the new source
        if (track.isPlaying) {
          audioRef.current.play().catch(error => {
            console.error("Error playing new audio source:", error);
            setTrack({ ...track, isPlaying: false });
          });
        }
      }
    }
  }, [track.id, track.mp3Url, track.previewUrl]);

  const togglePlayback = () => {
    if (!track.mp3Url && !track.previewUrl) {
      console.log("No audio URL available for this track");
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
          <div className="flex items-center justify-center gap-4 mt-2">
            {track.youtubeUrl && (
              <a
                href={track.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white flex items-center gap-1"
              >
                YouTube Music <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {track.spotifyUrl && (
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white flex items-center gap-1"
              >
                Spotify <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            disabled={!track.mp3Url && !track.previewUrl}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
              (track.mp3Url || track.previewUrl)
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
          {!track.mp3Url && !track.previewUrl && (
            <div className="flex items-center gap-2 text-white/60">
              <VolumeX className="w-5 h-5" />
              <span className="text-sm">Audio unavailable</span>
            </div>
          )}
          {(track.mp3Url || track.previewUrl) && (
            <div className="flex items-center gap-2 text-white/60">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">Audio available</span>
            </div>
          )}
        </div>

        {(track.mp3Url || track.previewUrl) && (
          <audio
            ref={audioRef}
            src={track.mp3Url || track.previewUrl}
            onEnded={() => setTrack({ ...track, isPlaying: false })}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;

