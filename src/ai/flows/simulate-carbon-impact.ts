'use server';
/**
 * @fileOverview A Genkit flow for the Predictive Carbon Twin feature, simulating the environmental and score impact of lifestyle changes.
 *
 * - simulateCarbonImpact - A function that handles the carbon impact simulation process.
 * - SimulateCarbonImpactInput - The input type for the simulateCarbonImpact function.
 * - SimulateCarbonImpactOutput - The return type for the simulateCarbonImpact function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CarbonFootprintSchema = z.object({
  transportation: z.number().describe('Carbon emissions from transportation in kg CO2e.'),
  diet: z.number().describe('Carbon emissions from diet in kg CO2e.'),
  homeEnergy: z.number().describe('Carbon emissions from home energy usage in kg CO2e.'),
  consumption: z.number().describe('Carbon emissions from general consumption in kg CO2e.'),
  total: z.number().describe('Total carbon emissions in kg CO2e.'),
});

const LifestyleChangeSchema = z.object({
  type: z.enum(['transportation', 'diet', 'home_energy', 'consumption']).describe('The category of the lifestyle change.'),
  description: z.string().describe('A brief description of the proposed lifestyle change (e.g., "Switch to public transport", "Become vegetarian", "Install solar panels").'),
  impactDetails: z.string().optional().describe('Further details about the magnitude or specifics of the change (e.g., "reduce car trips by 50%", "switch to plant-based diet 3 days a week").'),
});

const SimulateCarbonImpactInputSchema = z.object({
  currentCarbonFootprint: CarbonFootprintSchema.describe('The user\u2019s current carbon footprint breakdown.'),
  lifestyleChanges: z.array(LifestyleChangeSchema).describe('An array of proposed lifestyle changes to simulate.'),
});
export type SimulateCarbonImpactInput = z.infer<typeof SimulateCarbonImpactInputSchema>;

const AiReasoningSchema = z.object({
  explanation: z.string().describe('A detailed explanation of why this prediction was generated and how the changes impact emissions.'),
  contributingBehaviors: z.array(z.string()).describe('A list of specific lifestyle changes that significantly contributed to the predicted impact.'),
  estimatedEnvironmentalImpact: z.string().describe('A summary of the estimated environmental impact (e.g., "equivalent to planting X trees annually").'),
  estimatedCarbonSavingsBreakdown: z.record(z.string(), z.number()).describe('Estimated carbon savings in kg CO2e, broken down by category (e.g., transportation, diet).'),
  suggestedNextAction: z.string().describe('A concrete, actionable next step related to the simulated changes.'),
});

const SimulateCarbonImpactOutputSchema = z.object({
  predictedCarbonFootprint: CarbonFootprintSchema.describe('The predicted carbon footprint after applying the lifestyle changes.'),
  totalCarbonReductionKgCO2e: z.number().describe('The total estimated carbon reduction in kg CO2e.'),
  ecoScoreChangePercentage: z.number().describe('The estimated percentage change in the user\u2019s Eco Score (positive for improvement).'),
  aiReasoning: AiReasoningSchema.describe('AI\u2019s detailed reasoning for the simulation results.'),
});
export type SimulateCarbonImpactOutput = z.infer<typeof SimulateCarbonImpactOutputSchema>;

export async function simulateCarbonImpact(input: SimulateCarbonImpactInput): Promise<SimulateCarbonImpactOutput> {
  return simulateCarbonImpactFlow(input);
}

const simulateCarbonImpactPrompt = ai.definePrompt({
  name: 'simulateCarbonImpactPrompt',
  input: { schema: SimulateCarbonImpactInputSchema },
  output: { schema: SimulateCarbonImpactOutputSchema },
  prompt: `You are the EcoLogic AI Predictive Carbon Twin, an expert in sustainability and carbon footprint analysis. Your goal is to simulate the environmental and Eco Score impact of proposed lifestyle changes based on a user's current carbon footprint.

Analyze the user's current carbon footprint:
{{json currentCarbonFootprint}}

Consider the following proposed lifestyle changes:
{{#each lifestyleChanges}}
- Type: {{{type}}}
  Description: {{{description}}}
  {{#if impactDetails}}Details: {{{impactDetails}}}{{/if}}
{{/each}}

Based on this information, perform the following steps:
1. Accurately predict the new carbon footprint after these changes are implemented. Be realistic about the impact of each change.
2. Calculate the total carbon reduction in kg CO2e.
3. Estimate the percentage change in the user's Eco Score. Assume a higher reduction in carbon emissions leads to a positive increase in the Eco Score.
4. Provide a detailed reasoning for your predictions, explaining:
   - Why this prediction was generated (e.g., based on the input changes).
   - Which specific user behaviors (lifestyle changes) contributed most significantly to the predicted impact.
   - The estimated environmental impact (e.g., "equivalent to planting X trees annually" or "offsetting Y miles driven").
   - A breakdown of estimated carbon savings by category (transportation, diet, home_energy, consumption).
   - A concrete, actionable suggested next action that the user can take based on this simulation.

Ensure your output is a valid JSON object matching the SimulateCarbonImpactOutputSchema, especially for the aiReasoning field.`,
});

const simulateCarbonImpactFlow = ai.defineFlow(
  {
    name: 'simulateCarbonImpactFlow',
    inputSchema: SimulateCarbonImpactInputSchema,
    outputSchema: SimulateCarbonImpactOutputSchema,
  },
  async (input) => {
    const { output } = await simulateCarbonImpactPrompt(input);
    return output!;
  }
);
