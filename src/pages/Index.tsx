
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
  external_urls?: {
    spotify?: string;
  };
}

// Add hosted MP3 URLs and YouTube Music URLs for each track
const TRACK_URLS = {
  // Example structure - replace with actual URLs:
  'track_id_1': {
    mp3: 'https://example.com/track1.mp3',
    youtube: 'https://music.youtube.com/watch?v=...'
  },
  // Add more tracks as needed
};

const Index = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '',
    name: '',
    artist: '',
    albumUrl: '',
    isPlaying: false,
    previewUrl: null,
    mp3Url: null,
    youtubeUrl: null,
    spotifyUrl: null
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
      
      // Enhance tracks with additional URLs
      const enhancedTracks = fetchedTracks.map(track => ({
        ...track,
        youtubeUrl: TRACK_URLS[track.id]?.youtube || null,
        spotifyUrl: track.external_urls?.spotify || null
      }));
      
      setTracks(enhancedTracks);
      
      if (enhancedTracks && enhancedTracks.length > 0) {
        const firstTrack = enhancedTracks[0];
        setCurrentTrack({
          id: firstTrack.id,
          name: firstTrack.name,
          artist: firstTrack.artists[0].name,
          albumUrl: firstTrack.album.images[0]?.url,
          isPlaying: false,
          previewUrl: firstTrack.preview_url,
          mp3Url: TRACK_URLS[firstTrack.id]?.mp3 || null,
          youtubeUrl: TRACK_URLS[firstTrack.id]?.youtube || null,
          spotifyUrl: firstTrack.external_urls?.spotify || null
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
      previewUrl: track.preview_url,
      mp3Url: TRACK_URLS[track.id]?.mp3 || null,
      youtubeUrl: TRACK_URLS[track.id]?.youtube || null,
      spotifyUrl: track.external_urls?.spotify || null
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
