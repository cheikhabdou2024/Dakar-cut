'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getHairstyleVirtualTryOn } from '@/ai/flows/hairstyle-virtual-try-on-flow';
import { getHairstyleExamples } from '@/ai/flows/hairstyle-examples-flow';
import { Upload, Wand2, Loader2, Images, Scissors, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function IACoiffurePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hairstyleType, setHairstyleType] = useState<string>('élégante');
  const [isLoading, setIsLoading] = useState(false);
  const [hairstyleDescription, setHairstyleDescription] = useState<string>('');
  const [hairstyleExamples, setHairstyleExamples] = useState<Array<{name: string, image: string}>>([]);
  const [areExamplesLoading, setAreExamplesLoading] = useState(true);

  useEffect(() => {
    async function loadExamples() {
      try {
        setAreExamplesLoading(true);
        const result = await getHairstyleExamples();
        setHairstyleExamples(result.examples);
      } catch (error) {
        console.error('Failed to load hairstyle examples:', error);
      } finally {
        setAreExamplesLoading(false);
      }
    }

    loadExamples();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
        setGeneratedImage(null); // Reset generated image when new file is uploaded
        setHairstyleDescription('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    try {
      setIsLoading(true);
      const result = await getHairstyleVirtualTryOn({
        userImage: originalImage,
        hairstyleType: hairstyleType
      });

      setGeneratedImage(result.generatedImage);
      setHairstyleDescription(result.hairstyleDescription);
    } catch (error) {
      console.error('Failed to generate hairstyle:', error);
      alert('Une erreur est survenue lors de la génération de la coiffure. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const hairstyleOptions = [
    { value: 'élégante', label: 'Élégante' },
    { value: 'décontractée', label: 'Décontractée' },
    { value: 'professionnelle', label: 'Professionnelle' },
    { value: 'tendance', label: 'Tendance' },
    { value: 'audacieuse', label: 'Audacieuse' },
    { value: 'classique', label: 'Classique' },
  ];

  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">IA Coiffure</h1>
        <p className="text-muted-foreground">
          Essayez virtuellement différentes coiffures sur votre photo et trouvez votre style parfait.
        </p>
      </div>

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

            <div className="font-headline text-lg mt-6 flex items-center gap-2">
              <Scissors className="h-5 w-5"/> 2. Choisissez un Style
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Sélectionnez le style de coiffure que vous souhaitez essayer.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select value={hairstyleType} onValueChange={setHairstyleType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisissez un style" />
              </SelectTrigger>
              <SelectContent>
                {hairstyleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Inspirations de coiffures :</p>
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
                      onClick={() => setHairstyleType(style.name.toLowerCase())}
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

            <Button className="w-full mt-6" size="lg" onClick={handleGenerate} disabled={isLoading || !originalImage || areExamplesLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2" />}
              {isLoading ? "Génération en cours..." : "Essayer cette Coiffure"}
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
            
            {generatedImage && hairstyleDescription && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Description du Style</h3>
                <p className="text-sm">{hairstyleDescription}</p>
              </div>
            )}
            
            {!isLoading && !generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Les résultats apparaîtront ici après la génération.</p>}
            {generatedImage && <p className="text-center text-sm text-muted-foreground mt-4">Vous aimez votre nouveau look ? Prenez rendez-vous maintenant !</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}