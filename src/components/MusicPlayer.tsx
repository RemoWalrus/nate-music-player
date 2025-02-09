import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ExternalLink, SkipBack, SkipForward } from "lucide-react";
import { average } from "color.js";
import { Progress } from "./ui/progress";
import type { Track } from "../types/music";

interface MusicPlayerProps {
  track: Track;
  setBackgroundColor: (color: string) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
}

const MusicPlayer = ({ track, setBackgroundColor, onPrevTrack, onNextTrack }: MusicPlayerProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(track.isPlaying);
  
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
    if (!audioInitialized) {
      const audio = new Audio();
      audio.onended = () => {
        setIsPlaying(false);
        onNextTrack(); // Auto-play next track when current track ends
      };
      audio.ontimeupdate = () => {
        setProgress(audio.currentTime);
      };
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      setAudioInitialized(true);
    }
  }, [audioInitialized, onNextTrack]);

  useEffect(() => {
    const audioSource = track.mp3Url || track.previewUrl;
    console.log('Audio source:', audioSource);
    console.log('Track state:', track);
    
    const audio = new Audio();
    if (audioSource) {
      audio.pause();
      audio.currentTime = 0;
      
      audio.src = audioSource;
      
      if (isPlaying) {
        console.log('Attempting to play audio...');
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playing successfully');
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              setIsPlaying(false);
            });
        }
      }
    } else if (isPlaying && !audioSource) {
      console.log('No audio source available, cannot play');
      setIsPlaying(false);
    }
  }, [track, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!track.mp3Url && !track.previewUrl) {
      console.log("No audio URL available for this track");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
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
            {track.appleMusicUrl && (
              <a
                href={track.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white flex items-center gap-1"
              >
                Apple Music <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="w-full flex items-center gap-2">
            <span className="text-white/60 text-sm w-12 text-right">
              {formatTime(progress)}
            </span>
            <div 
              className="flex-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <Progress 
                value={(progress / duration) * 100} 
                className="h-1.5"
              />
            </div>
            <span className="text-white/60 text-sm w-12">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onPrevTrack}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 bg-white/10 hover:bg-white/20"
            >
              <SkipBack className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={togglePlayback}
              disabled={!track.mp3Url && !track.previewUrl}
              className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-200 ${
                (track.mp3Url || track.previewUrl)
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-white/5 cursor-not-allowed'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>

            <button
              onClick={onNextTrack}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 bg-white/10 hover:bg-white/20"
            >
              <SkipForward className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
