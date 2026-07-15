"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadSubmissionRequestSchema } from "@/lib/validation";
import type { LeadSubmissionRequest } from "@/lib/validation";
import { cn } from "@/lib/utils";

// Define form steps
const STEPS = [
  { id: "profile", label: "Contact Profile" },
  { id: "requirements", label: "Requirements" },
  { id: "timeline_budget", label: "Timeline & Budget" },
];

const BUSINESS_TYPES = [
  { value: "service_business", label: "Service Business" },
  { value: "marketing_agency", label: "Marketing Agency" },
  { value: "law_firm", label: "Law Firm" },
  { value: "healthcare_clinic", label: "Healthcare Clinic" },
  { value: "restaurant", label: "Restaurant" },
  { value: "manufacturing_sme", label: "Manufacturing SME" },
  { value: "logistics", label: "Logistics" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "internal_operations", label: "Internal Operations" },
  { value: "other", label: "Other Business" },
];

const BUDGET_RANGES = [
  { value: "under_500", label: "Under $500" },
  { value: "500_1500", label: "$500 - $1,500" },
  { value: "1500_3000", label: "$1,500 - $3,000" },
  { value: "3000_7500", label: "$3,000 - $7,500" },
  { value: "7500_plus", label: "$7,500+" },
];

const TIMELINE_RANGES = [
  { value: "urgent_7_days", label: "Urgent (under 7 days)" },
  { value: "this_month", label: "This Month" },
  { value: "one_to_three_months", label: "1 to 3 Months" },
  { value: "exploring", label: "Just Exploring" },
];

