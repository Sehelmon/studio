'use server';
/**
 * @fileOverview An AI agent that analyzes uploaded consumption documents (bills, receipts) to extract data,
 * categorize spending, estimate carbon emissions, explain contributors, and provide personalized insights.
 * 
 * Updated for forensic precision in meter reading calculations and transparent breakdowns.
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
    .describe('The type of document identified by the AI.'),
  extractedInformation: z
    .record(z.string(), z.string())
    .describe('Key-value pairs of raw data extracted.'),
  spendingCategory: z
    .string()
    .describe('Categorized spending area (e.g., "Utilities", "Transportation").'),
  estimatedCarbonEmissionsKgCO2e: z
    .number()
    .describe('Final calculated carbon emissions in kg CO2e.'),
  confidenceScore: z
    .number()
    .describe('AI confidence in the extraction accuracy (0.0 to 1.0).'),
  auditDetails: z.object({
    previousReading: z.string().optional().describe('Raw previous meter reading if found.'),
    presentReading: z.string().optional().describe('Raw present meter reading if found.'),
    totalUnits: z.number().describe('The primary consumption value used for calculation (e.g., kWh).'),
    unitType: z.string().describe('The unit of measure (e.g., "kWh", "Liters").'),
    calculationMethod: z.string().describe('Description of how units were derived (e.g., "Extracted from Total Unit field" or "Present - Previous").'),
    carbonFormula: z.string().describe('The math used: "Units * Factor = Result".'),
  }),
  emissionContributors: z
    .array(z.string())
    .describe('Factors contributing to the emissions.'),
  personalizedInsights: z
    .string()
    .describe('Actionable advice.'),
  reasoning: z
    .string()
    .describe('AI forensic reasoning for the specific numbers reported.'),
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
  prompt: `You are an expert forensic sustainability auditor. Your primary goal is to extract consumption data with 100% mathematical accuracy from bills and receipts.

DIRECTIONS FOR DATA EXTRACTION:
1. **Prioritize Explicit Totals**: Look for fields like "Total Unit", "Units Consumed", "Usage", or "Consumption". If found, use this value as the primary totalUnits.
2. **Calculate if Missing**: If an explicit total is missing but "Previous Reading" and "Present Reading" are available, calculate: totalUnits = Present Reading - Previous Reading.
3. **Verify the Math**: If both readings and a total are present, verify if they align. If they don't, prioritize the most logical "Total" field found on the document and explain the discrepancy in the reasoning.
4. **Determine Unit Type**: Identify if the units are kWh, liters, gallons, etc.
5. **Calculate Carbon**: Apply standard emission factors (e.g., ~0.4 kg CO2e/kWh for electricity, ~2.3 kg CO2e/L for petrol) to the totalUnits to get estimatedCarbonEmissionsKgCO2e.

INPUT DATA:
Document Image: {{media url=documentDataUri}}
{{#if documentType}}Type Hint: {{{documentType}}}{{/if}}
{{#if additionalContext}}Context: {{{additionalContext}}}{{/if}}

Output must be forensic, transparent, and strictly follow the schema. Accuracy is more important than generic advice.`,
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
