
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
  hairType: z.string().describe('The user\'s hair type (e.g., Straight, Wavy, Curly, Coily).'),
  hairConcerns: z.array(z.string()).describe('A list of the user\'s hair concerns (e.g., Dryness, Frizz, Damage).'),
  hairGoals: z.array(z.string()).describe('A list of the user\'s hair goals (e.g., Add Volume, Define Curls).'),
});
export type ProductRecommenderInput = z.infer<typeof ProductRecommenderInputSchema>;

const RecommendedProductSchema = z.object({
    productType: z.string().describe('The generic type of product recommended (e.g., "Sulfate-free Shampoo", "Deep Conditioner", "Leave-in Conditioner").'),
    reason: z.string().describe('A brief explanation of why this product type is recommended for the user\'s specific hair profile.'),
    usage: z.string().describe('Brief instructions on how or when to use this type of product.'),
});

const ProductRecommenderOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('A list of recommended hair product types.'),
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
    prompt: `You are an expert trichologist and hairstylist. Based on the user's hair profile, recommend a short, curated list of 3-5 essential product *types*. 
    
    DO NOT recommend specific brand names. Focus on the generic category of product.

    User's Hair Profile:
    - Hair Type: {{{hairType}}}
    - Hair Concerns: {{#each hairConcerns}}- {{{this}}}\n{{/each}}
    - Hair Goals: {{#each hairGoals}}- {{{this}}}\n{{/each}}

    For each recommendation, provide a clear "productType", a concise "reason" explaining its benefits for the user's specific concerns and goals, and simple "usage" instructions.`,
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
