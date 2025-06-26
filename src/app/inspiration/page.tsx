
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Images as ImagesIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getHairstyleInspiration } from "@/ai/flows/hairstyle-inspiration-flow";
import { Skeleton } from "@/components/ui/skeleton";

export default function InspirationPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const examplePrompts = [
    "Une femme avec une coupe pixie courte et audacieuse avec des mèches violettes vibrantes.",
    "Un homme aux cheveux bouclés de longueur moyenne, coiffés dans un look texturé et désordonné.",
    "Tresses peules élaborées avec des perles en bois et des manchettes dorées sur une jeune femme.",
    "Un dégradé américain classique et net avec un contour défini sur un homme.",
  ];

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ variant: "destructive", title: "Veuillez entrer une description." });
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const result = await getHairstyleInspiration({ prompt });
      setGeneratedImages(result.generatedImages);
    } catch (error) {
      console.error("Error generating inspiration:", error);
      toast({
        variant: "destructive",
        title: "La génération a échoué",
        description: "Un problème est survenu. Veuillez réessayer.",
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
          <Wand2 className="h-10 w-10" /> Inspiration Coiffure IA
        </h1>
        <p className="text-muted-foreground mt-2">
          Décrivez la coiffure de vos rêves et laissez notre IA générer une galerie d'idées.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              1. Décrivez un Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="ex: 'Un mohawk multicolore et vibrant avec les côtés rasés.'"
              className="min-h-[100px] text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
             <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ou essayez un exemple :</p>
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
              {isLoading ? "Génération en cours..." : "Générer la Galerie"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ImagesIcon className="h-5 w-5" /> 2. Votre Galerie d'Inspiration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-square">
                        <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                ))
              ) : generatedImages.length > 0 ? (
                generatedImages.map((src, index) => (
                   <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                            src={src}
                            alt={`Inspiration de coiffure générée par IA ${index + 1}`}
                            width={256}
                            height={256}
                            className="object-cover w-full h-full"
                        />
                   </div>
                ))
              ) : (
                 <div className="col-span-2 text-center text-muted-foreground p-4 h-64 flex flex-col justify-center items-center bg-muted rounded-lg">
                    <ImagesIcon className="h-10 w-10 mb-4 text-primary/50" />
                    <p className="font-semibold">Votre galerie d'inspiration apparaîtra ici.</p>
                </div>
              )}
            </div>
            {generatedImages.length > 0 && <p className="text-center text-sm text-muted-foreground mt-4">Enregistrez vos images préférées et montrez-les à votre coiffeur !</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
