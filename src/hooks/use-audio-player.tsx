
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "../types/music";

export function useAudioPlayer(track: Track, onNextTrack: () => void) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(track.isPlaying);
  const [playbackError, setPlaybackError] = useState(false);
  const errorCountRef = useRef(0);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

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
          errorCountRef.current = 0;
        }
      };

      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlaybackError(true);
        setIsPlaying(false);
        
        errorCountRef.current += 1;
        
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        
        if (errorCountRef.current < 3) {
          toast({
            title: "Playback Error",
            description: "There was an error playing this track. Trying next song in 2 seconds...",
            variant: "destructive",
          });
          
          errorTimeoutRef.current = setTimeout(() => {
            onNextTrack();
          }, 2000);
        } else {
          toast({
            title: "Playback Error",
            description: "Multiple playback errors occurred. Please try again later.",
            variant: "destructive",
          });
          errorCountRef.current = 0;
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
          
          errorCountRef.current += 1;
          
          if (errorCountRef.current < 3) {
            toast({
              title: "Playback Error",
              description: "Unable to play this track. Trying next song in 2 seconds...",
              variant: "destructive",
            });
            
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
            errorCountRef.current = 0;
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

  return {
    progress,
    duration,
    isPlaying,
    playbackError,
    togglePlayback,
    handleProgressClick,
  };
}
