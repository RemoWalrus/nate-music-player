import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { characterType, characterName, referenceImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let prompt = "";
    const messages: any[] = [];

    if (characterName.toLowerCase() === "todita") {
      // Always use the exact reference image for Todita, regardless of type selected
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Generate an android character exactly like this reference image. Use the same cartoon style, color palette, and design aesthetic. DO NOT include any text or name in the image - just the character illustration."
          },
          {
            type: "image_url",
            image_url: {
              url: referenceImage
            }
          }
        ]
      });
    } else {
      // Use reference as style guide
      const typeDescription = characterType === "android" 
        ? "an android/robot character"
        : "a human character";
      
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate ${typeDescription} using the same cartoon art style as this reference image. Match the clean lines, bold colors, and animated aesthetic. Create a full body character design with a friendly pose. DO NOT include any text or name in the image - just the character illustration.`
          },
          {
            type: "image_url",
            image_url: {
              url: referenceImage
            }
          }
        ]
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: messages,
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    return new Response(JSON.stringify({ imageUrl: generatedImageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-character error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
