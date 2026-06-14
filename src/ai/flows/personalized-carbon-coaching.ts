'use server';
/**
 * @fileOverview A Genkit flow for a personalized AI sustainability coach.
 *
 * - getPersonalizedCarbonCoaching - A function that provides personalized carbon coaching based on user history, habits, and questions.
 * - PersonalizedCarbonCoachingInput - The input type for the getPersonalizedCarbonCoaching function.
 * - PersonalizedCarbonCoachingOutput - The return type for the getPersonalizedCarbonCoaching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedCarbonCoachingInputSchema = z.object({
  userQuestion: z
    .string()
    .describe("The user's specific question about their carbon footprint or sustainability."),
  userProfile: z
    .string()
    .describe(
      'A comprehensive summary of the user\'s historical data, habits, lifestyle choices, and sustainability goals. This includes past emission data, recent activities, and any specified preferences, provided as a coherent text block.'
    ),
  currentEmissionBreakdown: z
    .string()
    .describe(
      'A summary or detailed breakdown of the user\'s current or recent carbon emission sources and their quantities (e.g., "Transportation: 400kg CO2/month, Electricity: 200kg CO2/month").'
    ),
  recentBehaviorChanges: z
    .string()
    .describe(
      'A description of any recent changes in the user\'s behavior or external factors that might have impacted their emissions (e.g., "Started commuting by bike instead of car last month," "Had guests for two weeks").'
    ),
});
export type PersonalizedCarbonCoachingInput = z.infer<
  typeof PersonalizedCarbonCoachingInputSchema
>;

const PersonalizedCarbonCoachingOutputSchema = z.object({
  aiResponse: z
    .string()
    .describe('The direct answer or insight provided by the AI sustainability coach.'),
  identifiedTrends: z
    .array(z.string())
    .describe(
      'A list of significant trends identified in the user\'s data (e.g., "Increasing electricity usage," "Reduced transportation emissions due to new commute habits").'
    ),
  keyEmissionSources: z
    .array(z.string())
    .describe('A list of the user\'s primary carbon emission sources, ranked by impact.'),
  personalizedRecommendations: z
    .array(z.string())
    .describe(
      'A list of actionable, context-aware recommendations tailored to the user\'s habits and goals for reducing their carbon footprint.'
    ),
  reasoning: z
    .object({
      whyGenerated: z
        .string()
        .describe(
          'A clear explanation of why the insights and recommendations were generated, referencing specific user inputs.'
        ),
      contributingBehaviors: z
        .array(z.string())
        .describe('Specific user behaviors or external factors that contributed to the current situation or insights.'),
      estimatedEnvironmentalImpact: z
        .string()
        .describe('Estimated environmental impact of current behaviors or the problem identified.'),
      estimatedCarbonSavings: z
        .string()
        .describe('Estimated carbon savings from implementing the recommendations, if applicable.'),
      suggestedNextAction: z
        .string()
        .describe('A clear, actionable next step for the user to take to improve their sustainability.'),
    })
    .describe(
      'Detailed reasoning behind the AI\'s response, adhering to the AI Reasoning Requirement by explaining context, impact, savings, and next steps.'
    ),
});
export type PersonalizedCarbonCoachingOutput = z.infer<
  typeof PersonalizedCarbonCoachingOutputSchema
>;

export async function getPersonalizedCarbonCoaching(
  input: PersonalizedCarbonCoachingInput
): Promise<PersonalizedCarbonCoachingOutput> {
  return personalizedCarbonCoachingFlow(input);
}

const personalizedCarbonCoachingPrompt = ai.definePrompt({
  name: 'personalizedCarbonCoachingPrompt',
  input: { schema: PersonalizedCarbonCoachingInputSchema },
  output: { schema: PersonalizedCarbonCoachingOutputSchema },
  prompt: `You are an expert AI sustainability coach named EcoLogic AI. Your goal is to help users understand, track, predict, and reduce their carbon footprint through personalized insights and actionable advice.\n\nYou have access to the user's detailed history and habits. Always provide clear explanations for your insights and recommendations.\n\nUser Profile and History:\n{{{userProfile}}}\n\nCurrent Emission Breakdown:\n{{{currentEmissionBreakdown}}}\n\nRecent Behavior Changes/External Factors:\n{{{recentBehaviorChanges}}}\n\nUser's Question:\n{{{userQuestion}}}\n\nBased on the provided information, answer the user's question, identify relevant trends, list key emission sources, and provide personalized recommendations. For every insight and recommendation, include a detailed reasoning section that explains:\n1. Why the insight/recommendation was generated (reference user data).\n2. Which specific user behaviors or external factors contributed to it.\n3. The estimated environmental impact of the current situation or identified problem.\n4. The estimated carbon savings if recommendations are implemented.\n5. A clear, actionable next step for the user.\n\nEnsure your response is structured to fill all fields of the JSON output schema.`,
});

const personalizedCarbonCoachingFlow = ai.defineFlow(
  {
    name: 'personalizedCarbonCoachingFlow',
    inputSchema: PersonalizedCarbonCoachingInputSchema,
    outputSchema: PersonalizedCarbonCoachingOutputSchema,
  },
  async (input) => {
    const { output } = await personalizedCarbonCoachingPrompt(input);
    return output!;
  }
);
