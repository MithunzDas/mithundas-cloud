import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

interface AnswerItem {
  question: string;
  answer: string;
}

interface GenerateReviewParams {
  businessName: string;
  category: string;
  city?: string;
  answers: AnswerItem[];
  ratingScore?: number;
}

let openaiClient: OpenAI | null = null;
if (env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export async function generateHumanReview(params: GenerateReviewParams): Promise<string> {
  const { businessName, category, city, answers, ratingScore = 5 } = params;

  if (answers.length === 0) {
    return `Had a wonderful experience at ${businessName}! The staff was courteous, welcoming, and everything went smoothly. Highly recommended! ⭐`;
  }

  // If OpenAI is available, use GPT-4o-mini for authentic human text
  if (openaiClient) {
    try {
      const answersSummary = answers.map((a, i) => `${i + 1}. ${a.question} -> ${a.answer}`).join("\n");
      
      const prompt = `You are a real customer who just visited "${businessName}" (${category}${city ? `, in ${city}` : ""}).
Based on your honest answers to these questions below, write a genuine, natural, ${ratingScore}-star Google Maps review.

Customer's Quick Feedback:
${answersSummary}

CRITICAL RULES FOR WRITING:
1. Length: 2 to 3 sentences ONLY. Keep it punchy and casual.
2. Tone: Warm, conversational, and authentic — like a regular human typing on their phone right after leaving.
3. NEVER use AI cliches or robotic PR phrasing like:
   - "I recently had the pleasure of visiting..."
   - "Exceeded all expectations"
   - "State of the art"
   - "Exceptional service from start to finish"
   - "Look no further"
4. Include 1 or 2 tasteful emojis (e.g. ✨, 🙌, 😊, 👏, 💯).
5. Seamlessly weave in the specific things the customer praised (e.g. gentle doctor, clean vibe, quick turnaround, no wait time).
6. Output ONLY the review text. Do not wrap in quotes or add commentary.`;

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 150,
      });

      const review = response.choices[0]?.message?.content?.trim();
      if (review && review.length > 20) {
        return review.replace(/^["']|["']$/g, "");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error("OpenAI review generation failed, falling back to smart template", "qr_ai_writer", {
        error: errorMessage,
      });
    }
  }

  // Smart Offline Fallback (never leaves customer with an empty screen)
  return buildSmartFallbackReview(businessName, answers);
}

function buildSmartFallbackReview(businessName: string, answers: AnswerItem[]): string {
  const highlights = answers.map(a => a.answer.replace(/[^\w\s]/gi, "").trim()).filter(Boolean);
  
  const templates = [
    `Had a great visit to ${businessName} today. The team was super friendly and ${highlights[0]?.toLowerCase() || "helpful"}. Everything was ${highlights[1]?.toLowerCase() || "smooth and fast"}. Definitely coming back! ✨`,
    `Really impressed with ${businessName}! ${highlights[0] || "Great service"} and ${highlights[1] || "welcoming staff"}. Highly recommend them to anyone in the area! 👍`,
    `Great experience from start to finish at ${businessName}. ${highlights[0] || "Very professional"} and ${highlights[2] || "efficient"}. 5 stars! ⭐⭐⭐⭐⭐`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
