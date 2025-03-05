
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

  const fetchTrackUrls = async (trackIds: string[]) => {
    try {
      console.log('Fetching all track URLs from Supabase');
      
      // Changed to fetch ALL tracks from track_urls table
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
      const urlsMap = await fetchTrackUrls([]);
      
      // Then fetch tracks from Spotify
      const fetchedTracks = await fetchArtistTopTracks();
      console.log('Fetched Spotify tracks:', fetchedTracks);
      
      // Set tracks - IMPORTANT CHANGE: Include ALL tracks, not just those with URLs
      const enhancedTracks = fetchedTracks.map(track => ({
        ...track,
        youtubeUrl: urlsMap?.[track.id]?.youtube_music_url || null,
        spotifyUrl: track.external_urls?.spotify || null,
        appleMusicUrl: urlsMap?.[track.id]?.apple_music_url || null,
        amazonMusicUrl: urlsMap?.[track.id]?.amazon_music_url || null,
        permalink: urlsMap?.[track.id]?.permalink || ''
      }));
      
      console.log('Final enhanced tracks:', enhancedTracks);
      setTracks(enhancedTracks);
      
      // Find a track to set as current
      if (urlsMap && fetchedTracks.length > 0) {
        // First try to find a track that has a URL in Supabase
        const tracksWithUrls = fetchedTracks.filter(track => urlsMap[track.id]);
        
        if (tracksWithUrls.length > 0) {
          // Use a track with URLs
          const randomIndex = Math.floor(Math.random() * tracksWithUrls.length);
          const randomTrack = tracksWithUrls[randomIndex];
          const randomTrackUrls = urlsMap[randomTrack.id];
          console.log('Setting initial random track with URLs:', randomTrackUrls);
          
          setCurrentTrackIndex(fetchedTracks.findIndex(t => t.id === randomTrack.id));
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
        } else {
          // If no track has URLs, just use the first track from Spotify
          const firstTrack = fetchedTracks[0];
          console.log('No tracks with URLs found, using first track:', firstTrack);
          
          setCurrentTrackIndex(0);
          setCurrentTrack({
            id: firstTrack.id,
            name: firstTrack.name,
            artist: firstTrack.artists[0].name,
            albumUrl: firstTrack.album.images[0]?.url,
            isPlaying: false,
            previewUrl: firstTrack.preview_url,
            mp3Url: null,
            youtubeUrl: null,
            spotifyUrl: firstTrack.external_urls?.spotify || null,
            appleMusicUrl: null,
            amazonMusicUrl: null,
            permalink: ''
          });
        }
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
