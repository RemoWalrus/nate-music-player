
import { useState } from "react";
import { useToast } from "./use-toast";
import type { SpotifyTrack, Track, TrackUrls } from "../types/music";
import { createTrackFromSpotify } from "../utils/tracks";

export function useTrackSelection(trackUrls: Record<string, TrackUrls>) {
  const { toast } = useToast();
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

  const handleTrackSelect = (track: SpotifyTrack, tracks: SpotifyTrack[]) => {
    const newIndex = tracks.findIndex(t => t.id === track.id);
    if (newIndex !== -1) {
      setCurrentTrackIndex(newIndex);
    }
    
    const trackUrlData = trackUrls[track.id];
    console.log('Selected track URLs:', trackUrlData);
    
    setCurrentTrack(createTrackFromSpotify(track, trackUrlData));

    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists[0].name}`,
    });
  };

  const handlePrevTrack = (tracks: SpotifyTrack[]) => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    handleTrackSelect(tracks[newIndex], tracks);
  };

  const handleNextTrack = (tracks: SpotifyTrack[]) => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    handleTrackSelect(tracks[newIndex], tracks);
  };

  return {
    currentTrack,
    currentTrackIndex,
    handleTrackSelect,
    handlePrevTrack,
    handleNextTrack
  };
}

