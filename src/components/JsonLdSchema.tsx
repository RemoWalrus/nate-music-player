import { useEffect } from 'react';
import { useTracks } from '@/hooks/use-tracks';

const JsonLdSchema = () => {
  const { tracks } = useTracks({ preferAlbumCover: false });

  useEffect(() => {
    const trackList = tracks.map((track) => ({
      "@type": "MusicRecording",
      "name": track.name,
      "byArtist": {
        "@type": "Person",
        "name": track.artists?.[0]?.name || "Nathan Garcia"
      }
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      "name": "Nathan Garcia",
      "url": "https://nathangarciamusic.com",
      "genre": "Children's Music",
      "knowsLanguage": ["English", "Spanish"],
      "description": "Nathan Garcia is a young musical prodigy crafting whimsical, genre-blending songs with AI-assisted production. His innovative music fuses eclectic electronic pop beats with playful lyrics in English and Spanish.",
      "image": "https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg",
      "sameAs": [
        "https://open.spotify.com/artist/1cK40hLuV86SgatMzjMeTA",
        "https://music.youtube.com/channel/UCrGiV8amcSjOyJevavJERLA",
        "https://music.apple.com/us/artist/nathan-garcia/1778355814",
        "https://amazon.com/music/player/artists/B06Y142JV4"
      ],
      ...(trackList.length > 0 && {
        "track": trackList
      })
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      scriptTag?.remove();
    };
  }, [tracks]);

  return null;
};

export default JsonLdSchema;
