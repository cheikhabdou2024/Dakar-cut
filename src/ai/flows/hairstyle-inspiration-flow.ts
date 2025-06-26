'use server';
/**
 * @fileOverview AI flow for generating hairstyle inspiration images.
 *
 * - getHairstyleInspiration - Generates an image of a hairstyle from a text description.
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
  generatedImage: z
    .string()
    .describe(
      'The generated image of the hairstyle, as a data URI.'
    ),
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
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a photorealistic image of a person with the following hairstyle: '${input.prompt}'. Focus on the hairstyle. The person should be looking forward.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed.');
    }

    return {generatedImage: media.url};
  }
);
