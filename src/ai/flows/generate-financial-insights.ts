'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized financial insights and advice.
 *
 * The flow analyzes user's income and spending habits to provide actionable recommendations for
 * financial improvement. It uses the ai.definePrompt and ai.defineFlow functions from Genkit.
 *
 * @interface GenerateFinancialInsightsInput - Defines the input schema for the flow.
 * @interface GenerateFinancialInsightsOutput - Defines the output schema for the flow.
 * @function generateFinancialInsights - The exported function that triggers the financial insights flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the financial insights flow
const GenerateFinancialInsightsInputSchema = z.object({
  income: z
    .number()
    .describe('Total monthly income of the user.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('Category of the expense.'),
        amount: z.number().describe('Amount spent in this category.'),
      })
    )
    .describe('An array of expenses with category and amount.'),
  savingsGoal: z
    .number()
    .describe('The user specified monthly savings goal.'),
  pastFinancialSummary: z
    .string()
    .optional()
    .describe(
      'A summary of the user past financial activity, spending habits, and progress towards financial goals.'
    ),
});

export type GenerateFinancialInsightsInput = z.infer<
  typeof GenerateFinancialInsightsInputSchema
>;

// Define the output schema for the financial insights flow
const GenerateFinancialInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      title: z.string().describe('Title of the insight.'),
      description: z.string().describe('Detailed description of the insight.'),
      recommendation: z.string().describe('Actionable recommendation for the user.'),
    })
  ).describe('An array of financial insights and recommendations.'),
  summary: z.string().describe('A summary of the user financial situation.'),
});

export type GenerateFinancialInsightsOutput = z.infer<
  typeof GenerateFinancialInsightsOutputSchema
>;

/**
 * Wrapper function to trigger the generateFinancialInsightsFlow.
 * @param input - The input for the flow, conforming to GenerateFinancialInsightsInputSchema.
 * @returns A promise resolving to the output of the flow, conforming to GenerateFinancialInsightsOutputSchema.
 */
export async function generateFinancialInsights(
  input: GenerateFinancialInsightsInput
): Promise<GenerateFinancialInsightsOutput> {
  return generateFinancialInsightsFlow(input);
}

// Define the prompt for generating financial insights
const generateFinancialInsightsPrompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: {schema: GenerateFinancialInsightsInputSchema},
  output: {schema: GenerateFinancialInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's financial data and provide personalized insights and advice.

  Here's the user's financial information:
  Income: {{{income}}}
  Expenses:
  {{#each expenses}}
  - Category: {{{category}}}, Amount: {{{amount}}}
  {{/each}}
  Savings Goal: {{{savingsGoal}}}
  Past Financial Summary: {{{pastFinancialSummary}}}

  Provide at least 3 insights and recommendations to help the user improve their financial situation. Each insight should have a title, a description, and a specific recommendation.
  Also provide a short summary of the user's financial situation based on the given information.
  Ensure the insights and recommendations are practical and tailored to the user's specific circumstances.
  Avoid generic advice.
  Response should be formatted as JSON according to the schema.
  `,
});

// Define the Genkit flow for generating financial insights
const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: GenerateFinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateFinancialInsightsPrompt(input);
    return output!;
  }
);
