/**
 * Centralized Payment Configuration for 15-Second QR Review SaaS.
 * 
 * You can set these environment variables in your .env / Vercel dashboard,
 * or replace the URLs below with your exact live checkout links from
 * PayPal and Lemon Squeezy.
 */

export interface PricingPlanConfig {
  id: "monthly" | "annual";
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  savingsBadge?: string;
  paypalUrl: string;
  lemonSqueezyUrl: string;
  stripeUrl?: string;
}

export const QR_REVIEW_PLANS: Record<"monthly" | "annual", PricingPlanConfig> = {
  monthly: {
    id: "monthly",
    name: "Growth Plan",
    price: 30,
    currency: "USD",
    interval: "month",
    // Configurable via NEXT_PUBLIC_PAYPAL_MONTHLY_URL or falls back to your live PayPal subscription link
    paypalUrl:
      process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_URL ||
      "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-1C0909029J424933WNKSC7RI",
    // Lemon Squeezy hosted checkout URL (Credit/Debit Cards & Apple Pay)
    lemonSqueezyUrl:
      process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL ||
      "https://mithundas.lemonsqueezy.com/checkout/buy/0e8fc160-76a1-4f4b-9b69-b11c9db46edb",
    stripeUrl: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL || "https://buy.stripe.com/test_qr_review_monthly"
  },
  annual: {
    id: "annual",
    name: "VIP Annual (Best Value)",
    price: 249,
    currency: "USD",
    interval: "year",
    savingsBadge: "Save 30% ($111 Off)",
    // Configurable via NEXT_PUBLIC_PAYPAL_ANNUAL_URL or falls back to your live PayPal annual subscription link
    paypalUrl:
      process.env.NEXT_PUBLIC_PAYPAL_ANNUAL_URL ||
      "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9XX50897WW0998235NKSD4LY",
    // Lemon Squeezy annual product checkout
    lemonSqueezyUrl:
      process.env.NEXT_PUBLIC_LEMON_SQUEEZY_ANNUAL_URL ||
      "https://mithundas.lemonsqueezy.com/checkout/buy/00dd862d-71eb-44e0-ab7b-d524afca1443",
    stripeUrl: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL || "https://buy.stripe.com/test_qr_review_annual"
  }
};

/**
 * Returns the direct payment URL for a given plan and provider
 */
export function getCheckoutUrl(
  plan: "monthly" | "annual",
  provider: "paypal" | "lemonsqueezy" | "stripe",
  businessSlug?: string
): string {
  const planConfig = QR_REVIEW_PLANS[plan];
  
  if (provider === "paypal") {
    // If business slug is provided, we append it as custom parameter for tracking
    const base = planConfig.paypalUrl;
    if (businessSlug && !base.includes("custom=")) {
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}custom=${encodeURIComponent(businessSlug)}`;
    }
    return base;
  }

  if (provider === "lemonsqueezy") {
    const base = planConfig.lemonSqueezyUrl;
    const hasEmbed = base.includes("embed=1");
    const sep = base.includes("?") ? "&" : "?";
    let url = hasEmbed ? base : `${base}${sep}embed=1`;
    if (businessSlug && !url.includes("checkout[custom]")) {
      const s = url.includes("?") ? "&" : "?";
      url = `${url}${s}checkout[custom][business_slug]=${encodeURIComponent(businessSlug)}`;
    }
    return url;
  }

  return planConfig.stripeUrl || "#";
}

export const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAAmpQfRc8Hu8Jwp8Knydw-h8f-ve-oVsJzLweqhfBNgG4eFSro1IckOpQEM87jn7NKR_U1fG7imRbXM0g",
  monthlyPlanId: "P-1C0909029J424933WNKSC7RI",
  annualPlanId: "P-9XX50897WW0998235NKSD4LY"
};
