
'use server';
/**
 * @fileOverview AI flow for generating a gallery of hairstyle example images.
 *
 * - getHairstyleExamples - Generates a list of hairstyle names and corresponding example images.
 * - HairstyleExample - The type for a single hairstyle example.
 * - HairstyleExamplesOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HairstyleExampleSchema = z.object({
  name: z.string().describe('The name of the hairstyle.'),
  image: z
    .string()
    .describe(
      'The generated example image of the hairstyle, as a data URI.'
    ),
});
export type HairstyleExample = z.infer<typeof HairstyleExampleSchema>;


const HairstyleExamplesOutputSchema = z.object({
  examples: z.array(HairstyleExampleSchema).describe('A list of hairstyle examples with images.'),
});
export type HairstyleExamplesOutput = z.infer<typeof HairstyleExamplesOutputSchema>;

export async function getHairstyleExamples(): Promise<HairstyleExamplesOutput> {
  return hairstyleExamplesFlow();
}

const hairstylePrompts = [
    "Carré Classique",
    "Ondulations Longues",
    "Coupe Pixie",
    "Nattes Collées",
    "Dégradé Haut",
    "Afro",
];

const hairstyleExamplesFlow = ai.defineFlow(
  {
    name: 'hairstyleExamplesFlow',
    inputSchema: z.void(),
    outputSchema: HairstyleExamplesOutputSchema,
  },
  async () => {
    const examplePromises = hairstylePrompts.map(async (prompt) => {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Générez un portrait de studio d'une personne avec une coiffure '{prompt}'. L'image doit être photoréaliste et se concentrer sur la mise en valeur claire de la coiffure. La personne doit regarder vers l'avant.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        
        if (!media?.url) {
          throw new Error(`Image generation failed for prompt: ${prompt}`);
        }

        return {
            name: prompt,
            image: media.url,
        };
    });

    const examples = await Promise.all(examplePromises);
    
    return { examples };
  }
);
