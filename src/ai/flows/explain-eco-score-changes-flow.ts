'use server';
/**
 * @fileOverview An AI agent that explains changes in a user's Eco Score.
 *
 * - explainEcoScoreChanges - A function that handles the explanation of Eco Score changes.
 * - ExplainEcoScoreChangesInput - The input type for the explainEcoScoreChanges function.
 * - ExplainEcoScoreChangesOutput - The return type for the explainEcoScoreChanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const ExplainEcoScoreChangesInputSchema = z.object({
  currentEcoScore: z.number().describe('The user\'s current Eco Score.'),
  previousEcoScore: z.number().describe('The user\'s previous Eco Score.'),
  recentActivities: z.array(z.string()).describe('A list of recent user activities and behaviors that might influence the Eco Score, e.g., "drove 50 miles", "took public transport", "reduced electricity by 10%".'),
  externalFactors: z.array(z.string()).describe('A list of external factors that might have influenced the Eco Score, e.g., "local weather was colder", "energy prices increased".'),
});
export type ExplainEcoScoreChangesInput = z.infer<typeof ExplainEcoScoreChangesInputSchema>;

// Output Schema
const ContributorSchema = z.object({
  behavior: z.string().describe('A description of the user behavior.'),
  impactExplanation: z.string().describe('An explanation of why this behavior impacted the Eco Score.'),
  estimatedCarbonSavings: z.string().optional().describe('Estimated carbon savings in a descriptive format (e.g., "5 kg CO2e") if the behavior was positive.'),
  estimatedEnvironmentalImpact: z.string().optional().describe('Estimated negative environmental impact in a descriptive format (e.g., "10 kg CO2e increase") if the behavior was negative.'),
  suggestedAction: z.string().describe('A clear, actionable recommendation related to this behavior.'),
});

const ExplainEcoScoreChangesOutputSchema = z.object({
  explanation: z.string().describe('An overall explanation of the Eco Score change.'),
  scoreChangeReason: z.string().describe('A specific, concise reason for the Eco Score change (e.g., "increase due to reduced driving").'),
  positiveContributors: z.array(ContributorSchema).describe('A list of behaviors that positively contributed to the Eco Score.'),
  negativeContributors: z.array(ContributorSchema).describe('A list of behaviors that negatively contributed to the Eco Score.'),
  overallRecommendation: z.string().describe('A general recommendation for how the user can improve their Eco Score and maintain positive changes.'),
});
export type ExplainEcoScoreChangesOutput = z.infer<typeof ExplainEcoScoreChangesOutputSchema>;

// Wrapper function
export async function explainEcoScoreChanges(input: ExplainEcoScoreChangesInput): Promise<ExplainEcoScoreChangesOutput> {
  return explainEcoScoreChangesFlow(input);
}

// Prompt definition
const explainEcoScoreChangesPrompt = ai.definePrompt({
  name: 'explainEcoScoreChangesPrompt',
  input: { schema: ExplainEcoScoreChangesInputSchema },
  output: { schema: ExplainEcoScoreChangesOutputSchema },
  prompt: `You are an expert sustainability coach and AI assistant. Your goal is to provide a clear, empathetic, and actionable explanation for changes in a user's Eco Score.

Current Eco Score: {{currentEcoScore}}
Previous Eco Score: {{previousEcoScore}}
Recent Activities:
{{#each recentActivities}}- {{this}}
{{/each}}
External Factors (if any):
{{#each externalFactors}}- {{this}}
{{/each}}

Analyze the provided data and generate a detailed explanation of the Eco Score change. Your explanation MUST adhere to the following structure and principles:

1.  **Overall Explanation:** Provide a concise summary of why the score changed.
2.  **Score Change Reason:** Clearly state the primary reason for the score fluctuation.
3.  **Positive Contributors:** List specific user behaviors that improved the score. For each, explain:
    *   **Behavior:** What the user did.
    *   **Impact Explanation:** Why this behavior was positive and its environmental significance.
    *   **Estimated Carbon Savings:** Quantify the estimated carbon savings (e.g., "reduced 5 kg CO2e").
    *   **Suggested Action:** A specific recommendation to continue or enhance this positive behavior.
4.  **Negative Contributors:** List specific user behaviors or external factors that decreased the score. For each, explain:
    *   **Behavior:** What the user did (or what external factor occurred).
    *   **Impact Explanation:** Why this behavior/factor was negative and its environmental significance.
    *   **Estimated Environmental Impact:** Quantify the estimated negative environmental impact (e.g., "increased 10 kg CO2e").
    *   **Suggested Action:** A specific recommendation to mitigate or reverse this negative behavior/factor.
5.  **Overall Recommendation:** Provide a clear, actionable recommendation for how the user can further improve their Eco Score and maintain positive changes long-term.

Ensure that all explanations are personalized, proactive, and directly link to user actions or relevant external contexts. The response should always be in JSON format matching the output schema.`,
});

// Flow definition
const explainEcoScoreChangesFlow = ai.defineFlow(
  {
    name: 'explainEcoScoreChangesFlow',
    inputSchema: ExplainEcoScoreChangesInputSchema,
    outputSchema: ExplainEcoScoreChangesOutputSchema,
  },
  async (input) => {
    const { output } = await explainEcoScoreChangesPrompt(input);
    return output!;
  }
);
