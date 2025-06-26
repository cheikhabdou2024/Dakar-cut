
'use server';
/**
 * @fileOverview AI flow for generating salon images.
 *
 * - getSalonImage - Generates an image for a salon from a text description.
 * - SalonImageInput - Input type for the flow.
 * - SalonImageOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalonImageInputSchema = z.object({
  prompt: z.string().describe('A text description of the salon image to generate.'),
});
export type SalonImageInput = z.infer<typeof SalonImageInputSchema>;

const SalonImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'The generated salon image, as a data URI.'
    ),
});
export type SalonImageOutput = z.infer<typeof SalonImageOutputSchema>;

export async function getSalonImage(
  input: SalonImageInput
): Promise<SalonImageOutput> {
  return salonImageFlow(input);
}

const salonImageFlow = ai.defineFlow(
  {
    name: 'salonImageFlow',
    inputSchema: SalonImageInputSchema,
    outputSchema: SalonImageOutputSchema,
  },
  async ({ prompt }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Générez une image photoréaliste de l'intérieur d'un salon de coiffure basé sur cette description : '${prompt}'. L'image doit être lumineuse, accueillante et professionnelle. Pas de personnes sur la photo.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed for salon image.');
    }

    return { imageUrl: media.url };
  }
);
