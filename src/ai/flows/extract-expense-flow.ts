
'use server';
/**
 * @fileOverview An AI flow for extracting expense information from a receipt image.
 *
 * - extractExpenseFromReceipt - A function that handles the receipt analysis process.
 * - ExtractExpenseInput - The input type for the extractExpenseFromReceipt function.
 * - ExtractExpenseOutput - The return type for the extractExpenseFromReceipt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractExpenseInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractExpenseInput = z.infer<typeof ExtractExpenseInputSchema>;

const ExtractExpenseOutputSchema = z.object({
  merchant: z.string().optional().describe('The name of the merchant or store.'),
  date: z.string().optional().describe('The date of the transaction in YYYY-MM-DD format.'),
  amount: z.number().optional().describe('The total amount of the transaction.'),
});
export type ExtractExpenseOutput = z.infer<typeof ExtractExpenseOutputSchema>;

export async function extractExpenseFromReceipt(input: ExtractExpenseInput): Promise<ExtractExpenseOutput> {
  return extractExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractExpensePrompt',
  input: { schema: ExtractExpenseInputSchema },
  output: { schema: ExtractExpenseOutputSchema },
  prompt: `You are an expert expense tracking assistant. Analyze the provided receipt image and extract the following information:
- The merchant's name.
- The transaction date. Please format it as YYYY-MM-DD. If the year is not present, assume the current year.
- The total amount of the expense. This should be the final total, including any taxes or tips.

If any piece of information cannot be found, omit it from your response.

Receipt: {{media url=receiptDataUri}}`,
});

const extractExpenseFlow = ai.defineFlow(
  {
    name: 'extractExpenseFlow',
    inputSchema: ExtractExpenseInputSchema,
    outputSchema: ExtractExpenseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
