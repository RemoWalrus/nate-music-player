
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { ArtistSidebar } from "../components/ArtistSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTracks } from "@/hooks/use-tracks";
import { useAlbum } from "@/hooks/use-album";
import NotFound from "./NotFound";

const AlbumPage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [textColor, setTextColor] = useState("rgba(255, 255, 255, 0.6)");
  const [currentAlbumTrackIndex, setCurrentAlbumTrackIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Check if album exists in database
  const { album, isLoading: albumLoading, error: albumError } = useAlbum(albumName || "");
  
  // Album page should prefer album covers for consistent album artwork
  const {
    tracks,
    currentTrack,
    isLoading,
    handleTrackSelect,
    loadTracks,
    trackUrls
  } = useTracks({ preferAlbumCover: true });

  // Filter and sort tracks for the specified album
  const albumTracks = tracks
    .filter(track => {
      const trackUrlData = trackUrls[track.id];
      return trackUrlData?.album?.toLowerCase() === albumName?.toLowerCase();
    })
    .sort((a, b) => {
      const trackUrlDataA = trackUrls[a.id];
      const trackUrlDataB = trackUrls[b.id];
      const trackNumberA = trackUrlDataA?.track_number || 999;
      const trackNumberB = trackUrlDataB?.track_number || 999;
      return trackNumberA - trackNumberB;
    });

  // Get album display name (capitalize first letter)
  const albumDisplayName = albumName ? 
    albumName.charAt(0).toUpperCase() + albumName.slice(1).toLowerCase() : '';

  useEffect(() => {
    loadTracks();
  }, []);

  // Handle album-specific navigation
  const handleAlbumPrevTrack = () => {
    if (albumTracks.length === 0) return;
    const newIndex = (currentAlbumTrackIndex - 1 + albumTracks.length) % albumTracks.length;
    setCurrentAlbumTrackIndex(newIndex);
    handleTrackSelect(albumTracks[newIndex]);
  };

  const handleAlbumNextTrack = () => {
    if (albumTracks.length === 0) return;
    const newIndex = (currentAlbumTrackIndex + 1) % albumTracks.length;
    setCurrentAlbumTrackIndex(newIndex);
    handleTrackSelect(albumTracks[newIndex]);
  };

  const handleAlbumTrackSelect = (track: any) => {
    const newIndex = albumTracks.findIndex(t => t.id === track.id);
    if (newIndex !== -1) {
      setCurrentAlbumTrackIndex(newIndex);
    }
    handleTrackSelect(track);
  };

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

  // Redirect to 404 if no album name provided
  if (!albumName) {
    return <Navigate to="/404" replace />;
  }

  // Show 404 if album doesn't exist in database or has error
  if (!albumLoading && (albumError || !album)) {
    return <NotFound />;
  }

  if (isLoading || albumLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full"
           style={{ backgroundColor }}>
        <div style={{ color: textColor }}>Loading {albumDisplayName} album...</div>
      </div>
    );
  }

  // If no tracks found for this album, show a message
  if (albumTracks.length === 0) {
    return (
      <div className="flex flex-col min-h-svh w-full overflow-hidden">
        <div className="flex flex-1 w-full">
          <ArtistSidebar />
          <div 
            className={`flex-1 flex flex-col items-center justify-center transition-colors duration-500 ease-in-out p-4 gap-8 relative w-full ${
              isMobile ? "mt-16" : ""
            }`}
            style={{ 
              backgroundColor,
              background: backgroundColor
            }}
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
                {albumDisplayName}
              </h1>
              <p style={{ color: textColor }}>
                No tracks found for the {albumDisplayName} album. Please check back later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh w-full overflow-hidden">
      <div className="flex flex-1 w-full">
        <ArtistSidebar />
        <div 
          className={`flex-1 flex flex-col items-center transition-colors duration-500 ease-in-out p-4 gap-1 relative w-full ${
            isMobile ? "mt-16" : ""
          }`}
          style={{ 
            backgroundColor,
            background: backgroundColor
          }}
        >
          <div className="text-center mb-1">
            <h1 className="text-4xl font-bold mb-1" style={{ color: textColor }}>
              {albumDisplayName}
            </h1>
            <p className="text-lg" style={{ color: textColor }}>
              Album by Nathan Garcia • {albumTracks.length} tracks
            </p>
          </div>

          {currentTrack && albumTracks.some(track => track.id === currentTrack.id) && (
            <div className="mb-1">
              <MusicPlayer 
                track={currentTrack}
                setBackgroundColor={setBackgroundColor}
                onPrevTrack={handleAlbumPrevTrack}
                onNextTrack={handleAlbumNextTrack}
              />
            </div>
          )}
          
          <div className="w-full max-w-2xl mx-auto">
            <Playlist 
              tracks={albumTracks}
              onTrackSelect={handleAlbumTrackSelect}
              currentTrackId={currentTrack?.id || ""}
              showTrackNumbers={true}
              trackUrls={trackUrls}
            />
          </div>
          
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

export default AlbumPage;
