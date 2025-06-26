
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Upload, Images, Loader2, Scissors } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getStyleSuggestion } from "@/ai/flows/style-suggestion-flow";
import { getHairstyleExamples, type HairstyleExample } from "@/ai/flows/hairstyle-examples-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function StyleAiPage() {
  const { toast } = useToast();

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [hairstylePrompt, setHairstylePrompt] = useState<string>("");
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
          title: "Impossible de charger les styles",
          description: "Échec du chargement des exemples de coiffures. Veuillez rafraîchir la page.",
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
      toast({ variant: "destructive", title: "Veuillez d'abord télécharger une photo." });
      return;
    }
    if (!hairstylePrompt) {
      toast({ variant: "destructive", title: "Veuillez décrire une coiffure." });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await getStyleSuggestion({
        userImage: originalImage,
        hairstyle: hairstylePrompt,
      });
      setGeneratedImage(result.generatedImage);
    } catch (error) {
      console.error("Error generating style:", error);
      toast({
        variant: "destructive",
        title: "La génération a échoué",
        description: "Un problème est survenu. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
          <Wand2 className="h-10 w-10"/> Essai Virtuel de Coiffure IA
        </h1>
        <p className="text-muted-foreground mt-2">Essayez virtuellement un nouveau look avant de réserver.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Upload className="h-5 w-5" /> 1. Votre Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Téléchargez votre photo</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">Pour de meilleurs résultats, utilisez une photo de face et nette.</p>
            </div>

            <div className="font-headline text-lg mt-6 flex items-center gap-2"><Scissors className="h-5 w-5"/> 2. Décrivez une Coiffure</div>
            
            <Textarea
              placeholder="ex: 'Un mohawk stylé avec des pointes bleues vibrantes...'"
              className="min-h-[100px]"
              value={hairstylePrompt}
              onChange={(e) => setHairstylePrompt(e.target.value)}
            />

            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ou commencez avec un exemple :</p>
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
                        className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all"
                        onClick={() => setHairstylePrompt(style.name)}
                        >
                        <Image src={style.image} alt={style.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-center text-sm font-bold p-1">{style.name}</span>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>

            <Button className="w-full mt-6" size="lg" onClick={handleGenerate} disabled={isLoading || !originalImage || !hairstylePrompt || areExamplesLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2" />}
              {isLoading ? "Génération en cours..." : "Générer le Nouveau Look"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Images className="h-5 w-5" /> Votre Relooking Virtuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="text-center font-semibold">Original</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {originalImage ? (
                          <Image src={originalImage} alt="Photo originale de l'utilisateur" width={400} height={400} className="object-cover w-full h-full"/>
                        ) : (
                          <div className="text-center text-muted-foreground p-4">Téléchargez une photo pour commencer</div>
                        )}
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="text-center font-semibold">Nouveau Style</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                         {isLoading ? (
                           <div className="flex flex-col items-center gap-2 text-muted-foreground">
                             <Loader2 className="h-8 w-8 animate-spin"/>
                             <p>Génération...</p>
                           </div>
                         ) : generatedImage ? (
                           <Image src={generatedImage} alt="Utilisateur avec une nouvelle coiffure" width={400} height={400} className="object-cover w-full h-full"/>
                         ) : (
                           <div className="text-center text-muted-foreground p-4">Votre nouveau look apparaîtra ici</div>
                         )}
                    </div>
                </div>
            </div>
            {!isLoading && !generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Les résultats apparaîtront ici après la génération.</p>}
            {generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Vous aimez votre nouveau look ? Prenez rendez-vous maintenant !</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
