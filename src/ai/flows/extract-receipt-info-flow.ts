'use server';
/**
 * @fileOverview An AI flow for extracting information from receipt images.
 *
 * - extractReceiptInfo - A function that handles the receipt parsing process.
 * - ExtractReceiptInfoInput - The input type for the extractReceiptInfo function.
 * - ExtractReceiptInfoOutput - The return type for the extractReceiptInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const ExtractReceiptInfoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractReceiptInfoInput = z.infer<typeof ExtractReceiptInfoInputSchema>;

export const ExtractReceiptInfoOutputSchema = z.object({
  merchant: z.string().describe('The name of the merchant or store.'),
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  amount: z.number().describe('The total amount of the transaction as a number.'),
  currency: z.string().describe('The currency of the transaction (e.g., USD, EUR).'),
});
export type ExtractReceiptInfoOutput = z.infer<typeof ExtractReceiptInfoOutputSchema>;

export async function extractReceiptInfo(input: ExtractReceiptInfoInput): Promise<ExtractReceiptInfoOutput> {
  return extractReceiptInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReceiptInfoPrompt',
  input: {schema: ExtractReceiptInfoInputSchema},
  output: {schema: ExtractReceiptInfoOutputSchema},
  prompt: `You are an expert receipt reader. Analyze the provided receipt image and extract the merchant name, the date of the transaction, the total amount, and the currency. The date should be in YYYY-MM-DD format.

Use the following as the primary source of information about the receipt.

Receipt Image: {{media url=photoDataUri}}`,
});

const extractReceiptInfoFlow = ai.defineFlow(
  {
    name: 'extractReceiptInfoFlow',
    inputSchema: ExtractReceiptInfoInputSchema,
    outputSchema: ExtractReceiptInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
