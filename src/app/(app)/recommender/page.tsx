
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wand2, Loader2, Lightbulb, Sparkles, TestTube2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProductRecommendations, type ProductRecommenderOutput } from "@/ai/flows/product-recommender-flow";

const hairTypes = ["Lisse", "Ondulé", "Bouclé", "Crépu"];
const hairConcerns = ["Sécheresse", "Frisottis", "Pointes fourchues", "Cuir chevelu gras", "Pellicules", "Chute de cheveux", "Cheveux abîmés"];
const hairGoals = ["Ajouter du volume", "Augmenter la brillance", "Définir les boucles", "Réduire les frisottis", "Renforcer les cheveux", "Favoriser la pousse"];


export default function RecommenderPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<ProductRecommenderOutput | null>(null);

    const [hairType, setHairType] = useState<string | undefined>(undefined);
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    
    const handleCheckboxChange = (group: 'concerns' | 'goals', value: string) => {
        const setter = group === 'concerns' ? setSelectedConcerns : setSelectedGoals;
        setter(prev => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        if (!hairType) {
            toast({ variant: "destructive", title: "Veuillez sélectionner votre type de cheveux." });
            return;
        }
        if (selectedConcerns.length === 0 && selectedGoals.length === 0) {
            toast({ variant: "destructive", title: "Veuillez sélectionner au moins un problème ou un objectif." });
            return;
        }

        setIsLoading(true);
        setRecommendations(null);

        try {
            const result = await getProductRecommendations({
                hairType,
                hairConcerns: selectedConcerns,
                hairGoals: selectedGoals,
            });
            setRecommendations(result);
        } catch (error) {
            console.error("Error getting recommendations:", error);
            toast({
                variant: "destructive",
                title: "Échec de la recommandation",
                description: "Un problème est survenu. Veuillez réessayer plus tard.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
                <TestTube2 className="h-10 w-10" /> Recommandation de Produits par IA
                </h1>
                <p className="text-muted-foreground mt-2">
                    Obtenez des conseils de produits personnalisés en fonction de votre profil capillaire unique.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="font-headline">Votre Profil Capillaire</CardTitle>
                        <CardDescription>Parlez-nous de vos cheveux.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Hair Type */}
                        <div>
                            <Label className="font-semibold text-base">1. Type de Cheveux</Label>
                             <RadioGroup value={hairType} onValueChange={setHairType} className="mt-2 grid grid-cols-2 gap-2">
                                {hairTypes.map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type} id={`type-${type}`} />
                                        <Label htmlFor={`type-${type}`} className="cursor-pointer">{type}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        {/* Hair Concerns */}
                        <div>
                            <Label className="font-semibold text-base">2. Problèmes Capillaires</Label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {hairConcerns.map(concern => (
                                    <div key={concern} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`concern-${concern}`} 
                                            onCheckedChange={() => handleCheckboxChange('concerns', concern)}
                                            checked={selectedConcerns.includes(concern)}
                                        />
                                        <Label htmlFor={`concern-${concern}`} className="text-sm font-normal cursor-pointer">{concern}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Hair Goals */}
                        <div>
                            <Label className="font-semibold text-base">3. Objectifs Capillaires</Label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {hairGoals.map(goal => (
                                    <div key={goal} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`goal-${goal}`} 
                                            onCheckedChange={() => handleCheckboxChange('goals', goal)} 
                                            checked={selectedGoals.includes(goal)}
                                        />
                                        <Label htmlFor={`goal-${goal}`} className="text-sm font-normal cursor-pointer">{goal}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                         <Button
                            className="w-full mt-6"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isLoading || !hairType}
                            >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2" />
                            )}
                            {isLoading ? "Analyse en cours..." : "Obtenir des Recommandations"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                     <Card className="min-h-full">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Sparkles /> Votre Routine Personnalisée
                            </CardTitle>
                            <CardDescription>Notre IA a élaboré ces suggestions juste pour vous.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                    <p>Génération de vos recommandations personnalisées...</p>
                                </div>
                            )}
                            {!isLoading && !recommendations && (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center p-4">
                                     <Lightbulb className="h-10 w-10 mb-4 text-primary/50"/>
                                    <p className="font-semibold">Vos recommandations apparaîtront ici.</p>
                                    <p className="text-sm">Remplissez votre profil capillaire pour commencer.</p>
                                </div>
                            )}
                             {!isLoading && recommendations && (
                                <div className="space-y-4">
                                    {recommendations.recommendations.map((rec, index) => (
                                        <Card key={index} className="bg-muted/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-primary">{rec.productType}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div>
                                                    <h4 className="font-semibold">Pourquoi vous en avez besoin :</h4>
                                                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Comment l'utiliser :</h4>
                                                    <p className="text-sm text-muted-foreground">{rec.usage}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
