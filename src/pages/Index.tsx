
import { useEffect, useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { ArtistSidebar } from "../components/ArtistSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTracks } from "@/hooks/use-tracks";

const Index = () => {
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [textColor, setTextColor] = useState("rgba(255, 255, 255, 0.6)");
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

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Update text color based on background luminance
  useEffect(() => {
    const rgb = backgroundColor.match(/\d+/g);
    if (rgb) {
      const [r, g, b] = rgb.map(Number);
      const luminance = getLuminance(r, g, b);
      setTextColor(luminance > 0.5 ? "#333333" : "rgba(255, 255, 255, 0.6)");
    }
  }, [backgroundColor]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor }}>
        <div style={{ color: textColor }}>Loading...</div>
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
          style={{ 
            backgroundColor,
            background: `linear-gradient(to bottom, ${backgroundColor}, ${backgroundColor}ee, ${backgroundColor}dd)`
          }}
        >
          {/* Waveform Background */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50' stroke='%23333333' fill='none' stroke-width='1' stroke-linecap='round' vector-effect='non-scaling-stroke' /%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'center',
              backgroundSize: '200px 100px'
            }}
          />
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
          <footer 
            className="w-full text-center py-4 text-sm font-light mt-auto"
            style={{ color: textColor }}
          >
            © {new Date().getFullYear()} Nathan Garcia. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
