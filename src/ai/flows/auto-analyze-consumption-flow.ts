'use server';
/**
 * @fileOverview An AI agent that performs forensic-grade analysis of consumption documents.
 * It cross-validates extracted totals against calculated meter readings to ensure 100% data integrity.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoAnalyzeConsumptionInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (e.g., utility bill, fuel receipt) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z
    .enum([
      'electricity_bill',
      'fuel_receipt',
      'grocery_receipt',
      'transportation_document',
      'other',
    ])
    .optional(),
  additionalContext: z.string().optional(),
});
export type AutoAnalyzeConsumptionInput = z.infer<
  typeof AutoAnalyzeConsumptionInputSchema
>;

const AutoAnalyzeConsumptionOutputSchema = z.object({
  documentTypeIdentified: z.string().describe('The identified document type.'),
  extractedInformation: z.record(z.string(), z.string()).describe('Raw key-value pairs from OCR.'),
  spendingCategory: z.string(),
  estimatedCarbonEmissionsKgCO2e: z.number(),
  confidenceScore: z.number().describe('Final confidence score (0.0 to 1.0) based on forensic validation.'),
  validationStatus: z.enum(['verified', 'mismatch', 'insufficient_data']).describe('The result of the cross-validation check.'),
  auditTrail: z.object({
    previousReading: z.string().optional().describe('Raw previous meter reading extracted.'),
    presentReading: z.string().optional().describe('Raw present meter reading extracted.'),
    extractedTotal: z.number().optional().describe('The total units explicitly printed on the bill.'),
    calculatedTotal: z.number().optional().describe('The value of (Present Reading - Previous Reading).'),
    finalValueUsed: z.number().describe('The value ultimately used for carbon calculation.'),
    unitType: z.string().describe('e.g., kWh, Liters.'),
    discrepancyFound: z.boolean(),
    calculationFormula: z.string(),
  }),
  forensicReasoning: z.string().describe('Detailed AI reasoning explaining the validation results, contradictions found, and why a specific value was accepted or rejected.'),
  personalizedInsights: z.string(),
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
  prompt: `You are an expert Forensic Sustainability Auditor. Your mission is to extract consumption data with 100% mathematical accuracy. 

AUDIT PROTOCOL:
1. **Extraction Phase**: Identify "Previous Reading", "Present Reading", and "Total Units" (or similar fields like "Consumption", "Usage").
2. **Cross-Validation Phase**:
   - Perform the math: calculatedTotal = presentReading - previousReading.
   - Compare calculatedTotal against the extractedTotal explicitly printed on the bill.
3. **Integrity Assessment**:
   - **Verified**: If (present - previous) matches the printed Total Units. Confidence = 1.0.
   - **Mismatch**: If they do NOT match (e.g., 14063 - 10528 = 3535, but bill says 9595). 
     - FLAG THIS DISCREPANCY.
     - REDUCE CONFIDENCE below 0.5.
     - Explain the forensics: "Extracted total of 9595 contradicts calculated consumption of 3535".
     - Prefer the mathematically derived value if readings are clear.
   - **Insufficient Data**: If readings are missing. Confidence = 0.7 max.
4. **Carbon Calculation**: Use the most trustworthy validated value.

INPUT DATA:
Document: {{media url=documentDataUri}}
{{#if additionalContext}}Context: {{{additionalContext}}}{{/if}}

Output must be forensic, transparent, and strictly follow the schema. Prioritize detecting errors over generating generic advice.`,
});

const autoAnalyzeConsumptionFlow = ai.defineFlow(
  {
    name: 'autoAnalyzeConsumptionFlow',
    inputSchema: AutoAnalyzeConsumptionInputSchema,
    outputSchema: AutoAnalyzeConsumptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Forensic analysis failed.');
    return output;
  }
);
