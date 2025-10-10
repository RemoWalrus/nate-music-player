import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import toditaReference from "@/assets/todita-reference.jpeg";

const Todita = () => {
  const [characterType, setCharacterType] = useState<"human" | "android">("android");
  const [characterName, setCharacterName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!characterName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a character name",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Convert reference image to base64
      const response = await fetch(toditaReference);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        try {
          const functionResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-character`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({
                characterType,
                characterName,
                referenceImage: base64data,
              }),
            }
          );

          if (!functionResponse.ok) {
            const errorData = await functionResponse.json();
            throw new Error(errorData.error || "Failed to generate character");
          }

          const data = await functionResponse.json();
          setGeneratedImage(data.imageUrl);
          
          toast({
            title: "Character generated!",
            description: `${characterName} has been created successfully.`,
          });
        } catch (error) {
          console.error("Error generating character:", error);
          toast({
            title: "Generation failed",
            description: error instanceof Error ? error.message : "Failed to generate character",
            variant: "destructive",
          });
        } finally {
          setIsGenerating(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error processing reference image:", error);
      toast({
        title: "Error",
        description: "Failed to process reference image",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Todita Universe Character Generator
        </h1>

        <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-3 block">Character Type</Label>
              <RadioGroup
                value={characterType}
                onValueChange={(value) => setCharacterType(value as "human" | "android")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="human" id="human" />
                  <Label htmlFor="human" className="cursor-pointer">
                    Human
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="android" id="android" />
                  <Label htmlFor="android" className="cursor-pointer">
                    Android
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="name" className="text-lg mb-3 block">
                Character Name
              </Label>
              <Input
                id="name"
                placeholder="Enter character name..."
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="text-lg"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isGenerating ? "Generating..." : "Generate Character"}
            </Button>
          </div>
        </div>

        {generatedImage && (
          <div className="bg-card rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {characterName}
            </h2>
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt={`Generated character ${characterName}`}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todita;