export function LeadAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartTime] = useState(Date.now());

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<LeadSubmissionRequest>({
    resolver: zodResolver(LeadSubmissionRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      company: "",
      country: "",
      businessType: "service_business",
      projectRequirement: "",
      budget: "500_1500",
      timeline: "this_month",
      consent: false,
      honeypot: "",
    },
  });

  const nextStep = async () => {
    // Determine fields to validate based on current step
    let fieldsToValidate: Array<keyof LeadSubmissionRequest> = [];
    if (currentStep === 0) {
      fieldsToValidate = ["name", "email", "whatsapp", "company", "country"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["businessType", "projectRequirement"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: LeadSubmissionRequest) => {
    // Honey pot check
    if (data.honeypot) {
      console.warn("Spam submission blocked via honeypot.");
      setSubmitStatus("success"); // Faked success to trick bots
      return;
    }

    // Bot check: minimal completion time (e.g. 3 seconds)
    const timeElapsed = (Date.now() - formStartTime) / 1000;
    if (timeElapsed < 3) {
      console.warn("Spam submission blocked: too fast.");
      setSubmitStatus("success"); // Fake success for instant submissions
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to submit assessment.");
      }

      setSubmitStatus("success");
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-accent-green/20 bg-background-surface p-8 text-center shadow-panel"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/10">
          <CheckCircle2 className="h-6 w-6 text-accent-green" />
        </div>
        <h2 className="mt-4 font-sans text-h3 font-bold text-text-primary">
          Assessment Received Successfully
        </h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-body text-text-secondary leading-relaxed">
          Your assessment workflow has been triggered. An internal lead profile is generated, and a
          confirmation payload has been routed to your channels. Expect a detailed response within 24 hours.
        </p>
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Submit Another Response
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-border-subtle bg-background-surface/80 p-6 shadow-panel backdrop-blur-md md:p-8">
      {/* Progress Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-label font-bold transition-all duration-base",
                  idx <= currentStep
                    ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-mono"
                    : "border-border-subtle bg-background-inset text-text-muted font-mono"
                )}
              >
                {idx + 1}
              </div>
              <span
                className={cn(
                  "hidden font-mono text-[10px] uppercase tracking-wider md:block",
                  idx === currentStep ? "text-accent-cyan" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-base",
                  idx < currentStep ? "bg-accent-cyan/60" : "bg-border-subtle"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error alert banner */}
      {submitStatus === "error" && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-accent-red/20 bg-accent-red/8 p-3 text-accent-red">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div className="font-sans text-small leading-tight">{errorMessage}</div>
        </div>
      )}

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Hidden Honeypot */}
        <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} />

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Full Name <span className="text-accent-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  {...register("name")}
                  className={cn(
                    "mt-1.5 w-full rounded border bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan",
                    errors.name ? "border-accent-red/65" : "border-border-subtle"
                  )}
                />
                {errors.name && (
                  <span className="mt-1 block font-sans text-label text-accent-red">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Email Address <span className="text-accent-red">*</span>
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  {...register("email")}
                  className={cn(
                    "mt-1.5 w-full rounded border bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan",
                    errors.email ? "border-accent-red/65" : "border-border-subtle"
                  )}
                />
                {errors.email && (
                  <span className="mt-1 block font-sans text-label text-accent-red">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  {...register("whatsapp")}
                  className="mt-1.5 w-full rounded border border-border-subtle bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    Company Name <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Apex Scale Ltd"
                    {...register("company")}
                    className={cn(
                      "mt-1.5 w-full rounded border bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan",
                      errors.company ? "border-accent-red/65" : "border-border-subtle"
                    )}
                  />
                  {errors.company && (
                    <span className="mt-1 block font-sans text-label text-accent-red">
                      {errors.company.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    Country <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="United States"
                    {...register("country")}
                    className={cn(
                      "mt-1.5 w-full rounded border bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan",
                      errors.country ? "border-accent-red/65" : "border-border-subtle"
                    )}
                  />
                  {errors.country && (
                    <span className="mt-1 block font-sans text-label text-accent-red">
                      {errors.country.message}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Business Classification <span className="text-accent-red">*</span>
                </label>
                <select
                  {...register("businessType")}
                  className="mt-1.5 w-full rounded border border-border-subtle bg-background-inset px-3 py-2.5 font-sans text-small text-text-primary outline-none focus:border-accent-cyan"
                >
                  {BUSINESS_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-background-elevated">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  What is your workflow bottleneck? <span className="text-accent-red">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what manual workflows consume the most time or which tools you'd like to integrate..."
                  {...register("projectRequirement")}
                  className={cn(
                    "mt-1.5 w-full resize-none rounded border bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none transition-colors focus:border-accent-cyan",
                    errors.projectRequirement ? "border-accent-red/65" : "border-border-subtle"
                  )}
                />
                {errors.projectRequirement && (
                  <span className="mt-1 block font-sans text-label text-accent-red">
                    {errors.projectRequirement.message}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Target Budget Range <span className="text-accent-red">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {BUDGET_RANGES.map((rng) => (
                    <label
                      key={rng.value}
                      className="flex cursor-pointer items-center justify-between rounded border border-border-subtle bg-background-inset/40 px-3.5 py-2.5 transition-colors hover:border-accent-cyan/20"
                    >
                      <span className="font-sans text-small text-text-secondary">{rng.label}</span>
                      <input
                        type="radio"
                        value={rng.value}
                        {...register("budget")}
                        className="accent-accent-cyan"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Desired Delivery Timeline <span className="text-accent-red">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {TIMELINE_RANGES.map((rng) => (
                    <label
                      key={rng.value}
                      className="flex cursor-pointer items-center justify-between rounded border border-border-subtle bg-background-inset/40 px-3.5 py-2.5 transition-colors hover:border-accent-cyan/20"
                    >
                      <span className="font-sans text-small text-text-secondary">{rng.label}</span>
                      <input
                        type="radio"
                        value={rng.value}
                        {...register("timeline")}
                        className="accent-accent-cyan"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4">
                <label className="flex cursor-pointer items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="mt-1 h-3.5 w-3.5 accent-accent-cyan"
                  />
                  <span className="font-sans text-label text-text-muted leading-tight">
                    I consent to routing my project metrics through Mithun Das AI systems in
                    accordance with the Privacy Policy. *
                  </span>
                </label>
                {errors.consent && (
                  <span className="mt-1.5 block font-sans text-label text-accent-red">
                    {errors.consent.message}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="gap-1.5 font-semibold text-text-secondary disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="gap-1.5 font-semibold"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5 bg-accent-green hover:bg-accent-green/80 text-text-inverse font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
              <Send className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
