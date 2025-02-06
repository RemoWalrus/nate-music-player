import { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import { fetchArtistTopTracks } from "../utils/spotify";
import { useToast } from "../components/ui/use-toast";

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

const Index = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");

  useEffect(() => {
    const loadTracks = async () => {
      const fetchedTracks = await fetchArtistTopTracks();
      setTracks(fetchedTracks);
      if (fetchedTracks.length > 0) {
        setCurrentTrack({
          name: fetchedTracks[0].name,
          artist: fetchedTracks[0].artists[0].name,
          albumUrl: fetchedTracks[0].album.images[0]?.url,
          isPlaying: false,
          id: fetchedTracks[0].id,
        });
      }
    };

    loadTracks();
  }, []);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack({
      name: track.name,
      artist: track.artists[0].name,
      albumUrl: track.album.images[0]?.url,
      isPlaying: true,
      id: track.id,
    });

    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists[0].name}`,
    });
  };

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