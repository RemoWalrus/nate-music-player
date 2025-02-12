
import { useEffect, useRef, useState } from "react";
import { average } from "color.js";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "../types/music";
import PlaybackControls from "./music-player/PlaybackControls";
import TrackInfo from "./music-player/TrackInfo";
import ProgressBar from "./music-player/ProgressBar";
import PlaybackStatus from "./music-player/PlaybackStatus";

interface MusicPlayerProps {
  track: Track;
  setBackgroundColor: (color: string) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
}

const MusicPlayer = ({ track, setBackgroundColor, onPrevTrack, onNextTrack }: MusicPlayerProps) => {
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(track.isPlaying);
  const [playbackError, setPlaybackError] = useState(false);
  const errorCountRef = useRef(0);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  
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
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (track.isPlaying) {
          onNextTrack();
        }
      };
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      };
      
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setPlaybackError(false);
          errorCountRef.current = 0; // Reset error count on successful load
        }
      };

      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlaybackError(true);
        setIsPlaying(false);
        
        // Increment error count
        errorCountRef.current += 1;
        
        // Clear any existing timeout
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        
        // Only proceed to next track if we haven't hit too many consecutive errors
        if (errorCountRef.current < 3) {
          toast({
            title: "Playback Error",
            description: "There was an error playing this track. Trying next song in 2 seconds...",
            variant: "destructive",
          });
          
          // Add a delay before trying the next track
          errorTimeoutRef.current = setTimeout(() => {
            onNextTrack();
          }, 2000);
        } else {
          toast({
            title: "Playback Error",
            description: "Multiple playback errors occurred. Please try again later.",
            variant: "destructive",
          });
          errorCountRef.current = 0; // Reset the counter
        }
      };
      
      setAudioInitialized(true);
    }
  }, [audioInitialized, onNextTrack, track.isPlaying, toast]);

  useEffect(() => {
    const audioSource = track.mp3Url || track.previewUrl;
    console.log('Audio source:', audioSource);
    console.log('Track state:', track);
    
    if (audioRef.current && audioSource) {
      setPlaybackError(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      const loadAndPlay = async () => {
        try {
          audioRef.current!.src = audioSource;
          
          if (isPlaying) {
            console.log('Attempting to play audio...');
            await audioRef.current!.play();
            console.log('Audio playing successfully');
          }
        } catch (error) {
          console.error("Error loading/playing audio:", error);
          setPlaybackError(true);
          setIsPlaying(false);
          
          // Increment error count
          errorCountRef.current += 1;
          
          if (errorCountRef.current < 3) {
            toast({
              title: "Playback Error",
              description: "Unable to play this track. Trying next song in 2 seconds...",
              variant: "destructive",
            });
            
            // Add a delay before trying the next track
            if (errorTimeoutRef.current) {
              clearTimeout(errorTimeoutRef.current);
            }
            errorTimeoutRef.current = setTimeout(() => {
              onNextTrack();
            }, 2000);
          } else {
            toast({
              title: "Playback Error",
              description: "Multiple playback errors occurred. Please try again later.",
              variant: "destructive",
            });
            errorCountRef.current = 0; // Reset the counter
          }
        }
      };
      
      loadAndPlay();
    } else if (isPlaying && !audioSource) {
      console.log('No audio source available, cannot play');
      setIsPlaying(false);
      setPlaybackError(true);
    }
  }, [track, isPlaying, onNextTrack, toast]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
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
    
    if (playbackError) {
      setPlaybackError(false);
      const audioSource = track.mp3Url || track.previewUrl;
      if (audioRef.current && audioSource) {
        audioRef.current.src = audioSource;
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || playbackError) return;
    
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
        
        <TrackInfo
          name={track.name}
          artist={track.artist}
          youtubeUrl={track.youtubeUrl}
          spotifyUrl={track.spotifyUrl}
          appleMusicUrl={track.appleMusicUrl}
          amazonMusicUrl={track.amazonMusicUrl}
        />

        <div className="w-full space-y-4">
          <ProgressBar
            progress={progress}
            duration={duration}
            onProgressClick={handleProgressClick}
          />

          <PlaybackControls
            isPlaying={isPlaying}
            canPlay={!!(track.mp3Url || track.previewUrl)}
            playbackError={playbackError}
            onPrevTrack={onPrevTrack}
            onNextTrack={onNextTrack}
            onTogglePlayback={togglePlayback}
          />

          <PlaybackStatus
            playbackError={playbackError}
            hasAudioSource={!!(track.mp3Url || track.previewUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
