
import { useEffect, useRef, useState } from "react";
import { decryptFileName } from "../utils/fileEncryption";
import type { Track } from "../types/music";
import AlbumArt from "./music-player/AlbumArt";
import AudioControls from "./music-player/AudioControls";
import ProgressBar from "./music-player/ProgressBar";
import TrackInfo from "./music-player/TrackInfo";

interface MusicPlayerProps {
  track: Track;
  setBackgroundColor: (color: string) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
}

const MusicPlayer = ({ track, setBackgroundColor, onPrevTrack, onNextTrack }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(track.isPlaying);

  useEffect(() => {
    if (!audioInitialized) {
      audioRef.current = new Audio();
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
        }
      };
      setAudioInitialized(true);
    }
  }, [audioInitialized, onNextTrack, track.isPlaying]);

  useEffect(() => {
    const audioSource = track.mp3Url || track.previewUrl;
    console.log('Audio source:', audioSource);
    console.log('Track state:', track);
    
    if (audioRef.current && audioSource) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      let finalAudioSource = audioSource;
      if (track.mp3Url) {
        try {
          const url = new URL(audioSource);
          const pathParts = url.pathname.split('/');
          const encryptedFileName = pathParts[pathParts.length - 1];
          const decryptedFileName = decryptFileName(encryptedFileName);
          pathParts[pathParts.length - 1] = decryptedFileName;
          url.pathname = pathParts.join('/');
          finalAudioSource = url.toString();
        } catch (error) {
          console.error('Error decrypting audio URL:', error);
        }
      }
      
      audioRef.current.src = finalAudioSource;
      
      if (isPlaying) {
        console.log('Attempting to play audio...');
        const playPromise = audioRef.current.play();
        
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
        <AlbumArt 
          albumUrl={track.albumUrl} 
          setBackgroundColor={setBackgroundColor} 
          audioRef={audioRef}
        />
        
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

          <AudioControls
            isPlaying={isPlaying}
            onTogglePlayback={togglePlayback}
            onPrevTrack={onPrevTrack}
            onNextTrack={onNextTrack}
            hasAudio={Boolean(track.mp3Url || track.previewUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
