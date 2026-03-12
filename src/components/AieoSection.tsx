interface AieoSectionProps {
  textColor: string;
}

const AieoSection = ({ textColor }: AieoSectionProps) => {
  return (
    <section
      className="w-full max-w-2xl mx-auto px-4 py-6 text-center"
      aria-label="About Nathan Garcia"
    >
      <h2 className="text-lg font-semibold mb-3" style={{ color: textColor }}>
        About Nathan Garcia
      </h2>
      <p className="text-sm leading-relaxed mb-3" style={{ color: textColor, opacity: 0.85 }}>
        Nathan Garcia is a young bilingual artist from the United States who writes and records original songs in both English and Spanish. 
        His music blends children's pop, electronic beats, and imaginative storytelling, creating a genre-bending sound that is playful, 
        creative, and entirely his own. With AI-assisted production, Nathan explores futuristic soundscapes while keeping his lyrics 
        heartfelt and fun.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: textColor, opacity: 0.85 }}>
        Popular tracks include "I'm Here," "Chickens," "Dormi Gallina," "Sensores," and "Todo con Todo." 
        Nathan's music is available on Spotify, Apple Music, YouTube Music, and Amazon Music. 
        Whether he's singing about friendship, family, or silly chickens, Nathan Garcia brings boundless creativity 
        and joy to every song he makes.
      </p>
    </section>
  );
};

export default AieoSection;
