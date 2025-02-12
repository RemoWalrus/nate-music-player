
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useBackgroundColor } from "@/hooks/use-background-color";
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
  const {
    progress,
    duration,
    isPlaying,
    playbackError,
    togglePlayback,
    handleProgressClick,
  } = useAudioPlayer(track, onNextTrack);

  const imageRef = useBackgroundColor(track.albumUrl, setBackgroundColor);

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
