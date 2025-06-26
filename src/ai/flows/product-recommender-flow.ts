
'use server';
/**
 * @fileOverview An AI flow for recommending hair product types.
 *
 * - getProductRecommendations - Gets product recommendations based on user input.
 * - ProductRecommenderInput - The input type for the flow.
 * - ProductRecommenderOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommenderInputSchema = z.object({
  hairType: z.string().describe("Le type de cheveux de l'utilisateur (par ex., Lisse, Ondulé, Bouclé, Crépu)."),
  hairConcerns: z.array(z.string()).describe("Une liste des problèmes capillaires de l'utilisateur (par ex., Sécheresse, Frisottis, Cheveux abîmés)."),
  hairGoals: z.array(z.string()).describe("Une liste des objectifs capillaires de l'utilisateur (par ex., Ajouter du volume, Définir les boucles)."),
});
export type ProductRecommenderInput = z.infer<typeof ProductRecommenderInputSchema>;

const RecommendedProductSchema = z.object({
    productType: z.string().describe('Le type générique de produit recommandé (par ex., "Shampooing sans sulfate", "Après-shampooing hydratant", "Soin sans rinçage").'),
    reason: z.string().describe('Une brève explication de la raison pour laquelle ce type de produit est recommandé pour le profil capillaire spécifique de l\'utilisateur.'),
    usage: z.string().describe("Brèves instructions sur comment ou quand utiliser ce type de produit."),
});

const ProductRecommenderOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('Une liste de types de produits capillaires recommandés.'),
});
export type ProductRecommenderOutput = z.infer<typeof ProductRecommenderOutputSchema>;


export async function getProductRecommendations(
  input: ProductRecommenderInput
): Promise<ProductRecommenderOutput> {
  return productRecommenderFlow(input);
}

const prompt = ai.definePrompt({
    name: 'productRecommenderPrompt',
    input: { schema: ProductRecommenderInputSchema },
    output: { schema: ProductRecommenderOutputSchema },
    prompt: `Vous êtes un trichologue et coiffeur expert. En fonction du profil capillaire de l'utilisateur, recommandez une courte liste de 3 à 5 *types* de produits essentiels. 
    
    NE recommandez PAS de noms de marques spécifiques. Concentrez-vous sur la catégorie générique du produit.

    Profil Capillaire de l'Utilisateur:
    - Type de Cheveux: {{{hairType}}}
    - Problèmes Capillaires: {{#each hairConcerns}}- {{{this}}}\n{{/each}}
    - Objectifs Capillaires: {{#each hairGoals}}- {{{this}}}\n{{/each}}

    Pour chaque recommandation, fournissez un "type de produit" clair, une "raison" concise expliquant ses avantages pour les problèmes et objectifs spécifiques de l'utilisateur, et des instructions d'"utilisation" simples.`,
});


const productRecommenderFlow = ai.defineFlow(
  {
    name: 'productRecommenderFlow',
    inputSchema: ProductRecommenderInputSchema,
    outputSchema: ProductRecommenderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
