
import { useEffect, useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { ArtistSidebar } from "../components/ArtistSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTracks } from "@/hooks/use-tracks";

const Index = () => {
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const isMobile = useIsMobile();
  const {
    tracks,
    currentTrack,
    isLoading,
    handleTrackSelect,
    handlePrevTrack,
    handleNextTrack,
    loadTracks
  } = useTracks();

  useEffect(() => {
    loadTracks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="group/sidebar-wrapper flex min-h-svh w-full">
      <ArtistSidebar />
      <div 
        className={`flex-1 flex flex-col items-center transition-colors duration-500 ease-in-out p-4 gap-8 ${
          isMobile ? "mt-16" : ""
        }`}
        style={{ backgroundColor }}
      >
        {currentTrack && (
          <MusicPlayer 
            track={currentTrack}
            setTrack={setCurrentTrack}
            setBackgroundColor={setBackgroundColor}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
          />
        )}
        <Playlist 
          tracks={tracks}
          onTrackSelect={handleTrackSelect}
          currentTrackId={currentTrack?.id || ""}
        />
      </div>
    </div>
  );
};

export default Index;
