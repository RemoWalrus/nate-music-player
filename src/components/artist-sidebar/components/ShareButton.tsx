
import { useToast } from "@/hooks/use-toast";

export const useShareButton = () => {
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

  return { handleShare };
};
