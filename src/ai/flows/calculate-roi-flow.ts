'use server';
/**
 * @fileOverview A Genkit flow for calculating ROI on sustainability projects.
 *
 * - calculateRoi - A function that calculates financial and carbon ROI.
 * - CalculateRoiInput - The input type for the calculateRoi function.
 * - CalculateRoiOutput - The return type for the calculateRoi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateRoiInputSchema = z.object({
  projectType: z.enum(['solar', 'heat_pump', 'ev_charger', 'insulation', 'windows']).describe('The type of green retrofit project.'),
  location: z.string().describe('The user\'s location for calculating local incentives and utility rates.'),
  propertySizeSqFt: z.number().describe('The size of the property in square feet.'),
  currentMonthlySpend: z.number().describe('The user\'s current monthly energy or fuel spend in USD.'),
});
export type CalculateRoiInput = z.infer<typeof CalculateRoiInputSchema>;

const CalculateRoiOutputSchema = z.object({
  estimatedUpfrontCost: z.number().describe('Estimated gross cost before incentives.'),
  annualSavings: z.number().describe('Predicted annual financial savings.'),
  paybackPeriodYears: z.number().describe('The number of years it takes for the project to pay for itself.'),
  carbonOffsetTonsPerYear: z.number().describe('Annual carbon offset in metric tons.'),
  availableIncentives: z.array(z.string()).describe('A list of local/federal tax credits and rebates.'),
  aiReasoning: z.object({
    explanation: z.string().describe('A detailed explanation of the ROI calculation.'),
    factorsConsidered: z.array(z.string()).describe('Key factors that influenced the calculation.'),
    suggestedNextAction: z.string().describe('A concrete next step for the user.'),
  }),
});
export type CalculateRoiOutput = z.infer<typeof CalculateRoiOutputSchema>;

export async function calculateRoi(input: CalculateRoiInput): Promise<CalculateRoiOutput> {
  return calculateRoiFlow(input);
}

const calculateRoiPrompt = ai.definePrompt({
  name: 'calculateRoiPrompt',
  input: { schema: CalculateRoiInputSchema },
  output: { schema: CalculateRoiOutputSchema },
  prompt: `You are an expert Sustainability ROI Consultant. Your goal is to provide accurate financial and environmental projections for home retrofits.

Analyze the following project parameters:
- Project: {{{projectType}}}
- Location: {{{location}}}
- Property Size: {{propertySizeSqFt}} sq ft
- Current Monthly Spend: $ {{{currentMonthlySpend}}}

Based on industry averages, local utility rates (estimate based on location), and typical carbon intensities, calculate:
1. The estimated upfront cost (be realistic for 2024-2025).
2. The annual energy/fuel savings.
3. The payback period in years.
4. The metric tons of CO2e offset per year.
5. A list of likely incentives (e.g., Inflation Reduction Act tax credits in the US, local utility rebates).

Provide a detailed explanation of your reasoning, including the factors considered (e.g., roof orientation for solar, COP for heat pumps) and a clear next step.

Ensure the output is a valid JSON object matching the CalculateRoiOutputSchema.`,
});

const calculateRoiFlow = ai.defineFlow(
  {
    name: 'calculateRoiFlow',
    inputSchema: CalculateRoiInputSchema,
    outputSchema: CalculateRoiOutputSchema,
  },
  async (input) => {
    const { output } = await calculateRoiPrompt(input);
    return output!;
  }
);
