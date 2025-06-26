import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Upload, Images } from "lucide-react";
import Image from "next/image";

export default function StyleAiPage() {
  const hairstyles = [
    { name: "Classic Bob", image: "https://placehold.co/300x300.png" },
    { name: "Long Waves", image: "https://placehold.co/300x300.png" },
    { name: "Pixie Cut", image: "https://placehold.co/300x300.png" },
    { name: "Cornrows", image: "https://placehold.co/300x300.png" },
    { name: "Fade", image: "https://placehold.co/300x300.png" },
    { name: "Afro", image: "https://placehold.co/300x300.png" },
  ];

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
              <Upload className="h-5 w-5" /> Your Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload your picture</Label>
              <Input id="picture" type="file" />
              <p className="text-xs text-muted-foreground">For best results, use a clear, front-facing photo.</p>
            </div>

            <div className="font-headline text-lg mt-6">Choose a Hairstyle</div>
            <div className="grid grid-cols-3 gap-4">
              {hairstyles.map((style) => (
                <div key={style.name} className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden">
                    <Image src={style.image} alt={style.name} layout="fill" objectFit="cover" data-ai-hint="woman hairstyle"/>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-center text-sm font-bold">{style.name}</span>
                    </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6" size="lg">
              <Wand2 className="mr-2" />
              Generate New Look
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
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Image src="https://placehold.co/400x400.png" alt="User's original photo" width={400} height={400} className="rounded-lg" data-ai-hint="woman portrait"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="text-center font-semibold">New Style</h3>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                         <Image src="https://placehold.co/400x400.png" alt="User with new hairstyle" width={400} height={400} className="rounded-lg" data-ai-hint="woman haircut"/>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Results will appear here after generation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
