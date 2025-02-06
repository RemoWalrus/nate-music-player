import { useState, useEffect } from "react";
import MusicPlayer from "../components/MusicPlayer";
import { useToast } from "../components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [track, setTrack] = useState({
    name: "Blinding Lights",
    artist: "The Weeknd",
    albumUrl: "https://i.scdn.co/image/ab67616d0000b273c6f7af36ecac3ad78a033989",
    isPlaying: false
  });

  const [backgroundColor, setBackgroundColor] = useState("rgb(30, 30, 30)");

  useEffect(() => {
    // Demo notification
    toast({
      title: "Welcome to your Music Player!",
      description: "Currently showing a demo track. Connect Spotify API for full functionality.",
    });
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-500 ease-in-out p-4"
      style={{ backgroundColor }}
    >
      <MusicPlayer 
        track={track} 
        setTrack={setTrack}
        setBackgroundColor={setBackgroundColor}
      />
    </div>
  );
};

export default Index;