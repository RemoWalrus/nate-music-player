
import { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { fetchArtistTopTracks, loadSpotifyCredentials } from "../utils/spotify";
import { useToast } from "../hooks/use-toast";
import type { Track } from "../components/MusicPlayer";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  preview_url: string | null;
}

const Index = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '',
    name: '',
    artist: '',
    albumUrl: '',
    isPlaying: false,
    previewUrl: null
  });
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [isLoading, setIsLoading] = useState(true);

  const loadTracks = async () => {
    try {
      const credentialsLoaded = await loadSpotifyCredentials();
      if (!credentialsLoaded) {
        toast({
          title: "Error",
          description: "Failed to load Spotify credentials. Please check your Supabase secrets.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const fetchedTracks = await fetchArtistTopTracks();
      setTracks(fetchedTracks);
      
      if (fetchedTracks && fetchedTracks.length > 0) {
        const firstTrack = fetchedTracks[0];
        setCurrentTrack({
          id: firstTrack.id,
          name: firstTrack.name,
          artist: firstTrack.artists[0].name,
          albumUrl: firstTrack.album.images[0]?.url,
          isPlaying: false,
          previewUrl: firstTrack.preview_url
        });
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load tracks. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTracks();
  }, [toast]);

  const handleTrackSelect = (track: SpotifyTrack) => {
    setCurrentTrack({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      albumUrl: track.album.images[0]?.url,
      isPlaying: true,
      previewUrl: track.preview_url
    });

    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists[0].name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center transition-colors duration-500 ease-in-out p-4 gap-8"
      style={{ backgroundColor }}
    >
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack}
          setTrack={setCurrentTrack}
          setBackgroundColor={setBackgroundColor}
        />
      )}
      <Playlist 
        tracks={tracks}
        onTrackSelect={handleTrackSelect}
        currentTrackId={currentTrack?.id || ""}
      />
    </div>
  );
};

export default Index;
