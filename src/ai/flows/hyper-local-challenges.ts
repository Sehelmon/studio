'use server';
/**
 * @fileOverview A Genkit flow for generating personalized and timely sustainability challenges.
 *
 * - hyperLocalChallenges - A function that generates sustainability challenges.
 * - HyperLocalChallengesInput - The input type for the hyperLocalChallenges function.
 * - HyperLocalChallengesOutput - The return type for the hyperLocalChallenges function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HyperLocalChallengesInputSchema = z.object({
  userHabits: z
    .string()
    .describe(
      'A summary of the user\'s current habits relevant to sustainability (e.g., "drives to work daily", "leaves lights on frequently").'
    ),
  localWeather: z
    .string()
    .describe(
      'Current local weather conditions (e.g., "sunny, 25C", "overcast and rainy, 10C").'
    ),
  sustainabilityGoals: z
    .string()
    .describe(
      'The user\'s specific sustainability goals (e.g., "reduce electricity consumption by 10%", "minimize plastic waste").'
    ),
  currentLocation: z
    .string()
    .describe(
      'The user\'s current geographical location (e.g., "San Francisco, CA").'
    ),
});
export type HyperLocalChallengesInput = z.infer<
  typeof HyperLocalChallengesInputSchema
>;

const ChallengeSchema = z.object({
  title: z.string().describe('A concise title for the sustainability challenge.'),
  description: z
    .string()
    .describe('A detailed description of the challenge and the action the user should take.'),
  estimatedCarbonSavingsKg: z
    .number()
    .describe('The estimated carbon savings in kilograms for completing this challenge.'),
  estimatedImpactDescription: z
    .string()
    .describe(
      'A human-readable description of the estimated environmental impact (e.g., "Equivalent to planting 0.5 trees" or "Saving emissions from a 5-mile car trip").'
    ),
  reasoning: z
    .string()
    .describe(
      'An explanation of why this challenge was generated, linking it to user habits, goals, and local conditions.'
    ),
  suggestedNextAction: z
    .string()
    .describe('A specific, actionable next step the user can take to start the challenge.'),
});

const HyperLocalChallengesOutputSchema = z.object({
  challenges: z.array(ChallengeSchema).describe('An array of personalized sustainability challenges.'),
});
export type HyperLocalChallengesOutput = z.infer<
  typeof HyperLocalChallengesOutputSchema
>;

export async function hyperLocalChallenges(
  input: HyperLocalChallengesInput
): Promise<HyperLocalChallengesOutput> {
  return hyperLocalChallengesFlow(input);
}

const generateChallengesPrompt = ai.definePrompt({
  name: 'generateChallengesPrompt',
  input: { schema: HyperLocalChallengesInputSchema },
  output: { schema: HyperLocalChallengesOutputSchema },
  prompt: `You are an expert sustainability coach and an AI assistant specializing in personalized carbon reduction.
Your goal is to generate 3-5 hyper-local, actionable sustainability challenges tailored to the user's habits, local conditions, and goals.
Each challenge must clearly explain its purpose, estimated carbon savings, and specific next steps.

User Profile:
- Habits: {{{userHabits}}}
- Goals: {{{sustainabilityGoals}}}
- Local Weather: {{{localWeather}}}
- Current Location: {{{currentLocation}}}

Based on the above information, generate a list of 3 to 5 unique and impactful challenges. Ensure that each challenge:
1. Is relevant to the user's habits and goals.
2. Takes into account the local weather and location (e.g., suggest reducing AC if it's cool, or walking if public transport is available and weather permits).
3. Has a clear title, detailed description, estimated carbon savings in kilograms, a descriptive estimated impact, a solid reasoning explaining why it was chosen for THIS user, and a suggested next action.

Provide the output in JSON format, strictly following the HyperLocalChallengesOutputSchema.`,
});

const hyperLocalChallengesFlow = ai.defineFlow(
  {
    name: 'hyperLocalChallengesFlow',
    inputSchema: HyperLocalChallengesInputSchema,
    outputSchema: HyperLocalChallengesOutputSchema,
  },
  async (input) => {
    const { output } = await generateChallengesPrompt(input);
    return output!;
  }
);
