
import { supabase } from "@/integrations/supabase/client";

export const updateTrackArtwork = async (trackName: string, artworkFileName: string) => {
  try {
    const { error } = await supabase
      .from('track_urls')
      .update({ artwork_url: artworkFileName })
      .eq('track_name', trackName);

    if (error) {
      console.error('Error updating track artwork:', error);
      return false;
    }

    console.log(`Updated artwork for "${trackName}" to "${artworkFileName}"`);
    return true;
  } catch (error) {
    console.error('Error updating track artwork:', error);
    return false;
  }
};
