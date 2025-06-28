'use server';
/**
 * @fileOverview AI flow for virtual hairstyle try-on with user uploaded images.
 *
 * - getHairstyleVirtualTryOn - Generates an image with a new hairstyle based on user's photo.
 * - HairstyleVirtualTryOnInput - Input type for the flow.
 * - HairstyleVirtualTryOnOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HairstyleVirtualTryOnInputSchema = z.object({
  userImage: z
    .string()
    .describe(
      "The user's photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  hairstyleType: z.string().describe('The type of hairstyle to apply (e.g., modern, elegant, casual).')
});
export type HairstyleVirtualTryOnInput = z.infer<typeof HairstyleVirtualTryOnInputSchema>;

const HairstyleVirtualTryOnOutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      'The generated image with the new hairstyle, as a data URI.'
    ),
  hairstyleDescription: z
    .string()
    .describe(
      'A brief description of the generated hairstyle.'
    )
});
export type HairstyleVirtualTryOnOutput = z.infer<typeof HairstyleVirtualTryOnOutputSchema>;

export async function getHairstyleVirtualTryOn(
  input: HairstyleVirtualTryOnInput
): Promise<HairstyleVirtualTryOnOutput> {
  return hairstyleVirtualTryOnFlow(input);
}

const hairstyleVirtualTryOnFlow = ai.defineFlow(
  {
    name: 'hairstyleVirtualTryOnFlow',
    inputSchema: HairstyleVirtualTryOnInputSchema,
    outputSchema: HairstyleVirtualTryOnOutputSchema,
  },
  async (input) => {
    // First, generate the image with the new hairstyle
    const {media, text} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.userImage}},
        {
          text: `Créez une version réaliste de cette personne avec une coiffure ${input.hairstyleType} moderne et élégante qui convient parfaitement à la forme de son visage. Conservez les traits du visage et l'expression de la personne, mais transformez uniquement sa coiffure en un style ${input.hairstyleType} tendance et flatteur. L'image doit être de haute qualité et photoréaliste.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 0.7,
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed.');
    }

    // Generate a description of the hairstyle
    const {text: hairstyleDescription} = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: [
        {media: {url: media.url}},
        {
          text: `Décrivez brièvement (en 2-3 phrases maximum) la coiffure que vous voyez sur cette image. Mentionnez le style, la longueur, la texture et tout élément distinctif. Utilisez un langage professionnel de salon de coiffure.`,
        },
      ],
      config: {
        responseModalities: ['TEXT'],
        temperature: 0.3,
      },
    });

    return {
      generatedImage: media.url,
      hairstyleDescription: hairstyleDescription || 'Une coiffure moderne et élégante adaptée à votre visage.'
    };
  }
);