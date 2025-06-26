
'use server';
/**
 * @fileOverview AI flow for generating hairstyle inspiration images.
 *
 * - getHairstyleInspiration - Generates a gallery of images of a hairstyle from a text description.
 * - HairstyleInspirationInput - Input type for the flow.
 * - HairstyleInspirationOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HairstyleInspirationInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the hairstyle to generate.'),
});
export type HairstyleInspirationInput = z.infer<typeof HairstyleInspirationInputSchema>;

const HairstyleInspirationOutputSchema = z.object({
  generatedImages: z.array(z
    .string()
    .describe(
      'A generated image of the hairstyle, as a data URI.'
    )),
});
export type HairstyleInspirationOutput = z.infer<typeof HairstyleInspirationOutputSchema>;

export async function getHairstyleInspiration(
  input: HairstyleInspirationInput
): Promise<HairstyleInspirationOutput> {
  return hairstyleInspirationFlow(input);
}

const hairstyleInspirationFlow = ai.defineFlow(
  {
    name: 'hairstyleInspirationFlow',
    inputSchema: HairstyleInspirationInputSchema,
    outputSchema: HairstyleInspirationOutputSchema,
  },
  async (input) => {
    const generationCount = 4;
    const imagePromises = Array.from({ length: generationCount }).map(async () => {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Générez une image photoréaliste d'une personne avec la coiffure suivante : '${input.prompt}'. Concentrez-vous sur la coiffure. La personne doit regarder vers l'avant.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error('Image generation failed for one of the images.');
      }

      return media.url;
    });

    const generatedImages = await Promise.all(imagePromises);

    return { generatedImages };
  }
);
