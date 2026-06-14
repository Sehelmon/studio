'use server';
/**
 * @fileOverview A Genkit flow for generating proactive carbon insights for users.
 *
 * - getProactiveCarbonInsights - A function that triggers the proactive carbon insights generation process.
 * - ProactiveCarbonInsightsInput - The input type for the getProactiveCarbonInsights function.
 * - ProactiveCarbonInsightsOutput - The return type for the getProactiveCarbonInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProactiveCarbonInsightsInputSchema = z.object({
  userLocation: z.string().describe('The user\'s current geographical location (e.g., "New York, NY").'),
  recentConsumptionSummary: z.string().describe('A summary of the user\'s recent consumption data, e.g., "Electricity usage increased by 15% this week compared to last.", "Fuel consumption remained stable.".'),
  historicalAverageConsumption: z.string().describe('A summary of the user\'s historical average consumption trends, e.g., "Average weekly electricity usage is 100 kWh.", "Typical monthly fuel cost is $200.".'),
  currentWeatherConditions: z.string().describe('The current and forecasted local weather conditions, e.g., "Today: Sunny, 75F. Tomorrow: Cloudy, 68F, slight chance of rain.".'),
  userGoals: z.string().describe('The user\'s stated sustainability goals, e.g., "Reduce carbon footprint by 20% in 6 months.".'),
  identifiedHabits: z.string().describe('A summary of identified user habits relevant to sustainability, e.g., "Drives car for short trips < 2 miles twice a week.", "Regularly uses public transport.".'),
});
export type ProactiveCarbonInsightsInput = z.infer<typeof ProactiveCarbonInsightsInputSchema>;

const ProactiveCarbonInsightsOutputSchema = z.object({
  insightType: z.enum(['consumption_change', 'opportunity', 'suggestion']).describe('The type of proactive insight generated.'),
  title: z.string().describe('A concise title for the proactive insight.'),
  message: z.string().describe('A detailed message explaining the proactive insight.'),
  reasoning: z.string().describe('The AI\'s reasoning behind generating this specific insight.'),
  contributingBehaviors: z.array(z.string()).describe('A list of specific user behaviors that contributed to this insight.'),
  estimatedImpact: z.string().nullable().describe('The estimated environmental impact if the insight is about a consumption change (e.g., "Increased CO2 emissions by 5kg this week."). Null if not applicable.'),
  estimatedCarbonSavings: z.string().nullable().describe('The estimated carbon savings if the insight is an opportunity or suggestion (e.g., "Could save 10kg CO2 per month."). Null if not applicable.'),
  suggestedNextAction: z.string().describe('A clear, actionable next step the user can take.'),
});
export type ProactiveCarbonInsightsOutput = z.infer<typeof ProactiveCarbonInsightsOutputSchema>;

const proactiveCarbonInsightsPrompt = ai.definePrompt({
  name: 'proactiveCarbonInsightsPrompt',
  input: { schema: ProactiveCarbonInsightsInputSchema },
  output: { schema: ProactiveCarbonInsightsOutputSchema },
  prompt: `You are a vigilant sustainability advisor and AI named Gemini. Your goal is to proactively analyze a user's carbon footprint data and provide clear, actionable insights with detailed explanations. Act like a personal sustainability coach.

Given the following user context and data, identify the most significant proactive insight related to consumption changes, emission reduction opportunities, or timely eco-friendly suggestions. Focus on providing real-world useful advice that addresses the user's specific context.

User Location: {{{userLocation}}}
Recent Consumption Summary: {{{recentConsumptionSummary}}}
Historical Average Consumption: {{{historicalAverageConsumption}}}
Current Weather Conditions: {{{currentWeatherConditions}}}
User Goals: {{{userGoals}}}
Identified Habits: {{{identifiedHabits}}}

Based on this information, generate a single, highly personalized proactive insight. The insight must include:
- A clear 'insightType' (one of 'consumption_change', 'opportunity', or 'suggestion').
- A concise 'title'.
- A detailed 'message' explaining the insight.
- The 'reasoning' behind this specific insight.
- A list of 'contributingBehaviors' if applicable. If no specific behavior is the primary contributor, state that clearly.
- The 'estimatedImpact' of the current situation (if insightType is 'consumption_change'). If not applicable, set to null.
- The 'estimatedCarbonSavings' if the insightType is 'opportunity' or 'suggestion'. If not applicable, set to null.
- A concrete 'suggestedNextAction' the user should take.

Ensure the output is in the specified JSON format.
`,
});

const proactiveCarbonInsightsFlow = ai.defineFlow(
  {
    name: 'proactiveCarbonInsightsFlow',
    inputSchema: ProactiveCarbonInsightsInputSchema,
    outputSchema: ProactiveCarbonInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await proactiveCarbonInsightsPrompt(input);
    return output!;
  }
);

export async function getProactiveCarbonInsights(
  input: ProactiveCarbonInsightsInput
): Promise<ProactiveCarbonInsightsOutput> {
  return proactiveCarbonInsightsFlow(input);
}
