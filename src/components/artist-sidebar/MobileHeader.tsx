
import React, { useState, useEffect } from "react";
import { Menu, User, Music, Newspaper, Share2, Mail, Disc, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { MusicPlatformLinks } from "./MusicPlatformLinks";
import { useToast } from "@/hooks/use-toast";
import { SidebarSection } from "../types/sidebar";
import { useTracks } from "@/hooks/use-tracks";
import { supabase } from "@/integrations/supabase/client";
import { Album } from "@/hooks/use-album";

interface MobileHeaderProps {
  artistBio: string;
  sidebarSections: SidebarSection[];
}

const iconMap: { [key: string]: typeof User } = {
  User,
  Music,
  Newspaper,
  Mail,
  Share2,
  Disk: Disc,
  Smartphone,
};

export const MobileHeader = ({ artistBio, sidebarSections }: MobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { toast } = useToast();
  const { currentTrack } = useTracks();

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching albums:', error);
      } else if (data) {
        setAlbums(data);
      }
    };

    fetchAlbums();
  }, []);

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

  const getSectionContent = (section: SidebarSection) => {
    switch (section.label) {
      case "Artist":
        return (
          <div className="space-y-1 text-left">
            <h3 className="font-medium text-base">Nathan Garcia</h3>
            <p className="text-xs text-gray-600 whitespace-pre-line">{artistBio}</p>
          </div>
        );
      case "Music":
        return (
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-medium text-gray-900">Listen on</h4>
            <MusicPlatformLinks className="flex flex-col gap-2" />
          </div>
        );
      case "Contact":
        return (
          <a 
            href="mailto:remo@romergarcia.com?subject=Nathan%20Garcia%20Music&body=Hi%2C%20I%27m%20reaching%20Nathan%20Garcia%27s%20team"
            className="text-xs text-gray-600 hover:text-gray-900 text-left"
          >
            Contact us
          </a>
        );
      case "Share":
        return (
          <button 
            onClick={handleShare}
            className="text-xs text-gray-600 hover:text-gray-900 text-left"
          >
            Share this page
          </button>
        );
      case "Todita":
        return (
          <Link 
            to="/todita" 
            className="text-xs text-gray-600 hover:text-gray-900 text-left block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Todita Universe Character Generator
          </Link>
        );
      default:
        return (
          <p className="text-xs text-gray-600 text-left">
            {section.content}
          </p>
        );
    }
  };

  const getAlbumsContent = () => {
    if (albums.length === 0) {
      return (
        <div className="space-y-1 text-left">
          <p className="text-xs text-gray-600">No albums available</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 text-left">
        {albums.map((album) => (
          <Link
            key={album.id}
            to={`/albums/${album.name.toLowerCase()}`}
            className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {album.name.charAt(0).toUpperCase() + album.name.slice(1)}
          </Link>
        ))}
      </div>
    );
  };

  // Insert Albums section before Contact section
  const sectionsWithAlbums = [...sidebarSections];
  const contactIndex = sectionsWithAlbums.findIndex(section => section.label === "Contact");
  
  if (contactIndex !== -1) {
    sectionsWithAlbums.splice(contactIndex, 0, {
      id: 'albums-section',
      label: albums.length === 1 ? 'Album' : 'Albums',
      icon: 'Disk',
      content: '',
      order_index: contactIndex,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
  }

  const iconProps = { color: "#ea384c" };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-[9998] shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
              alt="Nathan Garcia Logo" 
              className="h-8 w-8"
            />
          </Link>
          {currentTrack && currentTrack.isPlaying && (
            <span className="text-xs font-medium text-gray-900">
              Now Playing: {currentTrack.name}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu {...iconProps} className="h-5 w-5" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[61px] bg-white z-[9999] overflow-y-auto"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setIsMobileMenuOpen(false);
               }
             }}>
          <div className="p-4 space-y-4">
            {sectionsWithAlbums.map((section, index) => {
              const Icon = iconMap[section.icon];
              return (
                <React.Fragment key={section.id}>
                  {index > 0 && <div className="border-t border-gray-200" />}
                  <div className="flex items-start gap-3 py-2">
                    <Icon {...iconProps} className="h-5 w-5 shrink-0 mt-1" />
                    <div className="space-y-2 flex-1 text-left">
                      <h3 className="text-xs font-medium text-gray-900">{section.label}</h3>
                      {section.id === 'albums-section' ? getAlbumsContent() : getSectionContent(section)}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
