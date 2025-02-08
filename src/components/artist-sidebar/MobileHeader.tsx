
import { useState } from "react";
import { Menu, User, Music, Newspaper, Share2, Mail } from "lucide-react";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { useToast } from "@/hooks/use-toast";

interface MobileHeaderProps {
  artistBio: string;
}

export const MobileHeader = ({ artistBio }: MobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}?og=true`;
      if (navigator.share) {
        await navigator.share({
          title: 'Nathan Garcia Music',
          text: 'Check out Nathan Garcia\'s music!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          description: "Link copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const iconProps = { color: "#ea384c" };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <img 
          src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
          alt="Nathan Garcia Logo" 
          className="h-8 w-8"
        />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu {...iconProps} className="h-5 w-5" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <User {...iconProps} className="h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-medium">Nathan Garcia</h3>
                <p className="text-sm text-gray-500">{artistBio}</p>
              </div>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-3 text-gray-700">
              <Music {...iconProps} className="h-5 w-5 shrink-0" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Music Platforms</h4>
                <MusicPlatformLinks className="flex flex-col gap-2" />
              </div>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-3 text-gray-700">
              <Newspaper {...iconProps} className="h-5 w-5 shrink-0" />
              <div className="space-y-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">New Single Release</h4>
                  <p className="text-sm text-gray-500">
                    Latest single "Todo con todo" now available on all platforms.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-3 text-gray-700">
              <Mail {...iconProps} className="h-5 w-5 shrink-0" />
              <div className="space-y-2">
                <a 
                  href="mailto:info@nathangarciamusic.com"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Email us!
                </a>
              </div>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-3 text-gray-700">
              <Share2 {...iconProps} className="h-5 w-5 shrink-0" />
              <div className="space-y-2">
                <button 
                  onClick={handleShare}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Share with your friends
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
