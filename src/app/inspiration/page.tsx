"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getHairstyleInspiration } from "@/ai/flows/hairstyle-inspiration-flow";

export default function InspirationPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const examplePrompts = [
    "A woman with a short, edgy pixie cut with vibrant purple highlights.",
    "A man with medium-length curly hair, styled in a messy, textured look.",
    "Elaborate Fulani braids with wooden beads and gold cuffs on a young woman.",
    "A classic, sharp skin-fade with a defined line-up on a man.",
  ];

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ variant: "destructive", title: "Please enter a description." });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await getHairstyleInspiration({ prompt });
      setGeneratedImage(result.generatedImage);
    } catch (error) {
      console.error("Error generating inspiration:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (p: string) => {
      setPrompt(p);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
          <Wand2 className="h-10 w-10" /> AI Hairstyle Inspiration
        </h1>
        <p className="text-muted-foreground mt-2">
          Describe your dream hairstyle and let our AI bring it to life.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              1. Describe a Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'A vibrant, multi-colored mohawk with shaved sides.'"
              className="min-h-[100px] text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
             <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((p, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => handleExampleClick(p)} className="h-auto text-wrap py-1.5">"{p.substring(0, 40)}..."</Button>
                    ))}
                </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2" />
              )}
              {isLoading ? "Generating..." : "Generate Inspiration"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> 2. Your Generated Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating your vision...</p>
                </div>
              ) : generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="AI generated hairstyle"
                  width={512}
                  height={512}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  Your hairstyle inspiration will appear here.
                </div>
              )}
            </div>
            {generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Save this image and show it to your stylist!</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
