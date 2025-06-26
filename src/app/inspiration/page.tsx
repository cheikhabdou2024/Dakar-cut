
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
    setGeneratedImage(null);

    try {
      const result = await getHairstyleInspiration({ prompt });
      setGeneratedImage(result.generatedImage);
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
          Décrivez la coiffure de vos rêves et laissez notre IA lui donner vie.
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
              {isLoading ? "Génération en cours..." : "Générer l'inspiration"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> 2. Votre Image Générée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Création de votre vision...</p>
                </div>
              ) : generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="Coiffure générée par IA"
                  width={512}
                  height={512}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  L'inspiration pour votre coiffure apparaîtra ici.
                </div>
              )}
            </div>
            {generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Enregistrez cette image et montrez-la à votre coiffeur !</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
