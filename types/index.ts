export type BusinessType =
  | "service_business"
  | "marketing_agency"
  | "law_firm"
  | "healthcare_clinic"
  | "restaurant"
  | "manufacturing_sme"
  | "logistics"
  | "ecommerce"
  | "internal_operations"
  | "other";

export type BudgetRange =
  | "under_500"
  | "500_1500"
  | "1500_3000"
  | "3000_7500"
  | "7500_plus";

export type TimelineRange =
  | "urgent_7_days"
  | "this_month"
  | "one_to_three_months"
  | "exploring";

export type LeadStatus =
  | "new"
  | "validated"
  | "qualified"
  | "needs_more_info"
  | "call_scheduled"
  | "proposal_sent"
  | "won"
  | "lost"
  | "not_fit";

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  company: string;
  country: string;
  businessType: BusinessType;
  requirement: string;
  budget: BudgetRange;
  timeline: TimelineRange;
  status: LeadStatus;
  priority: "low" | "medium" | "high";
  leadScore: number;
  aiSummary?: string;
  source: "website" | "chatbot" | "referral" | "manual";
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  leadId?: string;
  workflowName: string;
  status: "queued" | "running" | "success" | "failed" | "retrying";
  steps: WorkflowStep[];
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface WorkflowStep {
  key: string;
  label: string;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  timestamp?: string;
  metadata?: Record<string, unknown>;
}
