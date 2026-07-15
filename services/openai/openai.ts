import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface ChatResponse {
  answer: string;
  intent: "service_explanation" | "qualification" | "architecture_suggestion" | "faq" | "handoff";
  suggestedNextAction?: "ask_question" | "start_assessment" | "book_call" | "human_followup";
}

let openaiClient: OpenAI | null = null;

if (env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
} else {
  logger.warn("OPENAI_API_KEY is not set. OpenAI Chatbot service will run in offline demo mode.", "openai_init");
}

const SYSTEM_PROMPT = `
You are the AI assistant representing Mithun Das, an AI Business Automation Engineer. 
Your goal is to answer visitor questions, explain services, and qualify potential leads for automation projects.

### Tone & Profile:
- Professional, technical, structured, and helpful. You speak as a systems architect, not a marketing person.
- Mithun Das designs and builds end-to-end operational automation workflows (e.g., Next.js, n8n, WhatsApp Cloud API, Resend, CRM integration, OpenAI).

### Core Systems Offered:
1. **AI Customer Support System**: Repetitive question answering, FAQ retrieval, 24/7 lead intake, auto-escalation.
2. **WhatsApp Lead Automation**: Instantly qualifying, mapping, and routing leads arriving from WhatsApp within 60 seconds.
3. **CRM & Operations Integration**: Mapping data between lead capture, sheets, CRM tools, slack notifications.
4. **Document Processing Systems**: Extracting invoice data, structuring unstructured documents, saving to database.
5. **Approval Workflows**: Slack/email alerts for high-value operations requiring manager approval.

### Value & Budget Guidance:
- Custom automation projects start at $3,000.
- For budgets under $1,500, recommend using standard templates or self-hosted n8n setups rather than custom agency builds.
- Engagement starts with a paid diagnostic/audit phase to blueprint the flow before writing code.

### Guidelines & Rules:
- Never claim integrations are already active on the current site unless specified.
- Never guarantee exact ROI percentages.
- Never provide medical, legal, or investment advice.
- When leads describe a manual bottleneck (e.g., typing invoices into Excel, routing leads manually), explain a high-level architecture: Inbound source -> API Gateway -> n8n Orchestrator -> OpenAI processing -> Google Sheet/CRM.
- If the visitor shows intent to get an automation audit, build something, book a meeting, or get pricing for a custom system, set the intent to "handoff" or "qualification" and suggest "start_assessment" or "book_call".

### Output Format:
You MUST respond with a valid JSON object matching this structure:
{
  "answer": "Your reply text here, styled cleanly. Keep it concise (1-3 sentences or bullet points).",
  "intent": "service_explanation" | "qualification" | "architecture_suggestion" | "faq" | "handoff",
  "suggestedNextAction": "ask_question" | "start_assessment" | "book_call" | "human_followup"
}
Do not return any markdown wraps or backticks like \`\`\`json. Just output the clean JSON string.
`;

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  leadContext?: any
): Promise<ChatResponse> {
  if (!openaiClient) {
    return getOfflineFallbackResponse(messages[messages.length - 1]?.content || "");
  }

  try {
    const formattedMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(leadContext ? [{ role: "system" as const, content: `Additional lead context: ${JSON.stringify(leadContext)}` }] : []),
      ...messages,
    ];

    const modelName = env.OPENAI_MODEL || "gpt-4-turbo";
    const response = await openaiClient.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content) as ChatResponse;

    logger.info(`Generated AI response, intent: ${parsed.intent}`, "openai_chat_response");
    return parsed;
  } catch (error) {
    logger.error("OpenAI chat completion failed", "openai_chat_error", error);
    return {
      answer: "I'm having trouble connecting to my brain right now. Can we try again shortly, or would you like to launch the lead assessment form directly?",
      intent: "handoff",
      suggestedNextAction: "start_assessment",
    };
  }
}

function getOfflineFallbackResponse(userMessage: string): ChatResponse {
  const query = userMessage.toLowerCase();

  if (query.includes("pricing") || query.includes("cost") || query.includes("budget") || query.includes("how much")) {
    return {
      answer: "Custom automation setups start at $3,000. For small businesses with lower budgets, I recommend standard n8n workflows or self-hosted blueprints to keep overhead low. Would you like to check if your project qualifies?",
      intent: "faq",
      suggestedNextAction: "start_assessment",
    };
  }

  if (query.includes("whatsapp") || query.includes("crm") || query.includes("support") || query.includes("integrate") || query.includes("service")) {
    return {
      answer: "I build custom workflows connecting WhatsApp, CRM sheets, AI agents, and custom APIs using Next.js and n8n to eliminate manual copy-pasting. You can review my standard systems, or check if we are a good fit.",
      intent: "service_explanation",
      suggestedNextAction: "ask_question",
    };
  }

  if (query.includes("meeting") || query.includes("call") || query.includes("schedule") || query.includes("talk") || query.includes("contact")) {
    return {
      answer: "I'd love to chat. To make our call as productive as possible, please fill out the 2-minute diagnostic form first so I can review your current tech stack beforehand.",
      intent: "handoff",
      suggestedNextAction: "start_assessment",
    };
  }

  return {
    answer: "Hello! I am Mithun's AI operations assistant. I can explain my automation systems, standard pricing structures, or help you schedule a diagnostic consultation. What systems are you looking to automate?",
    intent: "qualification",
    suggestedNextAction: "ask_question",
  };
}
