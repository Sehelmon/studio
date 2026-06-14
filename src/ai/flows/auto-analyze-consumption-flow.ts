'use server';
/**
 * @fileOverview An AI agent that analyzes uploaded consumption documents (bills, receipts) to extract data,
 * categorize spending, estimate carbon emissions, explain contributors, and provide personalized insights.
 *
 * - autoAnalyzeConsumption - A function that handles the document analysis process.
 * - AutoAnalyzeConsumptionInput - The input type for the autoAnalyzeConsumption function.
 * - AutoAnalyzeConsumptionOutput - The return type for the autoAnalyzeConsumption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoAnalyzeConsumptionInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (e.g., utility bill, fuel receipt, grocery receipt) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z
    .enum([
      'electricity_bill',
      'fuel_receipt',
      'grocery_receipt',
      'transportation_document',
      'other',
    ])
    .optional()
    .describe('Optional type of document provided to guide the AI.'),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context about the document or user preferences.'),
});
export type AutoAnalyzeConsumptionInput = z.infer<
  typeof AutoAnalyzeConsumptionInputSchema
>;

const AutoAnalyzeConsumptionOutputSchema = z.object({
  documentTypeIdentified: z
    .string()
    .describe('The type of document identified by the AI (e.g., "Electricity Bill", "Fuel Receipt").'),
  extractedInformation: z
    .record(z.string(), z.string())
    .describe('Key-value pairs of extracted data from the document (e.g., {"provider": "Con Edison", "amount": "$120.50", "kwh_consumed": "500"}).'),
  spendingCategory: z
    .string()
    .describe('The broad categorized spending area (e.g., "Utilities", "Transportation", "Food").'),
  estimatedCarbonEmissionsKgCO2e: z
    .number()
    .describe('Estimated carbon emissions in kilograms of CO2 equivalent.'),
  emissionContributors: z
    .array(z.string())
    .describe('List of major factors identified by the AI contributing to the emissions (e.g., "High electricity usage in winter months").'),
  personalizedInsights: z
    .string()
    .describe('Personalized insights and actionable recommendations to reduce emissions.'),
  reasoning: z
    .string()
    .describe('A detailed explanation from the AI about why this analysis was generated, linking to user behaviors, estimated environmental impact, and suggested next actions.'),
});
export type AutoAnalyzeConsumptionOutput = z.infer<
  typeof AutoAnalyzeConsumptionOutputSchema
>;

export async function autoAnalyzeConsumption(
  input: AutoAnalyzeConsumptionInput
): Promise<AutoAnalyzeConsumptionOutput> {
  return autoAnalyzeConsumptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoAnalyzeConsumptionPrompt',
  input: {schema: AutoAnalyzeConsumptionInputSchema},
  output: {schema: AutoAnalyzeConsumptionOutputSchema},
  prompt: `You are an expert sustainability consultant, financial auditor, and AI data extraction specialist.
Your primary goal is to analyze provided documents to automatically extract consumption data, categorize spending, estimate carbon emissions, explain major contributors, and generate highly personalized insights, minimizing manual user effort.

Analyze the provided document image and perform the following tasks:
1.  **Identify Document Type**: Determine if the document is an electricity bill, fuel receipt, grocery receipt, transportation document, or other.
2.  **Extract Key Information**: Accurately extract all relevant data such as provider/vendor name, dates, amounts, consumption units (e.g., kWh, liters, miles), itemized lists, etc.
3.  **Categorize Spending**: Assign a broad spending category to the consumption (e.g., Utilities, Transportation, Food).
4.  **Estimate Carbon Emissions**: Based on the extracted consumption data and common knowledge about emission factors (e.g., average grid intensity for electricity, CO2 per liter of fuel), estimate the carbon emissions in kilograms of CO2 equivalent (kg CO2e). If specific values are missing, make a reasonable estimation and note any assumptions.
5.  **Identify Major Contributors**: Explain what specific aspects of the consumption significantly contributed to the estimated emissions.
6.  **Generate Personalized Insights**: Provide actionable, personalized advice and recommendations to reduce emissions based on the extracted data.
7.  **Provide Reasoning**: Explain *why* this analysis was generated, linking specific user behaviors (as indicated by the document) to the estimated environmental impact. Include suggestions for next actions.

Document Image: {{media url=documentDataUri}}
{{#if documentType}}Known Document Type: {{{documentType}}}{{/if}}
{{#if additionalContext}}Additional Context: {{{additionalContext}}}{{/if}}

Ensure your output strictly adheres to the provided JSON schema. Pay close attention to the data types, especially for 'estimatedCarbonEmissionsKgCO2e' which must be a number.
`,
});

const autoAnalyzeConsumptionFlow = ai.defineFlow(
  {
    name: 'autoAnalyzeConsumptionFlow',
    inputSchema: AutoAnalyzeConsumptionInputSchema,
    outputSchema: AutoAnalyzeConsumptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to analyze consumption document.');
    }
    return output;
  }
);
