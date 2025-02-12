
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { fetchArtistTopTracks, loadSpotifyCredentials } from "../utils/spotify";
import { encryptFileName } from "../utils/fileEncryption";
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

  const fetchTrackUrls = async () => {
    try {
      console.log('Fetching all track URLs from Supabase');
      const { data: urlsData, error: urlsError } = await supabase
        .from('track_urls')
        .select('*');

      if (urlsError) {
        console.error('Error fetching track URLs:', urlsError);
        return null;
      }

      console.log('Received track URLs data:', urlsData);

      const urlsMap: Record<string, TrackUrls> = {};
      
      for (const track of urlsData || []) {
        let mp3Url = null;
        if (track.mp3_url) {
          const { data: publicUrl } = supabase.storage
            .from('audio')
            .getPublicUrl(track.mp3_url);
          
          if (publicUrl) {
            const url = new URL(publicUrl.publicUrl);
            const pathParts = url.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const encryptedFileName = encryptFileName(fileName);
            pathParts[pathParts.length - 1] = encryptedFileName;
            url.pathname = pathParts.join('/');
            mp3Url = url.toString();
            console.log('Generated encrypted URL for', track.spotify_track_id, ':', mp3Url);
          }
        }

        urlsMap[track.spotify_track_id] = {
          ...track,
          mp3_url: mp3Url
        };
      }

      console.log('Final track URLs map:', urlsMap);
      setTrackUrls(urlsMap);
      return urlsMap;
    } catch (error) {
      console.error('Error in fetchTrackUrls:', error);
      return null;
    }
  };

  const createTrackFromUrls = (trackUrl: TrackUrls): SpotifyTrack => ({
    id: trackUrl.spotify_track_id,
    name: trackUrl.track_name || 'Unknown Track',
    artists: [{ name: trackUrl.artist_name || 'Unknown Artist' }],
    album: { images: [{ url: 'https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg' }] },
    preview_url: null,
    external_urls: { spotify: null },
    youtubeUrl: trackUrl.youtube_music_url,
    spotifyUrl: null,
    appleMusicUrl: trackUrl.apple_music_url,
    amazonMusicUrl: trackUrl.amazon_music_url,
    permalink: trackUrl.permalink
  });

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
      const urlsMap = await fetchTrackUrls();
      if (!urlsMap) {
        setIsLoading(false);
        return;
      }

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
        const randomTrackUrls = urlsMap[randomTrack.id];
        
        setCurrentTrackIndex(randomIndex);
        setCurrentTrack({
          id: randomTrack.id,
          name: randomTrack.name,
          artist: randomTrack.artists[0].name,
          albumUrl: randomTrack.album.images[0]?.url,
          isPlaying: false,
          previewUrl: randomTrack.preview_url,
          mp3Url: randomTrackUrls?.mp3_url || null,
          youtubeUrl: randomTrackUrls?.youtube_music_url || null,
          spotifyUrl: randomTrack.external_urls?.spotify || null,
          appleMusicUrl: randomTrackUrls?.apple_music_url || null,
          amazonMusicUrl: randomTrackUrls?.amazon_music_url || null,
          permalink: randomTrackUrls?.permalink || ''
        });
      }

      // Enhance all tracks with URLs
      const enhancedTracks = allTracks.filter(track => urlsMap[track.id]).map(track => ({
        ...track,
        youtubeUrl: urlsMap[track.id]?.youtube_music_url || null,
        spotifyUrl: track.external_urls?.spotify || null,
        appleMusicUrl: urlsMap[track.id]?.apple_music_url || null,
        amazonMusicUrl: urlsMap[track.id]?.amazon_music_url || null,
        permalink: urlsMap[track.id]?.permalink || ''
      }));

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

  const handleTrackSelect = (track: SpotifyTrack) => {
    const newIndex = tracks.findIndex(t => t.id === track.id);
    if (newIndex !== -1) {
      setCurrentTrackIndex(newIndex);
    }
    
    const trackUrlData = trackUrls[track.id];
    console.log('Selected track URLs:', trackUrlData);
    
    setCurrentTrack({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      albumUrl: track.album.images[0]?.url,
      isPlaying: true,
      previewUrl: track.preview_url,
      mp3Url: trackUrlData?.mp3_url || null,
      youtubeUrl: trackUrlData?.youtube_music_url || null,
      spotifyUrl: track.external_urls?.spotify || null,
      appleMusicUrl: trackUrlData?.apple_music_url || null,
      amazonMusicUrl: trackUrlData?.amazon_music_url || null,
      permalink: trackUrlData?.permalink || ''
    });

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
