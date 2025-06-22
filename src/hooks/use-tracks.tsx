
import { useState } from "react";
import { useToast } from "./use-toast";
import { loadSpotifyCredentials } from "../utils/spotify";
import { fetchTrackUrls } from "../utils/trackUrlUtils";
import { combineTracksWithUrls } from "../utils/trackCombiner";
import { createTrackFromSpotify, getRandomTrackIndex } from "../utils/trackHelpers";
import type { SpotifyTrack, TrackUrls, Track } from "../types/music";

export function useTracks() {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [trackUrls, setTrackUrls] = useState<Record<string, TrackUrls>>({});
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '',
    name: '',
    artist: '',
    albumUrl: '',
    isPlaying: false,
    previewUrl: null,
    mp3Url: null,
    youtubeUrl: null,
    spotifyUrl: null,
    appleMusicUrl: null,
    amazonMusicUrl: null,
    permalink: ''
  });
  const [isLoading, setIsLoading] = useState(true);

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

      // First fetch track URLs from Supabase
      const urlsMap = await fetchTrackUrls();
      if (urlsMap) {
        setTrackUrls(urlsMap);
      }
      
      // Combine Spotify tracks with custom tracks from database
      const combinedTracks = await combineTracksWithUrls(urlsMap);
      setTracks(combinedTracks);
      
      // Set initial random track if we have any tracks
      if (combinedTracks.length > 0 && urlsMap) {
        const randomIndex = getRandomTrackIndex(combinedTracks.length);
        const randomTrack = combinedTracks[randomIndex];
        const randomTrackUrls = urlsMap[randomTrack.id];
        console.log('Setting initial random track with URLs:', randomTrackUrls);
        
        setCurrentTrackIndex(randomIndex);
        setCurrentTrack(createTrackFromSpotify(randomTrack, urlsMap, false));
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

  const handleTrackSelect = (track: SpotifyTrack) => {
    const newIndex = tracks.findIndex(t => t.id === track.id);
    if (newIndex !== -1) {
      setCurrentTrackIndex(newIndex);
    }
    
    const trackUrlData = trackUrls[track.id];
    console.log('Selected track URLs:', trackUrlData);
    
    setCurrentTrack(createTrackFromSpotify(track, trackUrls, true));

    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists[0].name}`,
    });
  };

  const handlePrevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    handleTrackSelect(tracks[newIndex]);
  };

  const handleNextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    handleTrackSelect(tracks[newIndex]);
  };

  return {
    tracks,
    currentTrack,
    isLoading,
    handleTrackSelect,
    handlePrevTrack,
    handleNextTrack,
    loadTracks
  };
}
