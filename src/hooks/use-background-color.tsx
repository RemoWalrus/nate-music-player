
import { useEffect, useRef } from "react";
import { average } from "color.js";

export function useBackgroundColor(
  albumUrl: string | undefined,
  setBackgroundColor: (color: string) => void
) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColor = async () => {
      if (imageRef.current) {
        try {
          const colors = await average(imageRef.current.src);
          if (Array.isArray(colors)) {
            const [r, g, b] = colors;
            setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
          }
        } catch (error) {
          console.error("Error extracting color:", error);
          setBackgroundColor("rgb(30, 30, 30)");
        }
      }
    };

    if (albumUrl) {
      extractColor();
    }
  }, [albumUrl, setBackgroundColor]);

  return imageRef;
}
