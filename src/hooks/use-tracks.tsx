
import { useState } from "react";
import { useToast } from "./use-toast";
import { fetchArtistTopTracks, loadSpotifyCredentials } from "../utils/spotify";
import type { SpotifyTrack } from "../types/music";
import { getTrackUrlsFromSupabase, createTrackFromUrls } from "../utils/tracks";
import { useTrackSelection } from "./use-track-selection";

export function useTracks() {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [trackUrls, setTrackUrls] = useState<Record<string, TrackUrls>>({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentTrack,
    handleTrackSelect,
    handlePrevTrack,
    handleNextTrack
  } = useTrackSelection(trackUrls);

  const loadTracks = async () => {
    try {
      setIsLoading(true);
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

      // First fetch all track URLs from Supabase
      const urlsMap = await getTrackUrlsFromSupabase();
      if (!urlsMap) {
        setIsLoading(false);
        return;
      }
      setTrackUrls(urlsMap);

      // Then fetch tracks from Spotify
      const fetchedTracks = await fetchArtistTopTracks();
      console.log('Fetched Spotify tracks:', fetchedTracks);

      // Create a map of all tracks (both from Spotify and Supabase)
      const allTracks: SpotifyTrack[] = [...fetchedTracks];
      
      // Add tracks that only exist in Supabase
      Object.values(urlsMap).forEach(trackUrl => {
        if (!allTracks.some(track => track.id === trackUrl.spotify_track_id)) {
          allTracks.push(createTrackFromUrls(trackUrl));
        }
      });

      // Set a random initial track that has URLs
      const tracksWithUrls = allTracks.filter(track => urlsMap[track.id]);
      if (tracksWithUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracksWithUrls.length);
        const randomTrack = tracksWithUrls[randomIndex];
        handleTrackSelect(randomTrack, tracksWithUrls);
      }

      // Enhance all tracks with URLs
      const enhancedTracks = allTracks.filter(track => urlsMap[track.id]);

      console.log('Final enhanced tracks:', enhancedTracks);
      setTracks(enhancedTracks);
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

  return {
    tracks,
    currentTrack,
    isLoading,
    handleTrackSelect: (track: SpotifyTrack) => handleTrackSelect(track, tracks),
    handlePrevTrack: () => handlePrevTrack(tracks),
    handleNextTrack: () => handleNextTrack(tracks),
    loadTracks
  };
}

