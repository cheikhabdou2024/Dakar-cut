
'use server';
/**
 * @fileOverview AI flow for virtual hairstyle try-on.
 *
 * - getStyleSuggestion - Generates an image with a new hairstyle.
 * - StyleSuggestionInput - Input type for the flow.
 * - StyleSuggestionOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleSuggestionInputSchema = z.object({
  userImage: z
    .string()
    .describe(
      "The user's photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  hairstyle: z.string().describe('A description of the hairstyle to apply.'),
});
export type StyleSuggestionInput = z.infer<typeof StyleSuggestionInputSchema>;

const StyleSuggestionOutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      'The generated image with the new hairstyle, as a data URI.'
    ),
});
export type StyleSuggestionOutput = z.infer<typeof StyleSuggestionOutputSchema>;

export async function getStyleSuggestion(
  input: StyleSuggestionInput
): Promise<StyleSuggestionOutput> {
  return styleSuggestionFlow(input);
}

const styleSuggestionFlow = ai.defineFlow(
  {
    name: 'styleSuggestionFlow',
    inputSchema: StyleSuggestionInputSchema,
    outputSchema: StyleSuggestionOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.userImage}},
        {
          text: `Appliquez une coiffure '{hairstyle}' à la personne sur cette image. Conservez les traits du visage et l'arrière-plan de la personne.`,
        },
      ],
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
