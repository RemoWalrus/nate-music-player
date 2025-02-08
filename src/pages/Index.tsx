
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
    <div className="flex flex-col min-h-svh w-full">
      <div className="flex flex-1">
        <ArtistSidebar />
        <div 
          className={`flex-1 flex flex-col items-center transition-colors duration-500 ease-in-out p-4 gap-8 relative ${
            isMobile ? "mt-16" : ""
          }`}
          style={{ backgroundColor }}
        >
          {currentTrack && (
            <MusicPlayer 
              track={currentTrack}
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
          <footer className="w-full text-center py-4 text-white/60 text-sm font-light mt-auto">
            © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
