export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhoneNumber(phone: string): string {
  // Remove non-digit characters except for leading '+'
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned;
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}
