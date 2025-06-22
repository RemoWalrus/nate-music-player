
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
      console.log('🔍 Starting fetchTrackUrls...');
      
      // Changed to fetch ALL tracks from track_urls table
      const { data: urlsData, error: urlsError } = await supabase
        .from('track_urls')
        .select('*');

      if (urlsError) {
        console.error('❌ Error fetching track URLs:', urlsError);
        return null;
      }

      console.log('✅ Raw track URLs data from database:', urlsData);
      console.log('📊 Number of tracks found:', urlsData?.length || 0);

      const urlsMap: Record<string, TrackUrls> = {};
      
      for (const track of urlsData || []) {
        console.log(`🎵 Processing track: "${track.track_name}" (ID: ${track.spotify_track_id})`);
        console.log(`🖼️ Artwork URL from DB: ${track.artwork_url}`);
        
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
            console.log('🔊 Generated encrypted MP3 URL for', track.spotify_track_id, ':', mp3Url);
          }
        }

        // Handle custom artwork URLs from Supabase storage
        let artworkUrl = track.artwork_url;
        if (track.artwork_url && !track.artwork_url.startsWith('http')) {
          // If artwork_url is just a filename, get the full URL from storage
          const { data: artworkPublicUrl } = supabase.storage
            .from('graphics')
            .getPublicUrl(track.artwork_url);
          
          if (artworkPublicUrl) {
            artworkUrl = artworkPublicUrl.publicUrl;
            console.log('🖼️ Generated artwork URL for', track.spotify_track_id, ':', artworkUrl);
          }
        }

        urlsMap[track.spotify_track_id] = {
          ...track,
          mp3_url: mp3Url,
          artwork_url: artworkUrl
        };
        
        console.log(`✅ Track "${track.track_name}" processed with artwork: ${artworkUrl}`);
      }

      console.log('🗺️ Final track URLs map:', urlsMap);
      console.log('📈 Total tracks in map:', Object.keys(urlsMap).length);
      setTrackUrls(urlsMap);
      return urlsMap;
    } catch (error) {
      console.error('💥 Error in fetchTrackUrls:', error);
      return null;
    }
  };

  const createCustomTrackFromUrls = (trackData: TrackUrls): SpotifyTrack => {
    return {
      id: trackData.spotify_track_id,
      name: trackData.track_name || 'Unknown Track',
      album: {
        images: [{ url: trackData.artwork_url || '/placeholder.svg' }]
      },
      artists: [{ name: trackData.artist_name || 'Unknown Artist' }],
      preview_url: null,
      external_urls: {},
      youtubeUrl: trackData.youtube_music_url,
      spotifyUrl: `https://open.spotify.com/track/${trackData.spotify_track_id}`,
      appleMusicUrl: trackData.apple_music_url,
      amazonMusicUrl: trackData.amazon_music_url,
      permalink: trackData.permalink || ''
    };
  };

  const loadTracks = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting loadTracks...');
      
      const credentialsLoaded = await loadSpotifyCredentials();
      if (!credentialsLoaded) {
        console.error('❌ Failed to load Spotify credentials');
        toast({
          title: "Error",
          description: "Failed to load Spotify credentials. Please check your Supabase secrets.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('✅ Spotify credentials loaded');

      // First fetch track URLs from Supabase
      const urlsMap = await fetchTrackUrls([]);
      console.log('📊 URLs map result:', urlsMap ? 'Success' : 'Failed');
      
      // Then fetch tracks from Spotify
      const fetchedTracks = await fetchArtistTopTracks();
      console.log('🎵 Fetched Spotify tracks:', fetchedTracks?.length || 0, 'tracks');
      
      // Combine Spotify tracks with custom tracks from database
      const combinedTracks: SpotifyTrack[] = [];
      
      // Add Spotify tracks that have URLs in our database
      if (fetchedTracks.length > 0 && urlsMap) {
        const tracksWithUrls = fetchedTracks.filter(track => {
          const hasUrls = urlsMap[track.id];
          console.log(`🔍 Track "${track.name}" (${track.id}) has URLs: ${!!hasUrls}`);
          return hasUrls;
        });
        
        console.log('📋 Spotify tracks with URLs:', tracksWithUrls.length);
        
        combinedTracks.push(...tracksWithUrls.map(track => {
          const trackUrlData = urlsMap[track.id];
          console.log(`🎨 Using artwork for "${track.name}":`, trackUrlData.artwork_url || 'Spotify default');
          
          return {
            ...track,
            // Use custom artwork if available, otherwise use Spotify's
            album: {
              images: trackUrlData.artwork_url 
                ? [{ url: trackUrlData.artwork_url }]
                : track.album.images
            },
            youtubeUrl: trackUrlData?.youtube_music_url || null,
            spotifyUrl: track.external_urls?.spotify || null,
            appleMusicUrl: trackUrlData?.apple_music_url || null,
            amazonMusicUrl: trackUrlData?.amazon_music_url || null,
            permalink: trackUrlData?.permalink || ''
          };
        }));
      }
      
      // Add custom tracks that don't have Spotify counterparts
      if (urlsMap) {
        const spotifyTrackIds = new Set(fetchedTracks.map(track => track.id));
        const customTracks = Object.values(urlsMap)
          .filter(trackData => {
            const isCustom = !spotifyTrackIds.has(trackData.spotify_track_id);
            if (isCustom) {
              console.log(`🎭 Found custom track: "${trackData.track_name}"`);
            }
            return isCustom;
          })
          .map(trackData => createCustomTrackFromUrls(trackData));
        
        console.log('🎭 Custom tracks added:', customTracks.length);
        combinedTracks.push(...customTracks);
      }
      
      console.log('🎯 Final combined tracks:', combinedTracks.length);
      console.log('📋 Track list:', combinedTracks.map(t => `"${t.name}" - ${t.album.images[0]?.url ? 'Has artwork' : 'No artwork'}`));
      
      setTracks(combinedTracks);
      
      // Set initial random track if we have any tracks
      if (combinedTracks.length > 0 && urlsMap) {
        const randomIndex = Math.floor(Math.random() * combinedTracks.length);
        const randomTrack = combinedTracks[randomIndex];
        const randomTrackUrls = urlsMap[randomTrack.id];
        console.log('🎲 Setting initial random track:', randomTrack.name);
        console.log('🔗 Track URLs:', randomTrackUrls);
        
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
    } catch (error) {
      console.error('💥 Error loading tracks:', error);
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
