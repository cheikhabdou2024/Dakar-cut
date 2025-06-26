"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Upload, Images, Loader2, Scissors } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getStyleSuggestion } from "@/ai/flows/style-suggestion-flow";
import { getHairstyleExamples, type HairstyleExample } from "@/ai/flows/hairstyle-examples-flow";
import { Skeleton } from "@/components/ui/skeleton";

export default function StyleAiPage() {
  const { toast } = useToast();

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [hairstyleExamples, setHairstyleExamples] = useState<HairstyleExample[]>([]);
  const [areExamplesLoading, setAreExamplesLoading] = useState(true);

  useEffect(() => {
    async function fetchExamples() {
      try {
        setAreExamplesLoading(true);
        const result = await getHairstyleExamples();
        setHairstyleExamples(result.examples);
      } catch (error) {
        console.error("Error fetching hairstyle examples:", error);
        toast({
          variant: "destructive",
          title: "Could not load styles",
          description: "Failed to load hairstyle examples. Please refresh the page.",
        });
      } finally {
        setAreExamplesLoading(false);
      }
    }
    fetchExamples();
  }, [toast]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      toast({ variant: "destructive", title: "Please upload a photo first." });
      return;
    }
    if (!selectedStyle) {
      toast({ variant: "destructive", title: "Please select a hairstyle." });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await getStyleSuggestion({
        userImage: originalImage,
        hairstyle: selectedStyle,
      });
      setGeneratedImage(result.generatedImage);
    } catch (error) {
      console.error("Error generating style:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
          <Wand2 className="h-10 w-10"/> Style AI Try-On
        </h1>
        <p className="text-muted-foreground mt-2">Virtually try on a new look before you book.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Upload className="h-5 w-5" /> 1. Your Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload your picture</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">For best results, use a clear, front-facing photo.</p>
            </div>

            <div className="font-headline text-lg mt-6 flex items-center gap-2"><Scissors className="h-5 w-5"/> 2. Choose a Hairstyle</div>
            <div className="grid grid-cols-3 gap-4">
              {areExamplesLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-square">
                        <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                  ))
              ) : (
                hairstyleExamples.map((style) => (
                  <div key={style.name} 
                    className={cn(
                      "relative aspect-square cursor-pointer group rounded-lg overflow-hidden border-2 transition-all",
                      selectedStyle === style.name ? "border-primary ring-2 ring-primary/50" : "border-transparent"
                    )}
                    onClick={() => setSelectedStyle(style.name)}
                    >
                      <Image src={style.image} alt={style.name} layout="fill" objectFit="cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-center text-sm font-bold p-1">{style.name}</span>
                      </div>
                  </div>
                ))
              )}
            </div>

            <Button className="w-full mt-6" size="lg" onClick={handleGenerate} disabled={isLoading || !originalImage || !selectedStyle || areExamplesLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2" />}
              {isLoading ? "Generating..." : "Generate New Look"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Images className="h-5 w-5" /> Your Virtual Makeover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="text-center font-semibold">Original</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {originalImage ? (
                          <Image src={originalImage} alt="User's original photo" width={400} height={400} className="object-cover w-full h-full"/>
                        ) : (
                          <div className="text-center text-muted-foreground p-4">Upload a photo to begin</div>
                        )}
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="text-center font-semibold">New Style</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                         {isLoading ? (
                           <div className="flex flex-col items-center gap-2 text-muted-foreground">
                             <Loader2 className="h-8 w-8 animate-spin"/>
                             <p>Generating...</p>
                           </div>
                         ) : generatedImage ? (
                           <Image src={generatedImage} alt="User with new hairstyle" width={400} height={400} className="object-cover w-full h-full"/>
                         ) : (
                           <div className="text-center text-muted-foreground p-4">Your new look will appear here</div>
                         )}
                    </div>
                </div>
            </div>
            {!isLoading && !generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Results will appear here after generation.</p>}
            {generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Like your new look? Book an appointment now!</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
