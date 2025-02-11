
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Youtube, Music2, Spotify } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PlatformLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  is_active: boolean;
}

interface MusicPlatformLinksProps {
  className?: string;
}

export const MusicPlatformLinks = ({ className }: MusicPlatformLinksProps) => {
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlatformLinks = async () => {
      const { data, error } = await supabase
        .from('platform_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching platform links:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load platform links. Please try again later.",
        });
        return;
      }

      setPlatformLinks(data);
    };

    fetchPlatformLinks();
  }, [toast]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube music':
        return <Youtube className="w-4 h-4" />;
      case 'spotify':
        return <Spotify className="w-4 h-4" />;
      case 'apple music':
      case 'amazon music':
        return <Music2 className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {platformLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {getPlatformIcon(link.platform)}
          <span>{link.platform}</span>
        </a>
      ))}
    </div>
  );
};
