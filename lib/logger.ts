export interface AutomationLog {
  id: string;
  requestId: string;
  leadId?: string;
  workflowExecutionId?: string;
  level: "info" | "warn" | "error";
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const logger = {
  info: (message: string, event: string, metadata?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: "info", event, message, metadata, createdAt: new Date().toISOString() }));
  },
  warn: (message: string, event: string, metadata?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: "warn", event, message, metadata, createdAt: new Date().toISOString() }));
  },
  error: (message: string, event: string, error?: unknown, metadata?: Record<string, unknown>) => {
    console.error(
      JSON.stringify({
        level: "error",
        event,
        message,
        error: error instanceof Error ? error.message : String(error),
        metadata,
        createdAt: new Date().toISOString()
      })
    );
  }
};
