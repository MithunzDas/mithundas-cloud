import { z } from "zod";

export const BusinessTypeSchema = z.enum([
  "service_business",
  "marketing_agency",
  "law_firm",
  "healthcare_clinic",
  "restaurant",
  "manufacturing_sme",
  "logistics",
  "ecommerce",
  "internal_operations",
  "other"
]);

export const BudgetRangeSchema = z.enum([
  "under_500",
  "500_1500",
  "1500_3000",
  "3000_7500",
  "7500_plus"
]);

export const TimelineRangeSchema = z.enum([
  "urgent_7_days",
  "this_month",
  "one_to_three_months",
  "exploring"
]);

export const LeadSubmissionRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().optional(),
  businessType: BusinessTypeSchema,
  company: z.string().min(1, "Company is required"),
  country: z.string().min(1, "Country is required"),
  projectRequirement: z.string().min(10, "Requirement details must be at least 10 characters"),
  budget: BudgetRangeSchema,
  timeline: TimelineRangeSchema,
  consent: z.boolean().refine(val => val === true, {
    message: "Consent is required"
  }),
  honeypot: z.string().optional()
});

export type LeadSubmissionRequest = z.infer<typeof LeadSubmissionRequestSchema>;
