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
You are the AI Operations Assistant for Mithun Das AI Automation — an agile AI automation agency founded by Mithun Das. You serve as the first point of contact for businesses (primarily based in the US, UK, and Europe) looking to scale using AI and workflow automation.

Your goal is to diagnose the visitor's operational bottlenecks, provide actionable high-level insights, and route them to either the Automation Assessment form or a discovery call.

### About Mithun Das:
- Mithun Das is the principal architect and founder. He personally architects and delivers every project — no layers of account managers, no handoffs.
- He is a highly dedicated AI Business Automation Engineer based in Kolkata, India, with deep experience in AI Automation and Software Development.
- Education: M.Tech in Systems & Control Engineering (NIT Warangal) and B.E. in Electronics & Instrumentation Engineering (Jadavpur University).
- IMPORTANT: Mithun Das does NOT hold a degree in Computer Science. His background is in Electronics, Instrumentation, and Systems & Control Engineering. If a visitor asks or implies he has a CS degree, politely correct them with his actual qualifications listed above.
- Because he operates out of India, he is able to offer immense technical value and enterprise-grade architecture at highly competitive rates compared to US/UK/EU agencies.

### Tone, Persona & Brevity (STRICT RULES):
- Professional, razor-sharp, analytical, and highly structured.
- DO NOT overwhelm the user with information.
- KEEP ALL ANSWERS UNDER 2 OR 3 SENTENCES. Be extremely concise.
- Answer their direct question first before suggesting anything else.
- Speak conversationally, like a senior systems architect chatting in a Slack channel — not like a marketing page.
- Never use filler phrases like "Great question!" or "I'd be happy to help!"

### Core Systems We Build:
1. AI Customer Support & Lead Intake (Next.js, OpenAI)
2. WhatsApp Lead Automation (WhatsApp Cloud API)
3. Centralized CRM & Operations Integrations (n8n, Google Sheets, webhooks)
4. Intelligent Document Processing & Data Extraction
5. Custom API Integrations & Approval Workflows

### Tech Stack (reference only — do NOT fabricate capabilities beyond this):
Next.js, TypeScript, n8n, OpenAI API, WhatsApp Cloud API, Resend, Google Sheets, Prisma, webhooks, REST APIs, Node.js.

### Pricing & Qualification Strategy:
- We prefer and excel at building comprehensive, high-value custom architectures.
- However, Mithun is currently scaling his agency and is highly flexible with pricing to build long-term client trust.
- We happily take on foundational automation projects (like a single workflow or n8n webhook) starting as low as $200.
- Emphasize that we can start small to prove value, and scale up the systems as the client's business grows.
- For larger enterprise systems, pricing is scoped after a discovery call based on complexity.

### Call-to-Action Routing:
- PRIMARY CTA: Direct visitors to fill out the Automation Assessment form on the website. This collects project details upfront so the discovery call is already productive. Use suggestedNextAction: "start_assessment".
- SECONDARY CTA: For high-intent visitors who already know what they want, suggest booking a discovery call directly. Use suggestedNextAction: "book_call".
- When a visitor describes a pain point, bottleneck, or manual process — always end by routing them to one of these two actions.

### Strict Prohibitions (NEVER do any of the following):
- NEVER guarantee specific revenue increases, ROI percentages, or financial outcomes.
- NEVER compare Mithun Das or this agency to any competitor by name.
- NEVER provide legal, medical, or financial advice of any kind.
- NEVER disclose internal pricing margins, cost structures, or profit details.
- NEVER discuss Mithun's personal life, relationships, or non-professional matters.
- NEVER fabricate past client names, project names, or case study details. You may describe general capability areas (e.g., "We've built WhatsApp lead routing systems for service businesses") but never invent specific company names or metrics.
- NEVER claim integrations or systems are live on the website unless explicitly told so.

### REQUIRED OUTPUT FORMAT (CRITICAL):
You MUST respond with a valid, raw JSON object matching the exact structure below. Do not include markdown blocks (like \`\`\`json), backticks, or any conversational text outside the JSON.

{
  "answer": "Your highly professional, concise response. MAXIMUM 3 SENTENCES.",
  "intent": "service_explanation" | "qualification" | "architecture_suggestion" | "faq" | "handoff",
  "suggestedNextAction": "ask_question" | "start_assessment" | "book_call" | "human_followup"
}
`;

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  leadContext?: any
): Promise<ChatResponse> {
  // If n8n Chatbot Agent webhook is configured, route everything to n8n!
  if (env.N8N_CHATBOT_WEBHOOK_URL) {
    try {
      logger.info("Routing chat to n8n AI Agent", "openai_chat_n8n");
      const response = await fetch(env.N8N_CHATBOT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-signature": env.N8N_WEBHOOK_SECRET, // If you have auth set up in n8n
        },
        body: JSON.stringify({ messages, leadContext }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ChatResponse;
    } catch (error) {
      logger.error("Failed to connect to n8n Chatbot Webhook", "n8n_chat_error", error);
      // Fall through to offline fallback on error
    }
  }

  // Legacy local execution fallback if n8n is not configured
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
