
import { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { ArtistSidebar } from "../components/ArtistSidebar";
import { fetchArtistTopTracks, loadSpotifyCredentials } from "../utils/spotify";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface TrackUrls {
  spotify_track_id: string;
  mp3_url: string | null;
  youtube_music_url: string | null;
}

const Index = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [trackUrls, setTrackUrls] = useState<Record<string, TrackUrls>>({});
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

  const fetchTrackUrls = async (trackIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('track_urls')
        .select('*')
        .in('spotify_track_id', trackIds);

      if (error) {
        console.error('Error fetching track URLs:', error);
        return;
      }

      const urlsMap: Record<string, TrackUrls> = {};
      data.forEach((track) => {
        urlsMap[track.spotify_track_id] = track;
      });
      setTrackUrls(urlsMap);
    } catch (error) {
      console.error('Error in fetchTrackUrls:', error);
    }
  };

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
      
      // Fetch track URLs from our database
      await fetchTrackUrls(fetchedTracks.map(track => track.id));
      
      // Enhance tracks with additional URLs
      const enhancedTracks = fetchedTracks.map(track => ({
        ...track,
        youtubeUrl: trackUrls[track.id]?.youtube_music_url || null,
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
          mp3Url: trackUrls[firstTrack.id]?.mp3_url || null,
          youtubeUrl: trackUrls[firstTrack.id]?.youtube_music_url || null,
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
      mp3Url: trackUrls[track.id]?.mp3_url || null,
      youtubeUrl: trackUrls[track.id]?.youtube_music_url || null,
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
    <div className="flex min-h-screen w-full">
      <ArtistSidebar />
      <div 
        className="flex-1 flex flex-col items-center transition-colors duration-500 ease-in-out p-4 gap-8"
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
    </div>
  );
};

export default Index;
