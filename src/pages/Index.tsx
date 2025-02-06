import { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import SpotifyCredentialsForm from "../components/SpotifyCredentialsForm";
import { fetchArtistTopTracks } from "../utils/spotify";
import { useToast } from "../hooks/use-toast";
import type { Track } from "../components/MusicPlayer";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

const Index = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '',
    name: '',
    artist: '',
    albumUrl: '',
    isPlaying: false
  });
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");
  const [credentialsSet, setCredentialsSet] = useState(false);

  const loadTracks = async () => {
    try {
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
  };

  useEffect(() => {
    if (credentialsSet) {
      loadTracks();
    }
  }, [credentialsSet, toast]);

  const handleTrackSelect = (track: SpotifyTrack) => {
    setCurrentTrack({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      albumUrl: track.album.images[0]?.url,
      isPlaying: true,
    });

    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists[0].name}`,
    });
  };

  if (!credentialsSet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4"
           style={{ backgroundColor }}>
        <h1 className="text-2xl font-bold text-white mb-6">Welcome to the Music Player</h1>
        <SpotifyCredentialsForm onCredentialsSet={() => setCredentialsSet(true)} />
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